from flask import Flask, jsonify, request
from flask_restful import Api, Resource
import json
import xgboost as xgb
import numpy as np

app = Flask(__name__)
api = Api(app)
    
model_files = ["models/xgboost_model_0.json", "models/xgboost_model_1.json", "models/xgboost_model_2.json"]
models = [xgb.Booster(model_file=model_file) for model_file in model_files]

@app.route("/predict", methods = ["POST"])
def predict():
    data = request.get_json()
    if not data:
        return jsonify({"error": "No input data provided"}), 400

    try:
        
        features = np.array([
            data.get(" Month"),   
            data.get(" Day"),      
            data.get(" Latitude"), 
            data.get(" Longitude"),
            data.get("cluster"),   
            data.get("Season")     
        ]).reshape(1, -1)

        print(features)
        
        dmatrix = xgb.DMatrix(features, feature_names=[" Month", " Day", " Latitude", " Longitude", "cluster", "Season"])

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
