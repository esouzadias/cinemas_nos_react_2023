import React from 'react'
import './Banner2Div.scss'

function Banner2Div({ title, paragraph, image }) {
  return (
    <div id='banner-2divs-main'>
      <div id='banner-2divs-info'>
        <h2>{title}</h2>
        <p>{paragraph}</p>
      </div>
      <div id='banner-2divs-image'>
        <img src={image} />
      </div>
    </div>
  )
}

export default Banner2Div