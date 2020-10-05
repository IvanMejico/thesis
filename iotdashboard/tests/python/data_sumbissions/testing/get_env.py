#!/usr/bin/env python3

import requests as req

payload = {'node_id': 'ESN001'}
resp = req.request(method='GET', url="http://localhost/iotdashboard/requests/EnvironmentFeed.php", params=payload)
print(resp.text)