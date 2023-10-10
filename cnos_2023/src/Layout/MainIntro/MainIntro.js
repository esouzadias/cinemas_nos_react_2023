//* SUMARY: ESTE COMPONENTE RECOLHE OS FILES E A SUA INFORMAÇÃO COM BASE NA API E APRESENTAR EM FORMATO DE SLIDER TODOS OS FILMES QUE ESTÃO NESTE MOMENTO NOS CINEMAS.
//* ALÉM DISSO, PERMITE SELECIONAR O FILME E VER O TRAILER DISPONÍVEL E COMPRAR BILHETE A PARTIR DA MESMA JANELA. =================================================== 

import React, { useState, useEffect } from 'react'
import './MainIntro.scss'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlay } from '@fortawesome/free-solid-svg-icons'
import { faClose } from '@fortawesome/free-solid-svg-icons'
import { fetchMovieTrailersData } from '../../Services/Utils/ApiRequests.js';

function MainIntro({ mainMovie, currentMovieIndex, currentMovieGenre, movieTime, isAdult }) {
  const [backgroundImage, setBackgroundImage] = useState(mainMovie && (`url(https://image.tmdb.org/t/p/w500${mainMovie[currentMovieIndex]?.backdrop_path})`));
  const [trailerPlaying, setTrailerPlaying] = useState(false);
  const [currentMovie, setCurrentMovie] = useState(mainMovie ? mainMovie[0] : null);
  const [movieTrailersData, setMovieTrailersData] = useState(null);


  // Muda o backdrop para um video player e corre o trailer do filme selecionado
  const handleTrailerClick = (e) => {
    e.currentTarget.style.display = 'none';
    e.currentTarget.parentElement.style.transition = "width 0.5s ease-in-out";
    e.currentTarget.parentElement.style.width = "100%";
    e.currentTarget.parentElement.parentElement.style.paddingTop = "110px";
    e.currentTarget.parentElement.style.animation = "fadeOut ease 0.5s";
    fetchTrailers();
    setTimeout(function () {
    if (!trailerPlaying) {
      setTrailerPlaying(true);
    }
  }, 500);
  }

  // fecha o video player e volta ao estado default do slider
  const handleCloseClick = (e) => {
    setTrailerPlaying(false);
    e.currentTarget.parentElement.style.paddingTop = "50px";
  }

  // recolhe os trailes de todos os filmes
  const fetchTrailers = async () => {
    try {
      const movieTrailersResponse = await fetchMovieTrailersData(currentMovie.id);
      setMovieTrailersData(movieTrailersResponse.results);
    } catch (error) {
      console.error(error);
    }
  }

  // Configura um temporizador para alterar o plano de fundo a cada x segundos
  useEffect(() => {
    if (!trailerPlaying) {
      mainMovie && (setBackgroundImage(`url(https://image.tmdb.org/t/p/w500${mainMovie[currentMovieIndex].backdrop_path})`));
      setCurrentMovie(mainMovie[currentMovieIndex]);

      const timerId = setTimeout(() => {
        const nextIndex = (currentMovieIndex + 1) % 6; // Alterna entre cada 6 filmes
        setBackgroundImage(
          mainMovie && mainMovie[nextIndex]
            ? `url(https://image.tmdb.org/t/p/w500${mainMovie[nextIndex].backdrop_path})`
            : ''
        );
      }, 10000); // Altera a cada 5 segundos

      return () => {
        // Limpa o temporizador quando o componente é desmontado ou quando o index muda
        clearTimeout(timerId);
      };
    }
  }, [currentMovieIndex, mainMovie]);

  return (
    <div id='main-intro'>
      {trailerPlaying && (<FontAwesomeIcon id='closeBtn' onClick={handleCloseClick.bind(this)} icon={faClose} />)}
      <div id='main-intro-content'>
        {!trailerPlaying ? (
          <div onClick={handleTrailerClick} id={'video-player'} style={{ backgroundImage: backgroundImage, /* backgroundSize: 'cover' */ }}>
            <FontAwesomeIcon className='icon' icon={faPlay} />
          </div>
        ) : (
        <>
          <iframe width="100%" height="80%" src={movieTrailersData && `https://www.youtube.com/embed/${movieTrailersData[4]?.key}?autoplay=1`} />
        </>
        )}
        {!trailerPlaying && (
          <div className='movie-info'>
            <div className='movie-info-container'>
              <span>{isAdult ? 'M18' : 'M16'} • {currentMovieGenre ? currentMovieGenre : null} | {mainMovie[currentMovieIndex]?.duration} Min</span>
              <h2>{mainMovie[currentMovieIndex]?.original_title}</h2>
              <span>{mainMovie[currentMovieIndex]?.overview}</span>
              <div>
                Língua: {mainMovie[currentMovieIndex]?.original_language}
                <button>Comprar Bilhete</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default MainIntro