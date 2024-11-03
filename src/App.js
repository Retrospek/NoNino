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
    </div>
  );
}

export default App;
