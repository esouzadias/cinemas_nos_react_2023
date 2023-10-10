import React from 'react'
import './CinemasList.scss'

function CinemasList({ selectedOption, cinemasList }) {
  /* const cinemasList = {
    "Grande Lisboa": [
      { "cinema": "Alfragide", "salas": 8 },
      { "cinema": "Amoreiras", "salas": 12 },
      { "cinema": "Colombo", "salas": 9 },
      { "cinema": "Odivelas Parque", "salas": 6 },
      { "cinema": "Parque Nascente", "salas": 5 },
      { "cinema": "Vasco da Gama", "salas": 7 },
      { "cinema": "Alvaláxia", "salas": 6 }
    ],
    "Grande Porto": [
      { "cinema": "NorteShopping", "salas": 16 },
      { "cinema": "Mar Shopping", "salas": 7 },
      { "cinema": "Parque Maia", "salas": 5 },
      { "cinema": "Parque Vila do Conde", "salas": 9 },
      { "cinema": "Parque Nascente", "salas": 7 },
      { "cinema": "GaiaShopping", "salas": 10 }
    ],
    "Norte": [
      { "cinema": "Braga Parque", "salas": 7 },
      { "cinema": "GuimarãeShopping", "salas": 12 },
      { "cinema": "MaiaShopping", "salas": 7 },
      { "cinema": "Gaiashopping", "salas": 5 }
    ],
    "Centro": [
      { "cinema": "Fórum Coimbra", "salas": 12 },
      { "cinema": "Alma Shopping", "salas": 6 },
      { "cinema": "Palácio do Gelo", "salas": 9 },
      { "cinema": "Fórum Aveiro", "salas": 7 },
      { "cinema": "Fórum Viseu", "salas": 6 }
    ],
    "Sul": [
      { "cinema": "AlgarveShopping", "salas": 7 },
      { "cinema": "Forum Algarve", "salas": 8 },
      { "cinema": "Faro", "salas": 6 },
      { "cinema": "Guia", "salas": 5 },
      { "cinema": "Tavira", "salas": 12 }
    ],
    "Madeira": [
      { "cinema": "Madeira Shopping", "salas": 8 },
      { "cinema": "Parque Central", "salas": 7 },
      { "cinema": "La Vie", "salas": 6 },
      { "cinema": "Porto Santo", "salas": 7 }
    ]
  } */
  const selectedCinemas = cinemasList[selectedOption] || [];

  return (
    <ul id='cinemas-list'>
      {selectedCinemas.map((cinema, index) => (
        <li key={index}>
          <h3>Cinemas NOS {cinema.cinema}</h3>
          <p>{cinema.salas} Salas</p>
        </li>
      ))}
    </ul>
  )
}

export default CinemasList