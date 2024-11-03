from flask import Flask, jsonify, request
from flask_cors import CORS, cross_origin
import numpy as np
import joblib
import tensorflow as tf

app = Flask(__name__)
# CORS(app, resources={r"/*": {"origins": "http://127.0.0.1:*"}})
CORS(app, support_credentials=True)

# Load models
try:
    mlp_model = tf.keras.models.load_model("models/my_model.h5")
    kmeans_model = joblib.load("models/kmeans_model.pkl")
    scaler = joblib.load("models/standard_scaler.joblib")
except Exception as e:
    print(f"✗ Error loading models: {e}")

@app.route("/test", methods=["GET"])
@cross_origin(supports_credentials=True)
def test():
    return jsonify({"status": "API is working!"})

@app.route("/predict", methods=["POST", "OPTIONS"])
def predict():
    if request.method == "OPTIONS":
        return jsonify({"status": "OK"}), 200

    try:

        print("Received prediction request")
        data = request.get_json()
        print(f"Request data: {data}")

        if not data:
            return jsonify({"error": "No input data provided"}), 400

        # Process latitude and longitude
        latitude_longitude = np.array([
            float(data["Latitude"]),
            float(data["Longitude"])
        ]).reshape(1, -1)

        # Scale latitude and longitude
        scaled_latitude_longitude = scaler.transform(latitude_longitude)

        # Predict cluster
        cluster = int(kmeans_model.predict(scaled_latitude_longitude)[0])

        # Prepare features for the MLP model
        features = np.array([
            int(data["Month"]),
            int(data["Day"]),
            float(data["Latitude"]),
            float(data["Longitude"]),
            cluster,
            int(data["Season"])
        ]).reshape(1, -1)

        prediction = float(mlp_model.predict(features)[0][0])
        print(f"Prediction result: {prediction}")

        return jsonify({
            "status": "success",
            "prediction": prediction,
            "cluster": int(cluster)
        })

    except Exception as e:
        print(f"Error in prediction: {str(e)}")
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    print("Starting Flask server...")
    app.run(port=5123)
