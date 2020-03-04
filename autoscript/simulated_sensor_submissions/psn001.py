import pymysql
from random import seed
from random import gauss
import schedule
import time
from datetime import datetime

def sendData():
    sensor_id = 'PSN001';
    voltage = abs(gauss(0,220))
    current = abs(gauss(0,2))
    timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S");

    print ("SENT: sensor_id = %s; voltage = %f; current = %f; timestamp = %s" % (sensor_id, voltage, current, timestamp))

    #open database connection
    db = pymysql.connect("localhost", "root", "", "sensor_database")

    #prepare a cursor object using cursor() method
    cursor = db.cursor()

    #prepare SQL query to INSERT a record into the database.
    sql = "INSERT INTO energy_reading(sensor_id, voltage, current, timestamp) values('%s','%f','%f','%s')" % (sensor_id, voltage, current, timestamp)

    try:
        #Execute the SQL command
        cursor.execute(sql)
        #commit changes in the database
        db.commit()
    except pymysql.Error:
        #Rollback in case there is any error
        db.rollback()

    #disconnected from server
    db.close()

schedule.every(.05).minutes.do(sendData)
while 1:
    schedule.run_pending()
    time.sleep(1)
