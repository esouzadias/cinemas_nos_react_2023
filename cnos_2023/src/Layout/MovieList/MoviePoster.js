import React, { useMemo } from 'react'
import './MoviePoster.scss'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTicket } from '@fortawesome/free-solid-svg-icons'

function MoviePoster({ movie, index, movieGenres, movieTimes, movieData, currentMovieIndex, adultGenres, isAdult, setOpenPaymentWindow, setSelectedMovie }) {
  
  const handleMovieClick = () => {
    setOpenPaymentWindow(true);
    setSelectedMovie(movie);
  }

  const getMovieGenres = (movieIndex) => {
    if (movieGenres && movieData && movieData[movieIndex]) {
      const movieGenreIds = movieData[movieIndex].genre_ids || [];
      const movieGenreNames = movieGenreIds.map((genreId) => {
        const genre = movieGenres.find((genre) => genre.id === genreId);
        return genre ? genre.name : "";
      });
      return movieGenreNames.join(", ");
    }
    return "";
  };

  return (
    <li id='movie-poster' onClick={handleMovieClick} key={movie.id}>
      <span id='comprar-bilhete'>
        <FontAwesomeIcon className='icon' icon={faTicket}/>
        <h4>Comprar Bilhete</h4>
      </span>
      <img src={`https://image.tmdb.org/t/p/w500/${movie.poster_path}`} alt={movie.title} />
      <div className='movie-poster-info'>
        <h3>{movie.title}</h3>
        <p>{getMovieGenres(index)}</p>
        <p>{isAdult ? `M18 • ${movie.duration} Min` : `M14 • ${movie.duration} Min`}</p>
      </div>
    </li>
  )
}

export default MoviePoster