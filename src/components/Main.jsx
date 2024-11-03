
import React from 'react'
import video from '../assets/landscape.mp4'

const Main = () => {
  return (
    <div className = 'main'>
        <video src = {video} autoPlay loop muted/>
        <div className = "content">
          <h1> No Niño </h1>
          <p> Farming Reimagined </p>
        </div>
    </div>
  )
}

export default Main
