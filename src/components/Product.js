import React, { useState } from 'react';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import './Product.css';

export default function Product() {
  const [selectedDate, setDate] = useState(new Date());
  const [lat, setLat] = useState('');
  const [long, setLong] = useState('');
  const [prediction, setPrediction] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError(null);
    setLoading(true);

    const date = new Date(selectedDate);
    const month = date.getMonth() + 1;
    const day = date.getDate();

    // Validate inputs
    if (!lat || !long) {
      setError('Please enter both latitude and longitude');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch('http://127.0.0.1:5123/predict', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          Month: month,
          Day: day,
          Latitude: parseFloat(lat),
          Longitude: parseFloat(long),
          Season: 1
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setPrediction(data.prediction);
      setError(null);
    } catch (error) {
      console.error('Error making prediction request:', error);
      setError(error.message || 'Failed to get prediction. Please try again.');
      setPrediction(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="Product">
      <h1>Prediction Results</h1>
      <h3>How will El Niño affect you?</h3>

      <form onSubmit={handleSubmit}>
        <div className="input-group">
          <label className="input-label">
            <strong>Select the date of prediction: </strong>
          </label>
          <DatePicker
            selected={selectedDate}
            onChange={date => setDate(date)}
            dateFormat="MM/dd/yyyy"
          />
        </div>

        <div className="input-group">
          <label className="input-label">
            <strong>Enter the buoy's location latitude: </strong>
          </label>
          <input
            type="number"
            step="any"
            id="latitude"
            value={lat}
            onChange={(e) => setLat(e.target.value)}
            placeholder="Enter latitude"
          />
        </div>

        <div className="input-group">
          <label className="input-label">
            <strong>Enter the buoy's location longitude: </strong>
          </label>
          <input
            type="number"
            step="any"
            id="longitude"
            value={long}
            onChange={(e) => setLong(e.target.value)}
            placeholder="Enter longitude"
          />
        </div>

        <button 
          type="submit" 
          className="submit-btn" 
          disabled={loading}
        >
          {loading ? 'Processing...' : 'Submit'}
        </button>
      </form>

      {error && (
        <div className="error-message">
          {error}
        </div>
      )}

      {prediction !== null && (
        <div className="prediction-result">
          <h4>Prediction Result:</h4>
          <p>{prediction.toFixed(2)}</p>
        </div>
      )}
    </div>
  );
}
