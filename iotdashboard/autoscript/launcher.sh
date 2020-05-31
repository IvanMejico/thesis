#!/bin/bash

python3 ./database_reset/flush.py &
python3 ./database_reset/reset_id.py &
python3 ./simulated_sensor_submissions/esn001.py &
python3 ./simulated_sensor_submissions/psn001.py &
python3 ./simulated_sensor_submissions/psn002.py &
python3 ./simulated_sensor_submissions/psn003.py &
python3 ./check_battery.py &
python3 ./data_summarization.py &
python3 ./simulate_charge_discharge.py & 
