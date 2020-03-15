# TODO GET THE CURRENT LEVEL OF THE BATTERY.
# THEN BASED ON BRACKET VALUE TURN ON AND OFF LOADS

import pymysql
import schedule
import time
from datetime import datetime
import math

def activateRelay(relayId):
    db = pymysql.connect("localhost", "root", "", "sensor_database")
    cursor = db.cursor()
    sql = "UPDATE relay_control SET status = 'TR'  WHERE relay_id = '%s'" % (relayId)

    try:
        cursor.execute(sql)
        db.commit()
    except pymysql.Error:
        db.rollback()

    db.close()
    print('RELAY'+ relayId +' ON')

def deactivateRelay(relayId):
    db = pymysql.connect("localhost", "root", "", "sensor_database")
    cursor = db.cursor()
    sql = "UPDATE relay_control SET status = 'FL'  WHERE relay_id = '%s'" % (relayId)

    try:
        cursor.execute(sql)
        db.commit()
    except pymysql.error:
        db.rollback()

    db.close()
    print('RELAY'+ relayId +' OFF')

def getPriorityLoad(level):
    sql = "SELECT `relay_id` FROM `relay_control` WHERE priority_level="+str(level)
    db = pymysql.connect("localhost", "root", "", "sensor_database")
    cursor = db.cursor()

    try:
        cursor.execute(sql)
        results = cursor.fetchall()
        relayId = results[0][0]
        return relayId
    except pymysql.Error:
        print("Error: unable to fetch relay id")

def checkBattery():
    db = pymysql.connect("localhost", "root", "", "sensor_database")
    cursor = db.cursor()
    sql = "SELECT `level` FROM battery_level"
    try:
        cursor.execute(sql)
        results = cursor.fetchall()
        soc = results[0][0] # gets the first cell of the first row
        print(soc)

        priority1 = getPriorityLoad(1)
        priority2 = getPriorityLoad(2)
        priority3 = getPriorityLoad(3)
        priority4 = getPriorityLoad(4)

            
        if(soc < 75):
            print('PRIORITY 4:')
            deactivateRelay(priority4)
        else:
            print('PRIORITY 4:')
            activateRelay(priority4)

        if(soc < 50):
            print('PRIORITY 3:')
            deactivateRelay(priority3)
        else:
            print('PRIORITY 3:')
            activateRelay(priority3)
        
        if(soc < 25):
            print('PRIORITY 2:')
            deactivateRelay(priority2)
        else:
            print('PRIORITY 2:')
            activateRelay(priority2)

        if(math.floor(soc) <= 0):
            print('PRIORITY 1:')
            deactivateRelay(priority1)
        else:
            print('PRIORITY 1:')
            activateRelay(priority1)


    except pymysql.Error:
        print("Error: unable to fetch battery level")

schedule.every(.1).minutes.do(checkBattery)

while 1:
    schedule.run_pending()
    time.sleep(1)
