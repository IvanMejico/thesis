# To effectively change the time interval of data summarization, the space between
# the time of job execution must be changed accordingly.
# #

import pymysql
import schedule
import time
import datetime

# HELPER FUNCTIONS
def getTableNames(sensorId):
    db = pymysql.connect("localhost", "root", "", "sensor_database")
    cursor = db.cursor()

    sql = "SELECT `sensor_type` FROM  `sensor` WHERE `id` = '%s'" % sensorId

    try:
        cursor.execute(sql)
        result = cursor.fetchall()
        if (result):
            row = result[0]     # Get the first row of the result set
            sensorType = row[0] # Get the first column of the first row
            
            if(sensorType == 'electrical'):
                liveTableName = "energy_reading"
                summaryTableName = "energy_summary"
                tableNames = (liveTableName, summaryTableName)
                return tableNames
            elif(sensorType == 'environment'):
                liveTableName = "environment_reading"
                summaryTableName = "environment_summary"
                tableNames = (liveTableName, summaryTableName)
                return tableNames
        else:
            print("No sensor of id:%s was found in the database" % sensorId)
            return 0
    except pymysql.InternalError as error:
        code, message = error.args
        print (">>>>>>>>>>>>>", code, message)
# END OF HELPER FUNCTIONS


def deleteRecords(sensorId, timeStamp):
    # Get sensor type to determine which table data will be deleted from database
    dbTableName = getTableNames(sensorId)[0]

    db = pymysql.connect("localhost", "root", "", "sensor_database")
    cursor = db.cursor()

    sql = "DELETE FROM `%s` WHERE `sensor_id` = '%s' AND `timestamp` <= '%s';" % \
             (dbTableName, sensorId, timeStamp)

    try:
        tic = time.time() # get start time
        cursor.execute(sql)
        db.commit()
        toc = time.time()  # get stop time
        executionTime = toc-tic # calculate elapsed time
        print(sensorId + " ====> Record deletion successful (Execution time: " + str(executionTime))
    except pymysql.InternalError as error:
        code, message = error.args
        print (">>>>>>>>>>>>>", code, message)
        db.rollback()
        print("Cannot delete data from the database!")

    db.close()

def insertRecord(sensorId, sensorValues):
    
    dbTableNames = getTableNames(sensorId)
    summaryTableName = dbTableNames[1] # Index 0 for live table and 1 for summary table

    sensorId = sensorValues[0]
    value1 = sensorValues[1]
    value2 = sensorValues[2]
    timestamp = sensorValues[3]

    sql = ""
    
    # There might be some better way of finding the column names without using if-else
    # statements or doing an extra query to the database.
    if (summaryTableName == "environment_summary"):
        sql = "INSERT INTO `%s` (sensor_id, average_wind_speed, average_solar_irradiance, timestamp)" 
        sql += "VALUES ('%s','%f','%f','%s')" 
        sql = sql % (summaryTableName, sensorId, value1, value2, timestamp)
    elif(summaryTableName == "energy_summary"):
        sql = "INSERT INTO `%s` (sensor_id, average_voltage, average_current, timestamp)" 
        sql += "VALUES ('%s','%f','%f','%s')" 
        sql = sql % (summaryTableName, sensorId, value1, value2, timestamp)
    else:
        print("INSERT DATA: Table names did not match!")

    db = pymysql.connect("localhost", "root", "", "sensor_database")
    cursor = db.cursor()

    # print("INSERT QUERY:"+sql)

    try:
        tic = time.time() # get start time
        cursor.execute(sql)
        db.commit()
        toc = time.time() # get stop time
        executionTime = toc-tic # calculate elapsed time
        print(sensorId + " ====> Record insertion successful (Execution time: " + str(executionTime))
    except pymysql.InternalError as error:
        code, message = error.args
        print (">>>>>>>>>>>>>", code, message)
        db.rollback()
        print('Cannot insert data to the database!')

    db.close()

def getIntervalData(sensorId, minutes):
    interval = datetime.timedelta(minutes=minutes)
    
    ## Get current time
    now = datetime.datetime.now()
    strNow = now.strftime("%Y-%m-%d %H:%M")
    strNow = strNow+":00"
    ## Subtract current time by 15 minutes
    then = now - interval
    strThen = then.strftime("%Y-%m-%d %H:%M")
    strThen = strThen+":00"

    ## Get live table name
    dbTableNames = getTableNames(sensorId)
    liveTableName = dbTableNames[0]

    if (liveTableName == "environment_reading"):
        sql = "SELECT `wind_speed`, `solar_irradiance`, `timestamp` FROM `%s` " + \
            "WHERE `sensor_id`='%s' AND `timestamp` >= '%s' AND `timestamp` <= '%s';"
        sql = sql % (liveTableName, sensorId, strThen, strNow)
    elif(liveTableName == "energy_reading"):
        sql = "SELECT `voltage`, `current`, `timestamp` FROM `%s` " + \
            "WHERE `sensor_id`='%s' AND `timestamp` >= '%s' AND `timestamp` <= '%s';"
        sql = sql % (liveTableName, sensorId, strThen, strNow)
    else:
        print("GET INTERVAL DATA: Table names did not match!")

    ## Execute query with current and previous datetime strings as parameters
    db = pymysql.connect("localhost", "root", "", "sensor_database")
    cursor = db.cursor()
    # print("QUERY: %s" % sql)
    
    try:
        tic = time.time()
        cursor.execute(sql)
        toc = time.time()
        executionTime = toc-tic
        print(sensorId + " ====> Data retrieval successful (Execution time: "+str(executionTime)+")")
        results = cursor.fetchall()
        print(sensorId + " ====> ROWS: " +str(len(results)))
        return results, strNow

    except pymysql.InternalError as error:
        code, message = error.args
        print (">>>>>>>>>>>>>", code, message)

def calcElectricalMean(sensorId, minsInterval):
    currentRunningSum = 0
    voltageRunningSum = 0

    ## get the mean of all the return rows of data
    result = getIntervalData(sensorId, minsInterval)
    sensorReadings = result[0]
    timeStamp = result[1] # current timestamp
    numRows = len(sensorReadings)

    # print("number of rows: %d" % numRows)

    for row in sensorReadings:
        voltageRunningSum += row[0]
        currentRunningSum += row[1]


    if(numRows):
        voltageAvg = voltageRunningSum/numRows
        currentAvg = currentRunningSum/numRows

        ##### FOR DEBUGGING ONLY
        print("____________________________________________________________________________________________________________________")
        print("average voltage: %s average_curent: %s " % (voltageAvg, currentAvg))

        ## insert record to data summary table
        sensorData = []
        sensorData.append(sensorId)
        sensorData.append(voltageAvg)
        sensorData.append(currentAvg)
        sensorData.append(timeStamp)

        # Insert interval data from live table to data summary table
        insertRecord(sensorId, sensorData)

        ## delete data from live data table
        deleteRecords(sensorId, timeStamp) # Delete interval data from live table
    else:
        print("No records found for sensor id: %s!" % sensorId)

def calcEnvironmentalMean(sensorId, minsInterval):
    speedRunningSum = 0
    insolationRunningSum = 0

    ### get the mean of all the return rows of data
    result = getIntervalData(sensorId, minsInterval)
    sensorReadings = result[0]
    timeStamp = result[1]
    numRows = len(sensorReadings)

    # print("number of rows: %d" % numRows)

    for row in sensorReadings:
        speedRunningSum += row[0]
        insolationRunningSum += row[1]

    if(numRows > 0):
        speedAvg = speedRunningSum/numRows
        insolationAvg = insolationRunningSum/numRows

        ##### FOR DEBUGGING ONLY
        print("____________________________________________________________________________________________________________________")
        print("average wind speed: %s average solar insolation: %s " % (speedAvg, insolationAvg))

        # insert record to data summary table
        sensorData = []
        sensorData.append(sensorId)
        sensorData.append(speedAvg)
        sensorData.append(insolationAvg)
        sensorData.append(timeStamp)
        
        ## Insert interval data from live table to data summary table
        insertRecord(sensorId, sensorData) 

        ## Delete interval data from live table
        deleteRecords(sensorId, timeStamp) 
    else:
        print("No records found for sensor id: %s!" % sensorId)

# Calculate average sensor readings for each respective sensor nodes in the database
def job():
    minsInterval = 15 # length of time interval in minutes

    # get list of seNsors
    db = pymysql.connect("localhost", "root", "", "sensor_database")
    cursor = db.cursor()
    sql = "SELECT id, sensor_type FROM `sensor`" 

    try:
        cursor.execute(sql)
        results = cursor.fetchall()
        for row in results:
            sensorId = row[0]
            sensorType = row[1] 
            if(sensorType == 'electrical'):
                calcElectricalMean(sensorId, minsInterval)
                print('\n\n')
            elif(sensorType == 'environment'):
                calcEnvironmentalMean(sensorId, minsInterval)
                print('\n\n')

    except pymysql.InternalError as error:
        code, message = error.args
        print (">>>>>>>>>>>>>", code, message)

print("Running script ...")
schedule.every().hour.at(":00").do(job)
schedule.every().hour.at(":15").do(job)
schedule.every().hour.at(":30").do(job)
schedule.every().hour.at(":45").do(job)
print("====================================================================================================================\n\n")


while 1:
    schedule.run_pending()
    time.sleep(1)
