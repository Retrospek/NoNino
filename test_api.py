import requests

url = "http://127.0.0.1:5000/predict"
data = {
    "Month": 5,
    "Day": 15,
    "Latitude": 34.05,
    "Longitude": -118.25,
    "cluster": 1,
    "Season": 2
}

try:
    response = requests.post(url, json=data)
    print("Response from API:", response.json())
except requests.exceptions.RequestException as e:
    print("Error:", e)
