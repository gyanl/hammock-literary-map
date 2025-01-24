# todo replace any instances of 's or s' in the csv file with ending quote

import csv
import json
from opencage.geocoder import OpenCageGeocode

# Replace 'YOUR_API_KEY' with your actual OpenCage API key
api_key = '932bb47fe87a4089ba1e58902c19d794'
geocoder = OpenCageGeocode(api_key)

def get_coordinates(city_name):
    result = geocoder.geocode(city_name, no_annotations='1')
    if result and len(result) > 0:
        return [result[0]['geometry']['lng'], result[0]['geometry']['lat']]
    return [None, None]

# Convert the authors table to GeoJSON
features = []
with open('authors.csv', mode='r', encoding='utf-8') as csvfile:
    reader = csv.DictReader(csvfile)
    for row in reader:
        birth_coordinates = get_coordinates(row['city_birth'])
        feature = {
            "type": "Feature",
            "properties": {
                "author_name": row['author_name'],
                "city_birth": row['city_birth'],
                "city_residence": row['city_residence'],
                "country": row['country'],
                "year_birth": int(row['year_birth']) if row['year_birth'].isdigit() else None,
                "year_death": int(row['year_death']) if row['year_death'].isdigit() else None,
                "work_1": row['work1'],
                "work_2": row['work2']
            },
            "geometry": {
                "type": "Point",
                "coordinates": birth_coordinates
            }
        }
        features.append(feature)
        print(f"Converted: {row['author_name']}")


geojson = {
    "type": "FeatureCollection",
    "features": features
}

# Save the GeoJSON to a file
with open('data.json', 'w', encoding='utf-8') as jsonfile:
    json.dump(geojson, jsonfile, ensure_ascii=False, indent=2)
