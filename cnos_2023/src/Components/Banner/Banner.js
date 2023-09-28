import React from 'react'
import './Banner.scss'

function Banner({backgroundImage, secondBackgroundImage, title, paragraph, buttonText}) {
  return (
    <div id='banner' style={{background: `url(${backgroundImage})`, backgroundSize: "140%", backgroundRepeat: "no-repeat", backgroundPosition: "right"}}>
      <div id='banner-content'>
        <h2>{title}</h2>
        <p>{paragraph}</p>
        {buttonText && (<button>{buttonText}</button>)}
      </div>
    </div>
  )
}

export default Banner