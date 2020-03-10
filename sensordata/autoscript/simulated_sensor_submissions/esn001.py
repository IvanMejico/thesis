import pymysql
from random import seed
from random import gauss
import schedule
import time
from datetime import datetime

def sendData():
    sensor_id = 'ESN001';
    wind_speed = abs(gauss(0,20))
    solar_irradiance = abs(gauss(0,100))
    timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S");

    print ("SENT: sensor_id = %s; wind_speed = %f; solar_irradiance = %f; timestamp = %s" % (sensor_id, wind_speed, solar_irradiance, timestamp))

    #open database connection
    db = pymysql.connect("localhost", "root", "", "sensor_database")

    #prepare a cursor object using cursor() method
    cursor = db.cursor()

    #prepare SQL query to INSERT a record into the database.
    sql = "INSERT INTO environment_reading(sensor_id, wind_speed, solar_irradiance, timestamp) values('%s','%f','%f','%s')" % (sensor_id, wind_speed, solar_irradiance, timestamp)

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

schedule.every(0.0833).minutes.do(sendData)
while 1:
    schedule.run_pending()
    time.sleep(1)
