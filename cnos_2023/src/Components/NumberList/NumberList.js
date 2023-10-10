import React from 'react'
import './NumberList.scss'

function NumberList({numberListInfo}) {
  return (
    <div id='number-list-main'>
      <ul>
        {numberListInfo.map((item, index) => (
          <li key={index}>
            <h2>{index + 1}</h2>
            <h3>{item.title}</h3>
            <span>{item.paragraph}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default NumberList