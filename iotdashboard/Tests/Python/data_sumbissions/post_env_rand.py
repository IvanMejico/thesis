#!/usr/bin/env python3

from random import gauss
import time
from datetime import datetime, timedelta
import requests as req
import schedule
# imported packages is used to speedup timestamp values

# 1 min interval from 2020-01-01 13:05:00 to 2020-01-01 13:05:00
# 15 mins inteval from 2020-01-01 13:06:00 to 2020-01-03 12:51:00  

# TS = datetime.now()
# TS = TS.replace(minute=0, hour=0, second=0)

TS = datetime(2020,7,1,11,0)

def job():
    global TS
    node_id = 'esn005'
    wind_speed = round(abs(gauss(0, 20)), 2)
    solar_insolation = round(abs(gauss(0, 100)), 2)
    timestamp = TS.strftime("%Y-%m-%d %H:%M:%S")

    # Under normal circumstances timestamp will not be passed as an http parameter
    # php will generate the actual timestamp whenever a post request is made.
    # Passing timestamp as parameter is only used to speed up the timestamp generation
    # for every dataset.
    print(timestamp)

    payload = {
        'node_id': node_id,
        'wind_speed': wind_speed,
        'solar_insolation': solar_insolation,
        'timestamp': timestamp,
        'access_token': '5zdZNDGxtkbn5eS' 
    }
    if req.request(method='post',
                   url="http://localhost/iotdashboard/requests/EnvironmentFeed.php",
                   params=payload):
        print("sent: node_id = %s; wind_speed = %f; solar_insolation = %f"
              % (node_id, wind_speed, solar_insolation))
    TS += timedelta(minutes=1)


schedule.every(1).seconds.do(job)
while 1:
    schedule.run_pending()
    time.sleep(1)
