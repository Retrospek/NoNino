import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import NewPage from './components/NewPage';
import Product from './components/Product'; // Import the new page component
import Main from './components/Main';
import './App.css';
import './index.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={
          <div className="app">
            <div className="section-1">
              <Main />
            </div>
            <div className="section-2">
              <p>Random information about El Niño</p>
              <div className="button">
                <Link to="/new-page">
                  <button type="button">PROCESS</button>
                </Link>
              </div>
              <div className="button">
                <Link to="/product">
                  <button type="button">RUN PREDICTIONS</button>
                </Link>
              </div>
            </div>
          </div>
        } />
        <Route path="/new-page" element={<NewPage />} />
        <Route path="/product" element={<Product />} /> 
      </Routes>
    </Router>
  );
}

export default App;