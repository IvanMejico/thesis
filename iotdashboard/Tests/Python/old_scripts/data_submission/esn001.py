import pymysql
from random import seed
from random import gauss
import schedule
import time
from datetime import datetime

def sendData():
    sensor_id = 'ESN001'
    wind_speed = abs(gauss(0,20))
    solar_irradiance = abs(gauss(0,100))
    timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    print ("SENT: sensor_id = %s; wind_speed = %f; solar_irradiance = %f; timestamp = %s" % (sensor_id, wind_speed, solar_irradiance, timestamp))
    db = pymysql.connect("localhost", "root", "", "sensor_database")
    cursor = db.cursor()
    sql = "INSERT INTO environment_reading(sensor_id, wind_speed, solar_irradiance, timestamp) values('%s','%f','%f','%s')" % (sensor_id, wind_speed, solar_irradiance, timestamp)
    try:
        cursor.execute(sql)
        db.commit()
    except pymysql.Error:
        db.rollback()
    db.close()

schedule.every(0.0833).minutes.do(sendData)
while 1:
    schedule.run_pending()
    time.sleep(1)
