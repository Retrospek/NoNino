import React, { useEffect, useRef } from 'react';
import { Route, Routes, Link, useLocation } from 'react-router-dom';
import NewPage from './components/NewPage';
import Product from './components/Product';
import Main from './components/Main';
import './App.css';

function App() {
  const sectionRef = useRef(null);
  const location = useLocation();

  useEffect(() => {
    if (location.pathname !== '/') return; // Only activate observer on the main page

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (sectionRef.current) {
          if (entry.isIntersecting) {
            sectionRef.current.classList.add('fade-in');
          } else {
            sectionRef.current.classList.remove('fade-in');
          }
        }
      },
      { threshold: 0.1 } // Trigger when 10% of the section is visible
    );

    // Observe the section if available
    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    // Clean up the observer on component unmount or path change
    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, [location.pathname]); // Re-run effect when the path changes

  return (
    <div className="app">
      <Routes>
        <Route path="/" element={
          <div>
            <div className="section-1">
              <Main />
            </div>
            <div ref={sectionRef} className="section-2">
              <p>El Niño presents significant challenges to our environment, leading to disruptions in weather patterns that can greatly affect farming practices and agricultural yields. Our advanced model analyzes buoy data collected from across the Pacific Ocean to enhance predictions of temperature variations and wind vectors. By providing valuable insights, we assist weather services in making more accurate forecasts, ultimately helping farmers optimize their yields and adapt to the unpredictable impacts of El Niño.</p>
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
    </div>
  );
}

export default App;