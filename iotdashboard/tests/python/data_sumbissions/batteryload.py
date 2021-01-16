#!/usr/bin/env python3

# TODO:
# Python:
# 1. check if automatic_prioritization is set to 1(boolean true)
# 2. do not change if overriden

import pymysql
import requests as req 
import schedule
import time

class Battery: 
    def __init__(self):
        self.db = pymysql.connect("localhost", "root", "root", "sensor_database")

    def getSOC(self):
        cursor = self.db.cursor() 
        try:
            cursor.execute("SELECT level FROM battery_level");
            level = cursor.fetchone()[0]
            return level 
        except pymysql.Error:
            print("Error: unable to fetch data"); 

    def calculateCPC(self): 
        soc = self.getSOC() 

        l = Load()
        count = l.getLoadsCount() 

        chargePerCell = 100/count;
        for i in range(count):
            level = i + 1 
            status = 1 if soc > (level-1)*chargePerCell else 0
            l.setLoadStatus(str(level), str(status))


class Load:
    def __init__(self): 
        self.db = pymysql.connect("localhost", "root", "root", "sensor_database")

    def getLoadsCount(self):
        cursor = self.db.cursor() 
        try:
            cursor.execute("SELECT COUNT(*) FROM loads");
            loadCount = cursor.fetchone()[0]
            return loadCount; 
        except pymysql.Error:
            print("Error: unable to fetch data");

    def setLoadStatus(self, level, status): 
        cursor = self.db.cursor()
        try: 
            # get column names
            columns = []
            cursor.execute("SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_SCHEMA = 'sensor_database' AND TABLE_NAME = 'loads'");
            cols = cursor.fetchall(); 
            for col in cols:
                columns.append((col[0]));
            
            
            # build JSON payload
            payload = [] 
            cursor.execute("SELECT * FROM loads WHERE priority_level="+level);
            row = cursor.fetchone()
            print(row)
            if(len(row) > 1):
                i = 0
                for data in row: 
                    if columns[i] == "relay_status": 
                        payload.append((columns[i], status))
                    else:
                        payload.append((columns[i], data))
                    i += 1 

            payload = dict(payload)
            response = req.request(method='post',
                        url="http://localhost/iotdashboard/requests/relay.php",
                        params=payload) 
            if response:
                print("--------------------------------------------------------------")
                print("SENT:", payload)
                print("--------------------------------------------------------------")
                print("RESPONSE:", response.text)

        except pymysql.Error:
            print("Error: unable to fetch data"); 


def job():
    b = Battery() 
    b.calculateCPC()


schedule.every(2).seconds.do(job)

while 1:
    schedule.run_pending()
    time.sleep(1) 
