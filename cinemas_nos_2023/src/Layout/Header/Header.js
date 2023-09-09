import React from 'react'
import "./Header.scss";
import logoNos from '../../Assets/Images/logo-nos.svg';
  import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
  import { faSearch } from '@fortawesome/free-solid-svg-icons'

function Header() {
  return (
    <div className="header-main">
      <span><h2>Cinemas</h2> <img src={logoNos} /> </span>
      <span id="search">
        <input className='search-input' type='text' name="fulltext" role='combobox' placeholder='Pesquise por filmes, atores, realizadores...'/>
        <FontAwesomeIcon className='icon' icon={faSearch} />
      </span>
    </div>
  )
}

export default Header