#!/usr/bin/env python3

import pymysql
import math
import sys
from random import seed, gauss
from datetime import datetime, timedelta
from dateutil import parser
import time
import schedule
import requests as req

class ReadingsTable:
    def __init__(self, name, columns = []):
        self.name = name
        self.columns = columns
        self._conf = {"dateformat":"%Y-%m-%d"}

    def DBConnect(self, server, username, password, database):
        self.db = pymysql.connect(server, username, password, database)

    def _getDatetimeScope(self, nodeId, scope, interval=60):
        temp = []
        start = None
        for key in scope:
            keyIndex = list(scope.keys()).index(key)
            date = scope[key]
            if key == "start" or key == "end":
                if isinstance(date, str):
                    d = None
                    if date == "first":
                        d = self._getEarliestTimestamp(nodeId)
                        if keyIndex == 1:
                            d = d - timedelta(seconds=interval)
                        temp.append((key,d))
                    elif date == "last":
                        d = self._getLatestTimestamp(nodeId)
                        if keyIndex  == 0:
                            d = d + timedelta(seconds=interval)
                        temp.append((key,d))
                    else:
                        d = self._stringToDatetime(date)
                        temp.append((key,d))
                    if key == "start":
                        start = d
                elif isinstance(date, datetime):
                    temp.append((key, date))
                else:
                    raise Exception("Invalid datetime value inside scope.")
            elif key == "offset":
                date = start + timedelta(days=scope[key])
                temp.append(("end", date))
        if len(temp) == 0:
            raise Exception("No datetime value was appended")
        if temp[0] == temp[1]:
            raise Exception("start and end values are the same")
        return dict(temp)

    def _buildSQL(self, operation):
        if operation.lower() == "insert":
            s1 = "INSERT INTO %s(" % self.name
            s2 = " VALUES("
            for column in self.columns:
                s1 += column + ","
                s2 += "%s,"
            s1 = s1.rstrip(",")
            s2 = s2.rstrip(",")
            s1 += ")"
            s2 += ")"
            sql = s1 + s2
        elif operation.lower() == "delete":
            sql = "DELETE FROM " + self.name + " WHERE node_id = %s AND timestamp >= %s AND timestamp <= %s"
        return sql


    def _getEarliestTimestamp(self, nodeId):
        sql = "SELECT timestamp FROM " + self.name + " WHERE node_id = '%s' ORDER BY timestamp LIMIT 1" % nodeId
        cursor = self.db.cursor()
        nRows = cursor.execute(sql)
        if nRows > 0:
            timestamp =  cursor.fetchone()[0]
            return timestamp
        else:
            print("No data retrieved for %s" % nodeId)
            sys.exit()

    def _getLatestTimestamp(self, nodeId):
        sql = "SELECT timestamp FROM " + self.name + " WHERE node_id = '%s' ORDER BY timestamp DESC LIMIT 1" % nodeId
        cursor = self.db.cursor()
        nRows = cursor.execute(sql)
        if nRows > 0:
            timestamp =  cursor.fetchone()[0]
            return timestamp
        else:
            print("No data retrieved for %s" % nodeId)
            sys.exit()

    def _save(self, sql, data):
        cursor = self.db.cursor()
        try:
            nRows = cursor.execute(sql, data)
            self.db.commit()
            return nRows
        except pymysql.Error as e:
            self.db.rollback()
            print("Something went wrong in saving changes to the database: %d: %s" \
                  %(e.args[0], e.args[1]))

    def _checkForScopeOverlap(self, nodeId, scope):
        nRows = self.getRowCount(nodeId, scope)
        if nRows > 0:
            print("OVERLAP: There are %s rows within the specified scope. Please try again." \
                  % nRows)
            sys.exit()

    def _stringToDatetime(self, datestring):
        try:
            datestring = datestring.replace("_", " ")
            print(datestring)
            return parser.parse(datestring)
        except ValueError as err:
            print("Error in parsing datetime string.")
            print(err)

    def getRows(self, nodeId, scope):
        scope = self._getDatetimeScope(nodeId, scope)
        sql = "SELECT * FROM " + self.name + " WHERE node_id = %s AND timestamp >= %s AND timestamp <= %s"
        data = (nodeId, scope["start"], scope["end"])
        cursor = self.db.cursor()
        try:
            cursor.execute(sql, data)
            return cursor.fetchall()
        except pymysql.Error as e:
            print("Unable to fetch data. %d: %s" \
                  %(e.args[0], e.args[1]))

    def getRowCount(self, nodeId, scope):
        scope = self._getDatetimeScope(nodeId, scope)
        sql = "SELECT COUNT(*) FROM " + self.name + " WHERE node_id = %s AND timestamp >= %s AND timestamp <= %s"
        cursor = self.db.cursor()
        data = (nodeId, scope["start"], scope["end"])
        try:
            cursor.execute(sql, data)
            nRows = cursor.fetchone()[0]
            return nRows
        except pymysql.Error as e:
            print("Unable to fetch data. %d: %s" \
                  %(e.args[0], e.args[1]))

    def bulkDelete(self, nodeId, scope):
        scope = self._getDatetimeScope(nodeId, scope)
        sql = self._buildSQL("delete")
        data = (nodeId, scope["start"], scope["end"])
        numRows = self._save(sql, data)
        if numRows >= 0:
            print("%s rows deleted." % numRows)

    def bulkInsertFromLatest(self, nodeId, numRows, interval):
        latest = self._getLatestTimestamp(nodeId)
        if not latest:
            print("No record found from the database")
            return
        timestamp = latest
        print("Inserting data...")
        sql = self._buildSQL("insert")
        for x in range(numRows):
            timestamp += timedelta(seconds=interval)
            datalist = []
            for column in self.columns:
                if column == "node_id":
                    datalist.append(nodeId)
                elif column == "timestamp":
                    datalist.append(timestamp)
                else:
                    datalist.append(round(abs(gauss(0, 50)), 2))
            datalist = tuple(datalist)
            cursor = self.db.cursor()
            try:
                cursor.execute(sql, datalist)
                self.db.commit()
            except pymysql.Error:
                self.db.rollback()
        d_from = latest
        d_to = timestamp
        print("DONE: Inserted %s rows from %s to %s" % (numRows, d_from, d_to))

    def bulkInsert(self, nodeId, scope, interval=60):
        scope = self._getDatetimeScope(nodeId, scope, interval)
        self._checkForScopeOverlap(nodeId, scope)
        numOfInsertedRows = 0
        timestamp = scope["start"]
        while timestamp <= scope["end"]:
            datalist = []
            for column in self.columns:
                if column == "node_id":
                    datalist.append(nodeId)
                elif column == "timestamp":
                    datalist.append(timestamp)
                else:
                    datalist.append(round(abs(gauss(0, 50)), 2))
            datalist = tuple(datalist)
            timestamp += timedelta(seconds=interval)
            sql = self._buildSQL("insert")
            if self._save(sql, datalist):
                print("--------------------------------------------------------------")
                print("INSERTED:", datalist)
                print("--------------------------------------------------------------")
                numOfInsertedRows += 1
            else:
                print("INSERTION FAILED")
        print("+++++++++++++++++++++++++++")
        print("%s rows inserted." % numOfInsertedRows) 

    def postData(self, nodeId, interval): 
        payload = []
        for key in self.columns:
            if key == "node_id":
                payload.append((key, nodeId))
            elif key == "timestamp":
                payload.append((key, self._ts.strftime("%Y-%m-%d %H:%M:%S")))
            else:
                payload.append((key, round(abs(gauss(0, 20)), 2))) 
        payload.append(('access_token', '5zdZNDGxtkbn5eS'))
        payload = dict(payload) 
        endpoint = 'requests.php';
        response = req.request(method='post',
                       url="http://localhost/iotdashboard/requests/" + endpoint,
                       params=payload)
        if response:
            print("--------------------------------------------------------------")
            print("SENT:", payload)
            print("--------------------------------------------------------------")
            print("RESPONSE:", response.text)
        self._ts += timedelta(seconds=interval)
    
    def doJob(self, nodeId, scope, interval, delay): 
        scope = self._getDatetimeScope(nodeId, scope, interval)
        self._ts = scope['start']
        schedule.every(delay).seconds.do(self.postData, nodeId, interval=60)
        while self._ts < scope['end']:
            schedule.run_pending()
            time.sleep(1)
    
    def printSelf(self):
        print(self)
        print("table name:", self.name)
        print("columns:", self.columns)
