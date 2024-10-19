

import openpyxl
import requests

# TLDR; read medical CMS patient data, call openweather api and google maps api, use patient CMS data to set the "location", use google maps api to find highest "prominence" locations nearby, and then attach openweather pollution data to dynamically / procedurally generate player worlds"

# the original script we used was seperated into several modules and ran indiviually, we just threw each of scripts into a single file for ease of viewabliltiy

# Load the workbook and the active sheet
file_path = 'your_excel_file.xlsx'
wb = openpyxl.load_workbook(file_path)
sheet = wb.active

# Extract data from column 7 in Excel
column_data = []
for row in sheet.iter_rows(min_col=7, max_col=7, values_only=True):
    if row[0] is not None:  # Optionally, skip empty cells
        column_data.append(row[0])

# Print or use the extracted data
print(column_data)

######

# OpenWeatherMap API key
API_KEY = 'redacted so you guys don't hack me, thx'

# Define the coordinates for the location (latitude and longitude)
lat = 32.715736  # Latitude for San Diego (hardcoded)
lon = -117.161087  # Longitude for San Diego (hardcoded)

# OpenWeatherMap Air Pollution API url
url = f'http://api.openweathermap.org/data/2.5/air_pollution?lat={lat}&lon={lon}&appid={API_KEY}'

# Make a GET request to the API
response = requests.get(url)

# Check if the request was successful
if response.status_code == 200:
    data = response.json()

    # Extract relevant pollution data
    air_quality = data['list'][0]['main']['aqi']  # Air Quality Index (AQI) # used for determining pollution in an area
    components = data['list'][0]['components']  # Pollutant components (e.g., CO, NO, O3, etc. They have alot of data points)

    print(f"Air Quality Index (AQI): {air_quality}")
    print("Pollutants:")
    for pollutant, value in components.items():
        print(f"{pollutant}: {value} µg/m3")

else:
    print(f"Failed to retrieve data: {response.status_code}") #always error check your code for good luck

#####

import requests

# Google Maps API Key
API_KEY = 'nice try guys, you thought you had me again...'

# Define the location and search parameters
location = '32.7157,-117.1611'  # Latitude and longitude for San Diego
radius = 5000  # Search radius in meters
search_type = 'restaurant'  # Search type (can be hotel, cafe, etc.), restaurants are the most frequent
rankby = 'prominence'  # Rank by prominence for top-reviewed places

# Places API endpoint
url = f'https://maps.googleapis.com/maps/api/place/nearbysearch/json?location={location}&radius={radius}&type={search_type}&rankby={rankby}&key={API_KEY}'

# Send request to the Google Places API
response = requests.get(url)

# Check if the request was successful
if response.status_code == 200:
    data = response.json()

    # Extract and print the top reviewed locations
    if 'results' in data:
        print("Top Reviewed Locations in San Diego:")
        for place in data['results']:
            name = place.get('name')
            rating = place.get('rating')
            user_ratings_total = place.get('user_ratings_total')
            address = place.get('vicinity')
            print(f"Name: {name}\nRating: {rating}\nTotal Reviews: {user_ratings_total}\nAddress: {address}\n")
    else:
        print("No places found.")
else:
    print(f"Error occurred: {response.status_code}")

