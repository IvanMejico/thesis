#// TODO:
# Check the difference of the time between records.
# if the difference is 5 minutes or less, then compare the wind speed and solar irradiance values
# to their respective brackets. The relay on the AC Load sensor node will be turned on or off
# depending on whether the wind speed or solar irradiance met their respective bracket values.
# It means that if either wind or solar energy is available, the load will be driven by the hybrid system.
# On the other hand, if both are not available, the load will be driven by the grid source.

import pymysql
import schedule
import time
from datetime import datetime

min_speed = 1
min_irradiance = 10
sensor_id = 'ESN001'


def activateRelay():
    db = pymysql.connect("localhost", "pi", "root", "sensor_database")
    cursor = db.cursor()
    sql = "UPDATE relay_control SET status = 'TR'  WHERE sensor_id = '%s'" % ('PSN001')

    try:
        cursor.execute(sql)
        db.commit()
    except pymysql.Error:
        db.rollback()

    db.close()
    print('RELAY ACTIVATED')

def deactivateRelay():
    db = pymysql.connect("localhost", "pi", "root", "sensor_database")
    cursor = db.cursor()
    sql = "UPDATE relay_control SET status = 'FL'  WHERE sensor_id = '%s'" % ('PSN001')

    try:
        cursor.execute(sql)
        db.commit()
    except pymysql.error:
        db.rollback()

    db.close()
    print('RELAY DEACTIVATED')

def checkAvailable():
    db = pymysql.connect("localhost", "pi", "root", "sensor_database")
    cursor = db.cursor()
    sql = "SELECT * FROM environment_reading ORDER BY ID DESC LIMIT 1;"

    try:
        # Execute the SQL command
        cursor.execute(sql)
        # Fetch all the rows in a list of lists.
        results = cursor.fetchall()
        for row in results:
            wind_speed = row[2]
            solar_irradiance = row[3]
            timestamp = row[4]
            # Now print fetched result
            # print(WS = %f, SI = %f T = %s" %
                # (wind_speed, solar_irradiance, timestamp))
    except pymysql.Error:
        print("Error: unable to fetch data")

    

    dt_now = datetime.now().strftime("%Y-%m-%d %H:%M:%S")   # outputs a datetime string value
    now = datetime.strptime(dt_now, '%Y-%m-%d %H:%M:%S')    # convert datetime string to datetime object

    # checking if the last record is at least 5 minutes ago
    seconds_in_day = 24 * 60 * 60
    difference = now - timestamp
    time_difference = divmod(difference.days * seconds_in_day + difference.seconds, 60)
    print(time_difference)
    time_bracket = (5, 0)   # 5minutes 0seconds

    # disconnect from server
    db.close();

    # compare the wind speed and solar irradiation from the database to their respective bracket values
    if time_difference <= time_bracket:
        if wind_speed >= min_speed or solar_irradiance >= min_irradiance:
            activateRelay()
        else:
            deactivateRelay()
    else:
        print("OUTSIDE TIME BRACKET")

def job():
    checkAvailable()

schedule.every(.05).minutes.do(job)
schedule.every().hour.do(job)
schedule.every().day.at("10:30").do(job)

while 1:
    schedule.run_pending()
    time.sleep(1)
