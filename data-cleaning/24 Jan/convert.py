# todo replace any instances of 's or s' in the csv file with ending quote

import csv
import json
from opencage.geocoder import OpenCageGeocode

# --------------------------------------
# 1) Set up your OpenCage API key
# --------------------------------------
# Replace 'YOUR_API_KEY' with your actual OpenCage API key
api_key = 'e5e2533f0b12487d89835752be344f63'
geocoder = OpenCageGeocode(api_key)

def get_coordinates(city_name):
    """
    Geocode a city name using OpenCage. Returns [longitude, latitude]
    or [None, None] if not found.
    """
    if not city_name:
        return [None, None]
    
    result = geocoder.geocode(city_name, no_annotations='1')
    if result and len(result) > 0:
        return [
            result[0]['geometry']['lng'],
            result[0]['geometry']['lat']
        ]
    return [None, None]

def parse_int(value):
    """
    Safely parse an integer from a string. Return None on failure.
    """
    if not value:
        return None
    try:
        return int(value.strip())
    except ValueError:
        return None

def remove_surrounding_quotes(text):
    """
    Trim whitespace and remove leading/trailing quotes, if present.
    E.g. '"Peshawar, Pakistan"' → 'Peshawar, Pakistan'.
    """
    if not text:
        return text
    return text.strip().strip('"').strip("'")

# ---------------------------------------------------
# 2) Main CSV-to-GeoJSON conversion with data cleaning
# ---------------------------------------------------
features = []
row_count = 0
success_count = 0

with open('authors.csv', mode='r', encoding='utf-8') as csvfile:
    fieldnames = [
        'author_name', 'gender', 'country', 'continent', 
        'city_birth', 'city_residence', 'language',
        'year_birth', 'year_death', 'work1', 'work2', 
        'awards', 'time period', 'bio',
        'list_url', 'list_title', 'list_bookname', 'list_copy'
    ]
    
    reader = csv.DictReader(csvfile, fieldnames=fieldnames)
    
    # First count total rows
    total_rows = sum(1 for row in csvfile)
    csvfile.seek(0)  # Reset file pointer to start
    next(reader)  # Skip the header row
    
    print(f"Starting to process {total_rows} rows...")
    
    for row in reader:
        row_count += 1
        try:
            # -------------------------
            # a) Basic Data Sanitization
            # -------------------------
            for field in row:
                if row[field] is not None:
                    row[field] = row[field].strip()

            author_name = row.get('author_name', '')
            if not author_name:
                # Skip rows without an author name
                continue

            # Clean up city names
            city_birth = remove_surrounding_quotes(row.get('city_birth', ''))
            city_residence = remove_surrounding_quotes(row.get('city_residence', ''))

            # Convert year fields to integer
            year_birth = parse_int(row.get('year_birth'))
            year_death = parse_int(row.get('year_death'))

            # -----------------------------------------------
            # b) Get Coordinates (Only using city_birth here)
            #    If you'd prefer city_residence, adjust below.
            # -----------------------------------------------
            birth_coordinates = get_coordinates(city_birth)

            # ----------------------------
            # c) Construct the GeoJSON row
            # ----------------------------
            feature = {
                "type": "Feature",
                "properties": {
                    "author_name": author_name,
                    "gender": row.get('gender'),
                    "country": row.get('country'),
                    "continent": row.get('continent'),
                    "city_birth": city_birth,
                    "city_residence": city_residence,
                    "language": row.get('language'),     # Optional: parse/split if needed
                    "year_birth": year_birth,
                    "year_death": year_death,
                    "work_1": row.get('work1'),
                    "work_2": row.get('work2'),
                    "awards": row.get('awards'),
                    "time_period": row.get('time period'),
                    "bio": row.get('bio'),
                    "list_url": row.get('list_url'),
                    "list_title": row.get('list_title'),
                    "list_bookname": row.get('list_bookname'),
                    "list_copy": row.get('list_copy')
                },
                "geometry": {
                    "type": "Point",
                    "coordinates": birth_coordinates
                }
            }

            features.append(feature)
            success_count += 1
            
            # Show progress every 10 rows
            if row_count % 10 == 0:
                percentage = (row_count / total_rows) * 100
                print(f"Progress: {row_count}/{total_rows} rows ({percentage:.1f}%) - Last processed: {author_name}")
            
        except Exception as e:
            print(f"Error processing row {row_count}: {str(e)}")
            print(f"Row data: {row}")

print(f"\nProcessing complete:")
print(f"Total rows: {row_count}")
print(f"Successfully converted: {success_count}")

# -------------------
# 3) Build GeoJSON
# -------------------
geojson = {
    "type": "FeatureCollection",
    "features": features
}

# -------------------
# 4) Write Output File
# -------------------
with open('data.json', 'w', encoding='utf-8') as jsonfile:
    json.dump(geojson, jsonfile, ensure_ascii=False, indent=2)
