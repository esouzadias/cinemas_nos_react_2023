import React, { useMemo } from 'react';
import './MovieList.scss';
import MoviePoster from './MoviePoster';

function MovieList({ movieData, currentMovieIndex, movieTimes, movieGenres, adultGenres, isAdult, setOpenPaymentWindow, setSelectedMovie}) {
  const displayedMovies = movieData && movieData.slice(0, 6);
  
  return (
    <div>
      {displayedMovies && (
        <div id='playing-movies'>
          <ul>
            {displayedMovies.map((movie, index) => (
              <MoviePoster setOpenPaymentWindow={setOpenPaymentWindow} setSelectedMovie={setSelectedMovie} key={index} currentMovieIndex={currentMovieIndex} movie={movie} index={index} movieTimes={movieTimes} isAdult={isAdult} movieGenres={movieGenres} movieData={movieData} adultGenres={adultGenres}/>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default MovieList;
