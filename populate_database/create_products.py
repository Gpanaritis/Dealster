import json
import random

# Define the list of supermarket names
supermarket_names = [
    "Lidl",
    "The Mart",
    "Σουπερμάρκετ Ανδρικόπουλος",
    "Σκλαβενίτης",
    "Ρουμελιώτης SUPER Market",
    "My market",
    "ΑΒ Βασιλόπουλος",
    "Markoulas",
    "Ανδρικόπουλος",
    "Kronos",
    "Ανδρικόπουλος - Supermarket",
    "3A",
    "Spar",
    "MyMarket",
    "Ena Cash And Carry",
    "ΚΡΟΝΟΣ - (Σκαγιοπουλείου)",
    "Ανδρικόπουλος Super Market",
    "3Α Αράπης",
    "Γαλαξίας",
    "Super Market Θεοδωρόπουλος",
    "Super Market ΚΡΟΝΟΣ",
    "3A ARAPIS",
    "Μασούτης",
    "ΑΒ Shop & Go"
]

# Function to generate a random combination of supermarket names
def generate_random_supermarkets():
    num_supermarkets = random.randint(1, len(supermarket_names))
    return random.sample(supermarket_names, num_supermarkets)

# Read the JSON file with products
with open('Products.json', 'r', encoding='utf-8') as file:
    products = json.load(file)

# Update the supermarket_names field
for product in products:
    x = random.randint(0, 5)
    if x == 0:
        product["supermarket_names"] = "all"
    else:
        product["supermarket_names"] = generate_random_supermarkets()

# Write the updated data back to the JSON file
with open('products_new.json', 'w', encoding='utf-8') as file:
    json.dump(products, file, ensure_ascii=False, indent=4)

print("Supermarket names updated and saved to products.json.")
