import requests
import json

headers = {'Content-Type': 'application/json'}

with open('Users.json', 'r', encoding='utf-8') as f:
    users = json.load(f)

url = 'http://localhost:3000/auth/register'

for user in users:
    try:
        response = requests.post(url, json=user, headers=headers)
        print(response)
    except:
        print("Error")