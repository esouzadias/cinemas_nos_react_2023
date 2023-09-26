import React, { useMemo } from 'react';
import './MovieList.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTicket } from '@fortawesome/free-solid-svg-icons'

function MovieList({ movieData, currentMovieIndex, movieTimes, movieGenres, setMainMovie }) {
  const displayedMovies = movieData && movieData.slice(0, 6);
  const adultGenres = ["Horror", "Thriller", "Drama"];

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

  const isAdult = useMemo(() => {
    if (movieGenres && movieData && movieData[currentMovieIndex]) {
      const currentGenreIds = movieData[currentMovieIndex].genre_ids || [];
      const currentGenreNames = currentGenreIds.map((genreId) => {
        const genre = movieGenres.find((genre) => genre.id === genreId);
        return genre ? genre.name : "";
      });
      return currentGenreNames.some((genre) => adultGenres.includes(genre));
    }
    return false;
  }, [movieGenres, movieData, currentMovieIndex]);

  const handleMovieClick = () => {

  }

  return (
    <div>
      {displayedMovies && (
        <div id='playing-movies'>
          <ul>
            {displayedMovies.map((movie, index) => (
              <li onClick={handleMovieClick} key={movie.id}>
                <span id='comprar-bilhete'>
                  <FontAwesomeIcon className='icon' icon={faTicket}/>
                  <h4>Comprar Bilhete</h4>
                </span>
                <img src={`https://image.tmdb.org/t/p/w500/${movie.poster_path}`} alt={movie.title} />
                <div className='movie-poster-info'>
                  <h3>{movie.title}</h3>
                  <p>{getMovieGenres(index)}</p>
                  <p>{isAdult ? `M18 • ${movieTimes[index]}` : `M14 • ${movieTimes[index]}`}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default MovieList;
