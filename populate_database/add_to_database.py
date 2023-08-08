import requests
import json
import os
import sys

headers = {'Content-Type': 'application/json'}

# open Roles.json
with open('Roles.json', 'r', encoding='utf-8') as f:
    roles = json.load(f)

# send a POST request to add the roles to the database
url = 'http://localhost:3000/roles/many'
response = requests.post(url, json=roles, headers=headers)
print(response)

# open Category.json
with open('Category.json', 'r', encoding='utf-8') as f:
    categories = json.load(f)

# send a POST request to add the categories to the database
url = 'http://localhost:3000/categories/many'
response = requests.post(url, json=categories, headers=headers)
print(response)


# open Subcategory.json
with open('Subcategory.json', 'r', encoding='utf-8') as f:
    subcategories = json.load(f)
# send a POST request to add the subcategories to the database
url = 'http://localhost:3000/subcategories/many'
response = requests.post(url, json=subcategories, headers=headers)
print(response)

# open Product.json
with open('Products.json', 'r', encoding='utf-8') as f:
    products = json.load(f)
# send a POST request to add the products to the database
url = 'http://localhost:3000/products/many'
response = requests.post(url, json=products, headers=headers)
print(response)

# open Supermarkets.json
with open('Supermarkets.json', 'r', encoding='utf-8') as f:
    supermarkets = json.load(f)
# send a POST request to add the supermarkets to the database
url = 'http://localhost:3000/supermarkets/geojson'
response = requests.post(url, json=supermarkets, headers=headers)
print(response)

# open Users.json
with open('Users.json', 'r', encoding='utf-8') as f:
    users = json.load(f)
# send a POST request to add the users to the database
url = 'http://localhost:3000/auth/register'
for user in users:
    response = requests.post(url, json=user, headers=headers)
print(response)