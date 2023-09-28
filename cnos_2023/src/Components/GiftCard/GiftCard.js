import React from 'react';
import './GiftCard.scss';

function GiftCard({giftImg, title, paragraph}) {
  return (
    <div id='gift-card' style={{background: `url(${giftImg})`, backgroundSize: "100%", backgroundRepeat: "no-repeat"}}>
      <div id='gift-bg'>
        <h3>{title}</h3>
        <p>{paragraph}</p>
      </div>
    </div>
  )
}

export default GiftCard