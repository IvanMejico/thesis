Example commands:

=CREATE/INSERT=

python3 app.py -o insert -n psn011 -s 2020-07-26 -e 2020-07-29 -i 3600
python3 app.py -o insert -n psn001 -s last -d 2
python3 app.py -o insert -n psn001 -s last -e 2030-01-15 -i 2592000
python3 app.py -o insert -n psn001 -s last -d 2 -i 3600
python3 app.py -o insert -n psn001 -s 2020-07-11 -e first -i 3600 => NOT YET WORKING

=READ=
python3 app.py -o getrows -n esn001 -s first -e last
python3 app.py -o getrows -n psn001 -s first -d 15
python3 app.py -o getrows -n esn001 -s 2020-01-01 -e 2020-04-16

=DELETE=
python3 app.py -o delete -n esn001 -s first -e last
