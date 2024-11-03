from flask import Flask, jsonify, request
from flask_cors import CORS
from flask_restful import Api, Resource
import json
import xgboost as xgb
import numpy as np
import joblib

app = Flask(__name__)
CORS(app)
api = Api(app)
    
model_files = ["models/xgboost_model_0.json", "models/xgboost_model_1.json", "models/xgboost_model_2.json", "models/xgboost_model_3.json"]
models = [xgb.Booster(model_file=model_file) for model_file in model_files]

try:
    kmeans_model = joblib.load("models/kmeans_model.pkl")
    scaler_model = joblib.load("models/standard_scaler.joblib")

except Exception as e:
    print(f"Error loading models: {e}")

@app.route("/predict", methods = ["POST"])
def predict():
    data = request.get_json()
    if not data:
        return jsonify({"error": "No input data provided"}), 400

    try:
        Lattude_longtude = np.array([
            data.get(" Latitude"),
            data.get(" Longitude")
        ]).reshape(1, -1)

        scaled_Lattude_longtude  = scaler_model.transform(Lattude_longtude )

        cluster = int(kmeans_model.predict(scaled_Lattude_longtude)[0])

        features = np.array([
            data.get(" Month"),   
            data.get(" Day"),      
            data.get(" Latitude"), 
            data.get(" Longitude"),
            cluster,   
            data.get("Season")     
        ]).reshape(1, -1)

        print(features)
        
        # Prepare data for XGBoost
        dmatrix = xgb.DMatrix(features, feature_names=[" Month", " Day", " Latitude", " Longitude", "cluster", "Season"])

        # Get predictions from each model
        predictions = [float(model.predict(dmatrix)[0]) for model in models]

        
        average_prediction = np.mean(predictions)
        response = {
            "predictions": predictions,
            "average_prediction": average_prediction
        }

        return jsonify(response)
    
    except Exception as e:
        return jsonify({"error": str(e)}), 500
        
# Main entry point
if __name__ == "__main__":
    app.run(debug=True)
