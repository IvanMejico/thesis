#!/usr/bin/env python3

######################################################################################################################
# CLI PARAMS
# operation
#   insert { requires: nodeid, start, end, interval }  => insert one or more rows 
#   delete { requires: nodeid, start, end]}            => delete one or more rows
#   flush                                              => deletes everything and resets autoincrement
#
# insert start[first, <datestring>]  insert end[last, <datestring>]
# delete start[first, <datestring>]  delete end[last, <datestring>]
######################################################################################################################

from datetime import datetime
from RandomDataSubmitter import ReadingsTable
import sys, getopt

def main(argv):
    HOST = "localhost"
    USERNAME = "root"
    PASSWORD = ""
    DATABASE = "sensor_database"

    helpText = 'app.py -o [database operation] -n [node id] -s [starting date] -e [ending date] -i [interval in seconds] -t [delay in seconds]'
    operation = "insert"
    node = None
    start = None
    end = None
    scope = []
    offset = 0
    interval = 60 

    try:
        opts, args = getopt.getopt(argv,"ho:n:s:e:d:i:t:",["operation=","node=","start=","end=","offset=","interval=","delay="])
    except getopt.GetoptError:
        print(helpText)
        sys.exit(2)
    for opt, arg in opts:
        if opt == '-h':
            print(helpText)
            sys.exit()
        elif opt in ("-o", "--operation"):
            operation = arg
        elif opt in ("-n", "--node"):
            node = arg
        elif opt in ("-s", "--start"):
            scope.append(("start", arg))
        elif opt in ("-e", "--end"):
            scope.append(("end", arg))
        elif opt in ("-d", "--offset"):
            scope.append(("offset", int(arg)))
        elif opt in ("-i", "--interval"):
            interval = int(arg)
        elif opt in ("-t", "--delay"):
            delay = int(arg)

    if len(scope) == 2:
        scope = dict(scope)
    else:
        print(helpText)
        sys.exit(2)

    # print("=================================================================")
    # print("Operation: ", operation)
    # print("Node: ", node)
    # print("Start: ", start)
    # print("End: ", end)
    # print("Interval: ", interval)
    # print("=================================================================")

    if node[:3] == "psn":
        table = "energy_reading"
        columns = ["node_id", "voltage", "current", "timestamp"]
    elif node[:3] == "esn":
        table = "environment_reading"
        columns = ["node_id", "wind_speed", "solar_insolation", "timestamp"]
    else:
        raise Exception("Invalid node value.")

    readings = ReadingsTable(table, columns)
    readings.DBConnect(HOST, USERNAME, PASSWORD, DATABASE)

    if operation == "insert":
        readings.bulkInsert(node, scope, interval)
    elif operation == "delete":
        readings.bulkDelete(node, scope)
    elif operation == "getrows":
        rows = readings.getRows(node, scope)
        for row in rows:
            print(row)
        print("+++++++++++++++++++++++++++")
        print("%s rows retrieved" % len(rows))
    elif operation == "getcount":
        count = readings.getRowCount(node, scope)
        print("%s rows retrieved" % count)
    elif operation == "post":
        readings.doJob(node, scope, interval, delay)
    else:
        print("Invalid operaton.")

if __name__ == "__main__":
    args = sys.argv[1:]
    if len(args) > 0:
        try:
            main(args)
        except KeyboardInterrupt:
            print("Keyboard interrupt.")
