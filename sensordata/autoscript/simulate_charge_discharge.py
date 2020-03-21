import pymysql
import schedule
import time
from random import seed
from random import gauss
import math

def getLevel():
    db = pymysql.connect("localhost", "root", "", "sensor_database")
    cursor = db.cursor()
    sql = "SELECT `level` from `battery_level`"

    try:
        cursor.execute(sql)
        results = cursor.fetchall()
        level = results[0][0]
        return level
    except pymysql.Error:
        print("Error: unable to fetch battery level")

def updateLevel(level):
    db = pymysql.connect("localhost", "root", "", "sensor_database")
    cursor = db.cursor()
    sql = "UPDATE `battery_level` SET `level`="+str(level)

    try:
        cursor.execute(sql)
        db.commit()
    except pymysql.Error:
        db.rollback()

def dischargeBattery():
    level = getLevel()
    if(level != 0):
        level-=math.floor(abs(gauss(0,6)))
        if(level >= 0):
            updateLevel(level)
            print("discharge: " + str(level)+"%")
        
def chargeBattery():
    level = getLevel()
    if(level !=100):
        level+=2
        updateLevel(level)
        print("charge: " + str(level)+"%")

def drain():
    updateLevel(0)

def sim():
    level = getLevel()
    if(level == 100):
        drain()
    else:
        chargeBattery()
    


# schedule.every(.12).minutes.do(dischargeBattery)
# schedule.every(.02).minutes.do(chargeBattery)
schedule.every(.016).minutes.do(sim)

drain()

while 1:
    schedule.run_pending()
    time.sleep(1)
