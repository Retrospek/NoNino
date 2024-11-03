import React, { useState } from 'react';
import './NewPage.css';
import image from '../assets/correlationMatrix (1).png';
import image2 from '../assets/kMeansCluster.png';
import image4 from '../assets/modelLoss (1).png';
import image5 from '../assets/predictions (1).png';
import image7 from '../assets/windvector (1).png';
import image8 from '../assets/feature.png';




function NewPage() {
  const [modalImage, setModalImage] = useState(null)
  const [caption, setCaption] = useState("");
  const handleImageClick = (src, caption) => {
    setModalImage(src);
    setCaption(caption);
  };

  const closeModal = () => {
    setModalImage(null);
    setCaption("");
  };
  

  return (
    <div className="new-page">
      <div className="model-container">
        <div className="model" onClick={() => handleImageClick(image, 'Correlation between the variables. A number that is closer to one suggests a stronger correlations.')}>
          <img src={image} alt="Model 1" />
          <p>Correlation Matrix</p>
        </div>
        <div className="model" onClick={() => handleImageClick(image2, 'A clustering of scale geospatial coordinates.')}>
          <img src={image2} alt="Model 2" />
          <p>Longitude vs Latitute Clustering</p>
        </div>
        <div className="model" onClick={() => handleImageClick(image4, 'The loss throughout model training.')}>
          <img src={image4} alt="Model 3" />
          <p>Model Loss</p>
        </div>
        <div className="model" onClick={() => handleImageClick(image5, 'Model predictions vs. Ground Truth.')}>
          <img src={image5} alt="Model Prediction vs. Ground Truth." />
          <p>Model Prediction vs. Ground Truth</p>
        </div>
        <div className="model" onClick={() => handleImageClick(image7, 'Wind Vectors given specific geospatial coordinates.')}>
          <img src={image7} alt="Model 5" />
          <p>Wind Vector Field</p>
        </div>
        <div className="model" onClick={() => handleImageClick(image8, 'How relatively infleuntial a feauture to the prediction.')}>
          <img src={image8} alt="Model 6" />
          <p>Feature Importance</p>
        </div>
      </div>
      {modalImage && (
        <div className="modal" onClick={closeModal}>
          <span className="close">&times;</span>
          <img className="modal-content" src={modalImage} alt="Enlarged Model" />
          <div className="caption">{caption} </div>
        </div>
      )}
    </div>
  );
}

export default NewPage;
