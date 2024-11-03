import React from 'react'
import video from '../assets/video.mp4'

const Main = () => {
  return (
    <div className = 'main'>
        <video src = {video} autoPlay loop muted/>
        <div className = "content">
          <h1> Farming Reimagined </h1>
          <p> El Ñino Environmental Effects </p>
        </div>
    </div>
  )
}

export default Main