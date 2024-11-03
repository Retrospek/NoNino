from flask import Flask, request
from flask_cors import CORS
import xgboost as xgb
import numpy as np
import joblib
from tensorflow import keras
import json

app = Flask(__name__)
CORS(app)  # Enable CORS

# Load XGBoost models
model_files = [
    "models/xgboost_model_0.json",
    "models/xgboost_model_1.json",
    "models/xgboost_model_2.json",
    "models/xgboost_model_3.json"
]
xgboost_models = [xgb.Booster(model_file=model_file) for model_file in model_files]

# Load Keras model
try:
    keras_model = keras.models.load_model("models/my_model.h5")
    print("Keras model loaded successfully.")
except Exception as e:
    print(f"Error loading Keras model: {e}")
    keras_model = None

# Load KMeans and StandardScaler models
try:
    kmeans_model = joblib.load("models/kmeans_model.pkl")
    scaler_model = joblib.load("models/standard_scaler.joblib")
    print("KMeans and scaler models loaded successfully.")
except Exception as e:
    print(f"Error loading models: {e}")
    kmeans_model = None
    scaler_model = None

@app.route("/predict", methods=["POST"])
def predict():
    # Parse data as a numpy array from the request
    data = request.get_data()
    try:
        # Assuming the data is sent as a serialized JSON array
        features = np.array(json.loads(data))
    except Exception as e:
        return f"Error parsing data as numpy array: {e}", 400

    # Ensure required models are loaded
    if not (scaler_model and kmeans_model and keras_model):
        return "One or more required models are not loaded", 500

    try:
        # Extract and scale latitude and longitude for KMeans
        latitude_longitude = features[:, [2, 3]]  # assuming columns 2 and 3 are Latitude and Longitude
        scaled_lat_long = scaler_model.transform(latitude_longitude)

        # Predict cluster using KMeans on scaled data
        clusters = kmeans_model.predict(scaled_lat_long)
        features = np.insert(features, 4, clusters, axis=1)  # Insert cluster as the 5th column

        # Prepare data for XGBoost
        dmatrix = xgb.DMatrix(features, feature_names=[" Month", " Day", " Latitude", " Longitude", "cluster", "Season"])

        # Get predictions from each XGBoost model
        xgboost_predictions = np.array([model.predict(dmatrix) for model in xgboost_models]).T
        xgboost_average = np.mean(xgboost_predictions, axis=1)

        # Get predictions from the Keras model
        keras_predictions = keras_model.predict(features).flatten()

        # Combine predictions into a final numpy array
        combined_predictions = np.column_stack((xgboost_predictions, xgboost_average, keras_predictions))

        return combined_predictions.tobytes(), 200  # Return as raw bytes

    except Exception as e:
        return f"Error during prediction: {e}", 500

# Main entry point
if __name__ == "__main__":
    app.run(debug=True)
