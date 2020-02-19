import pymysql

# Open  database connection
db = pymysql.connect("localhost", "pi", "root", "sensor_database")

# prepare  a cursor object using cursor() method
cursor1 = db.cursor()
cursor2 = db.cursor()


# Prepare SQL query to DELETE required records
sql1 = "DELETE FROM environment_reading"
sql2 = "DELETE FROM energy_reading"

try:
    # Execute the SQL command
    cursor1.execute(sql1)
    cursor2.execute(sql2)

    # Commit changes in the database
    db.commit()
except pymysql.Error:
    # Rollback in case there is any error
    db.rollback()

# disconnect from server
db.close()
