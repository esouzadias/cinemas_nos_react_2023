import React from 'react'
import "./searchMenu.scss"

function SearchMenu(setLinkValue) {
  const handleSetLink = (e) => {
    e.preventDefault();
    setLinkValue.setLinkValue(e.currentTarget.textContent);
  }

  return (
    <div className="menu-bar">
      <ul>
        <li onClick={handleSetLink}> Filmes </li>
        <li onClick={handleSetLink}> Cinemas </li>
        <li onClick={handleSetLink}> Bar </li>
        <li onClick={handleSetLink}> Outros Produtos </li>
      </ul>
    </div>
  )
}

export default SearchMenu