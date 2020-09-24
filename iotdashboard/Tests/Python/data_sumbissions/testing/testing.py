#!/usr/bin/env python3

from RandomDataSubmitter import ReadingsTable
from datetime import datetime

start = datetime(2020, 1, 1)
end = datetime(2020, 1, 2)
scope = (start, end)
r = ReadingsTable("energy_reading", ["node_id", "voltage", "current", "timestamp"])
r.DBConnect("localhost", "root", "", "sensor_database")

# print(r._getEarliestTimestamp())
# print(type(r._getEarliestTimestamp()))
# print(r._getLatestTimestamp())
# print(type(r._getLatestTimestamp()))

# print(r._buildSQL('insert'))
# print(r._buildSQL('delete'))

# r.bulkInsert("psn001", (datetime(2020,1,1), datetime(2020,1,2)), 60*30)
# r.bulkInsert("psn001", ('first', 'last'), 60*30)

# r.bulkInsertFromLatest("psn001", 3, 60*30)

# r.bulkDelete("psn001", scope)
r.bulkDelete("psn001", ('first', 'last'))

# print(r.getRows('psn001', (datetime(2020,1,1),datetime(2020,1,1)))
