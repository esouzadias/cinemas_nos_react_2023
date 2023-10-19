import React, { useState } from 'react';
import './Beneficio.scss';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';

function Beneficio({ beneficio, total, setTotal, selectedNumeroPessoas }) {
  const [clickedBeneficio, setClickedBeneficio] = useState(false);

  const handleClickBeneficio = () => {
    setClickedBeneficio((prevClicked) => !prevClicked);

    if (beneficio.id === "bfam") {
      if (selectedNumeroPessoas >= 2) {
        const pricePerPerson = 6.25;
        setTotal((prevTotal) => (clickedBeneficio ? prevTotal + pricePerPerson : prevTotal - pricePerPerson));
      }
      setClickedBeneficio(false);
      return;
    }

    const price = Number(beneficio.price.split("€ ").pop());
    setTotal((prevTotal) => (clickedBeneficio ? prevTotal + price : prevTotal - price));
  };

  return (
    <div
      id='beneficio'
      className={`${clickedBeneficio ? 'beneficio-active' : ''} ${beneficio.id === "bfam" || beneficio.id === "cNOS" && selectedNumeroPessoas === 1 ? 'beneficio-disabled' : ''}`}
      onClick={handleClickBeneficio}
    >
      <div>
        <h3>{beneficio.title}</h3>
        <p>{beneficio.paragraph}</p>
        <span>{beneficio.price}</span>
      </div>
      <FontAwesomeIcon className='icon' icon={faPlus} />
    </div>
  );
}

export default Beneficio;
