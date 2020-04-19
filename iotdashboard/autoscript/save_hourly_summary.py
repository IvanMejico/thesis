import pymysql
import schedule
import time
from datetime import datetime

def getRecords(sensorId, prevDateTimeHour):
    db = pymysql.connect("localhost", "root", "", "sensor_database")
    cursor = db.cursor()
    queryString = "SELECT voltage, current, timestamp FROM energy_reading WHERE `sensor_id` = '" + sensorId + "' AND timestamp  LIKE '" + prevDateTimeHour + "%' ORDER BY timestamp;"

    try:
        cursor.execute(queryString)
        results = cursor.fetchall()
        return results
    except pymysql.Error:
        print("Error: unable to fetch data")

    db.close()

def insertRecord(sensorValues):
    # sensorValues = [sensorId, voltage, current, timestamp]
    db = pymysql.connect("localhost", "root", "", "sensor_database")
    cursor = db.cursor()

    sensorId = sensorValues[0]
    voltage = sensorValues[1]
    current = sensorValues[2]
    timestamp = sensorValues[3]

    queryString = "INSERT INTO energy_summary (sensor_id, voltage, current, timestamp) VALUES('%s', '%f', '%f', '%s');" % (sensorId, voltage, current, timestamp)

    try:
        cursor.execute(queryString)
        db.commit()
    except pymysql.Error:
        print('Cannot save data to the database!')
        db.rollback()

    db.close()

def deleteRecords(sensorId, prevDateTimeHour):
    db = pymysql.connect("localhost", "root", "", "sensor_database")
    cursor = db.cursor()

    queryString = "DELETE FROM energy_reading WHERE `sensor_id` = '" + sensorId + "' AND `timestamp` LIKE '" + prevDateTimeHour + "%'"
    
    try:
        cursor.execute(queryString)
        db.commit()
    except pymysql.Error:
        print('Cannot save data to the database!')
        db.rollback()

    db.close()

def getPrevDateTimeHour():
    timeNow = datetime.now().strftime("%H:%M:%S")
    dateNow = datetime.now().strftime("%Y-%m-%d")
    hour = int(timeNow.split(':')[0])

    prevHour = hour - 1
    if(prevHour == 0) : prevHour=24

    prevTimeHour = str(prevHour)
    if(prevHour<=9) : prevTimeHour="0"+prevTimeHour

    prevDateTimeHour = dateNow + ' ' + prevTimeHour
    return prevDateTimeHour

def job():
    sensorId = 'PSN001'
    
    currentRunningSum = 0
    voltageRunningSum = 0

    prevDateTimeHour = getPrevDateTimeHour()

    results = getRecords(sensorId, prevDateTimeHour)
    numRows = len(results)
    
    for row in results:
        # print("voltage: "+str(row[0]), "current: "+str(row[1]), "timestamp: "+row[2].strftime("%Y-%m-%d %H:%M:%S"))
        voltageRunningSum += row[0]
        currentRunningSum += row[1]

    if(numRows):        
        voltageAvg = voltageRunningSum/numRows
        currentAvg = currentRunningSum/numRows
        timestamp = prevDateTimeHour+":"+"00:00"
        # print("____________")
        print("average voltage: " + str(voltageAvg), "average current: " + str(currentAvg) + "timestamp: " + timestamp)

        # SAVE DATA
        sensorValues = [sensorId, voltageAvg, currentAvg, timestamp]
        insertRecord(sensorValues)

        # DELETE DATA
        deleteRecords(sensorId, prevDateTimeHour)

    else:
        print("No records found!")

schedule.every().hour.at(":00").do(job)

while 1:
    schedule.run_pending()
    time.sleep(1)