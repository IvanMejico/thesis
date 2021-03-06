#!/usr/bin/env python3

from RandomDataSubmitter import ReadingsTable
from datetime import datetime

start = datetime(2020, 1, 1)
end = datetime(2020, 1, 2)
scope = (start, end)
r = ReadingsTable("energy_reading", ["node_id", "voltage", "current", "timestamp"])
r.DBConnect("localhost", "root", "", "sensor_database")
r.getRows("psn006", scope)
n = r.getRowCount("psn006", scope)
print("Number of rows: %s" % n)
