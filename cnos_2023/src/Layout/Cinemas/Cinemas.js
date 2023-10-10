import React, { useState } from "react";
import './Cinemas.scss'
import CinemasList from './CinemasList.js'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChevronDown } from '@fortawesome/free-solid-svg-icons'

function Cinemas({cinemasList}) {
  const [selectedOption, setSelectedOption] = useState('');

  const handleListClick = (option) => {
    setSelectedOption((prevOption) => (prevOption === option ? null : option));
  };



  return (
    <div id='cinemas-main'>
      <div id='cinemas-banner-content'>
        <div id='cinemas-banner'>
          <h2 className='title-big'>Cinemas NOS</h2>
          <p>Os Cinemas NOS são a maior rede de cinemas nacional com 30 complexos e mais de 200 salas espalhadas por todo o país.</p>
          <p>Vem viver a melhor experiência de cinema connosco e fica a conhecer também os nossos formatos especiais (IMAX, 4DX, ScreenX, XVision).</p>
        </div>
      </div>

      <div id='cinemas-list-main'>
        <h2 className='title-medium'>
          Todas as salas
        </h2>

        <h3 className="cinemas-list-selection" onClick={() => handleListClick('Grande Lisboa')}>
          <span>Grande Lisboa</span>
          <FontAwesomeIcon className='icon' icon={faChevronDown}/>
        </h3>
        {selectedOption === "Grande Lisboa" && (<CinemasList cinemasList={cinemasList} selectedOption={selectedOption}/>)}
        
        <h3 className="cinemas-list-selection" onClick={() => handleListClick('Grande Porto')}>
          <span>Grande Porto</span>
          <FontAwesomeIcon className='icon' icon={faChevronDown}/>
        </h3>
        {selectedOption === "Grande Porto" && (<CinemasList cinemasList={cinemasList} selectedOption={selectedOption}/>)}
        
        <h3 className="cinemas-list-selection" onClick={() => handleListClick('Norte')}>
          <span>Norte</span>
          <FontAwesomeIcon className='icon' icon={faChevronDown}/>
        </h3>
        {selectedOption === "Norte" && (<CinemasList cinemasList={cinemasList} selectedOption={selectedOption}/>)}
        
        <h3 className="cinemas-list-selection" onClick={() => handleListClick('Centro')}>
          <span>Centro</span>
          <FontAwesomeIcon className='icon' icon={faChevronDown}/>
        </h3>
        {selectedOption === "Centro" && (<CinemasList cinemasList={cinemasList} selectedOption={selectedOption}/>)}
        
        <h3 className="cinemas-list-selection" onClick={() => handleListClick('Sul')}>
          <span>Sul</span>
          <FontAwesomeIcon className='icon' icon={faChevronDown}/>
        </h3>
        {selectedOption === "Sul" && (<CinemasList cinemasList={cinemasList} selectedOption={selectedOption}/>)}

        <h3 className="cinemas-list-selection" onClick={() => handleListClick('Madeira')}>
          <span>Madeira</span>
          <FontAwesomeIcon className='icon' icon={faChevronDown}/>
        </h3>
        {selectedOption === "Madeira" && (<CinemasList cinemasList={cinemasList} selectedOption={selectedOption}/>)}
      </div>
    </div>
  )
}

export default Cinemas