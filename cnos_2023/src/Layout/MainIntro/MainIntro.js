import React, { useState, useEffect } from 'react'
import './MainIntro.scss'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlay } from '@fortawesome/free-solid-svg-icons'
import { faClose } from '@fortawesome/free-solid-svg-icons'
import { fetchMovieTrailersData } from '../../Services/Utils/ApiRequests.js';

function MainIntro({ mainMovie, currentMovieIndex, currentMovieGenre, movieTime }) {
  const [backgroundImage, setBackgroundImage] = useState(mainMovie && (`url(https://image.tmdb.org/t/p/w500${mainMovie[currentMovieIndex].poster_path})`));
  const [trailerPlaying, setTrailerPlaying] = useState(false);
  const [currentMovie, setCurrentMovie] = useState(mainMovie[0]);
  const [movieTrailersData, setMovieTrailersData] = useState(null);

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

  const handleCloseClick = (e) => {
    setTrailerPlaying(false);
    e.currentTarget.parentElement.style.paddingTop = "50px";
  }

  const fetchTrailers = async () => {
    try {
      const movieTrailersResponse = await fetchMovieTrailersData(currentMovie.id);
      setMovieTrailersData(movieTrailersResponse.results);
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    if (!trailerPlaying) {
      mainMovie && (setBackgroundImage(`url(https://image.tmdb.org/t/p/w500${mainMovie[currentMovieIndex].poster_path})`));
      setCurrentMovie(mainMovie[currentMovieIndex]);

      // Configurar um temporizador para alterar o plano de fundo a cada x segundos
      const timerId = setTimeout(() => {
        const nextIndex = (currentMovieIndex + 1) % 6; // Alternar entre os 6 filmes
        setBackgroundImage(
          mainMovie && mainMovie[nextIndex]
            ? `url(https://image.tmdb.org/t/p/w500${mainMovie[nextIndex].poster_path})`
            : ''
        );
      }, 10000); // Alterar a cada 5 segundos (ou o que desejar)

      return () => {
        // Limpar o temporizador quando o componente é desmontado ou quando o índice muda
        clearTimeout(timerId);
      };
    }
  }, [currentMovieIndex, mainMovie]);

  return (
    <div id='main-intro'>
      {trailerPlaying && (<FontAwesomeIcon id='closeBtn' onClick={handleCloseClick.bind(this)} icon={faClose} />)}
      <div id='main-intro-content'>
        {!trailerPlaying ? (
          <div onClick={handleTrailerClick} id={'video-player'} style={{ backgroundImage: backgroundImage, backgroundSize: 'cover' }}>
            <FontAwesomeIcon className='icon' icon={faPlay} />
          </div>
        ) : (
        <>
          <iframe width="100%" height="80%" src={movieTrailersData && `https://www.youtube.com/embed/${movieTrailersData[4].key}?autoplay=1`} />
        </>
        )}
        {!trailerPlaying && (
          <div className='movie-info'>
            <div className='movie-info-container'>
              <span>M16 • {currentMovieGenre ? currentMovieGenre : null} | {movieTime ? movieTime : null}</span>
              <h2>{mainMovie[currentMovieIndex]?.original_title}</h2>
              <span>{mainMovie[currentMovieIndex]?.overview}</span>
              <div>
                Língua: {mainMovie[currentMovieIndex].original_language}
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