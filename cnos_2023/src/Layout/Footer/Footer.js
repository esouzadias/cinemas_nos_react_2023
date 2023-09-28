import React from 'react'
import './Footer.scss'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFacebookF } from '@fortawesome/free-brands-svg-icons'
import { faInstagram } from '@fortawesome/free-brands-svg-icons'
import { faYoutube } from '@fortawesome/free-brands-svg-icons'

import img4dx from '../../Assets/Images/4dx.png'
import screenX from '../../Assets/Images/screenx_updated.png'
import imax from '../../Assets/Images/imax.png'
import appCinemas from '../../Assets/Images/app-cinemas.png'
import appStore from '../../Assets/Images/app-store.png'
import playStore from '../../Assets/Images/google-play.png'
import livroReclamacoes from '../../Assets/Images/complaint_boo_Logo.svg'

function Footer() {
  return (
    <div id='footer-main'>
      <div id='formatos'>
        <h3>A melhor experiência de cinema nos formatos exclusivos:</h3>
        <span id='movie-format-icons'>
          <h2>NOS XVision</h2>
          <img src={img4dx} />
          <img src={screenX} />
          <img src={imax} />
        </span>
      </div>
      <div id='appInfo'>
        <div id='appInfo-icons'>
          <img src={appCinemas} />
          <p>Tem sempre os bilhetes consigo na App Cinemas NOS</p>
          <img src={appStore} href='https://apps.apple.com/pt/app/cinemas-nos/id1449728871'/>
          <img src={playStore} href='https://play.google.com/store/apps/details?id=pt.nos.cinemas' />
        </div>
        <div id='social-media-icons'>
          <FontAwesomeIcon href='https://www.facebook.com/cinemasnos' className='icon' icon={faFacebookF}/>
          <FontAwesomeIcon href='https://www.instagram.com/cinemas.nos' className='icon' icon={faInstagram}/>
          <FontAwesomeIcon href='https://www.youtube.com/c/cinemasnos' className='icon' icon={faYoutube}/>
        </div>
      </div>
      <div id='footer-links'>
        <span id='menu-links'>
          <h4>CONTACTOS</h4>
          <h4>RECRUTAMENTO</h4>
          <h4>POLÍTICA DE PRIVACIDADE</h4>
          <h4>CONFIGURAR COOKIES</h4>
          <h4>TERMOS E CONDIÇOES</h4>
        </span>
        <img href='https://www.livroreclamacoes.pt/Inicio/' src={livroReclamacoes}/>
      </div>
    </div>
  )
}

export default Footer