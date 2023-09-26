import React, { useState, useEffect } from 'react';
import './App.scss';
import Header from "./Layout/Header/Header";
import MainIntro from './Layout/MainIntro/MainIntro';
import MovieList from './Layout/MovieList/MovieList';
import { fetchNowPlayingMoviesData, fetchCommingSoonMoviesData, fetchMoviesGenres, fetchMovieTrailersData } from './Services/Utils/ApiRequests';
import cinemaStatic from './Assets/Images/cinema_icon_static.png';
import cinemaHover from './Assets/Images/output-onlinegiftools.gif';

function App() {
  /* const [isMobile, setIsMobile] = useState(false); */
  const [movieData, setMovieData] = useState(null);
  const [upcomingMovieData, setupcomingMovieData] = useState(null);
  const [movieGenres, setMovieGenres] = useState(null);
  const [currentMovieGenre, setCurrentMovieGenre] = useState([]);
  const [currentMovieIndex, setCurrentMovieIndex] = useState(0); // Índice inicial
  const intervalTime = 10000; // Alterar a cada 5 segundos (ou o que desejar)
  const [movieTimes, setMovieTimes] = useState([]); // Estado para armazenar os valores de movieTime
  const [hover, setHover] = useState(false);
  const [nowPlaying, setNowPlaying] = useState(true);

  const fetchMoviesAndGenres = async () => {
    try {
      const movieResponse = await fetchNowPlayingMoviesData();
      const upcomingMoviesResponse = await fetchCommingSoonMoviesData();
      const genreResponse = await fetchMoviesGenres();
      setMovieData(movieResponse.results);
      setMovieGenres(genreResponse.genres);
      setupcomingMovieData(upcomingMoviesResponse.results);

      // Gere aleatoriamente os valores de movieTime uma vez
      const generatedMovieTimes = Array.from({ length: movieResponse.results.length }, () => {
        return `${Math.floor(Math.random() * (180 - 60 + 1)) + 60} Min`;
      });
      setMovieTimes(generatedMovieTimes);
    } catch (error) {
      console.error(error);
    }
  };

  const handleMovieTypeClick = () => setNowPlaying(!nowPlaying);

  useEffect(() => {
    if (movieData && movieData[currentMovieIndex]) {
      const currentMovieGenreIds = movieData[currentMovieIndex].genre_ids || [];
      const currentMovieGenreNames = currentMovieGenreIds.map((genreId) => {
        const genre = movieGenres?.find((genre) => genre.id === genreId);
        return genre ? genre.name : "";
      }).join(", ");
      setCurrentMovieGenre(currentMovieGenreNames);
    } else if(upcomingMovieData && upcomingMovieData[currentMovieIndex]) {
      const currentMovieGenreIds = upcomingMovieData[currentMovieIndex].genre_ids || [];
      const currentMovieGenreNames = currentMovieGenreIds.map((genreId) => {
        const genre = movieGenres?.find((genre) => genre.id === genreId);
        return genre ? genre.name : "";
      }).join(", ");
      setCurrentMovieGenre(currentMovieGenreNames);
    }
  }, [currentMovieIndex, movieData, upcomingMovieData, movieGenres]);

  useEffect(() => {
    fetchMoviesAndGenres();

    // Configurar um intervalo para alterar o filme exibido a cada x segundos
    const intervalId = setInterval(() => {
      setCurrentMovieIndex((prevIndex) => (prevIndex + 1) % 6); // Alternar entre os 6 filmes
    }, intervalTime);

    return () => {
      // Limpar o intervalo quando o componente é desmontado
      clearInterval(intervalId);
    };
  }, []);

  return (
    <div className="App">
      <Header />
        {movieData && currentMovieGenre && movieTimes.length > 0 && (
      <>
        <MainIntro 
          mainMovie={movieData ? movieData : null} 
          currentMovieIndex={currentMovieIndex}
          currentMovieGenre={currentMovieGenre}
          movieTime={movieTimes[currentMovieIndex]}
          />
        <div className='movies-category'>
          <div className='movies-category-content'>
            <span>
              <h2 onClick={handleMovieTypeClick} className={nowPlaying ? 'header-links-active' : 'header-links'} id='filmesEmCartaz'><hr/> Filmes em cartaz</h2>
              <h2 onClick={handleMovieTypeClick} className={nowPlaying ? 'header-links' : 'header-links-active'} id='brevemente'><hr/> Brevemente</h2>
            </span>
            <div className='check-all-movies'>
              <img src={hover ? cinemaHover : cinemaStatic} alt="Cinema" />
              <a href='www.google.pt'
                onMouseEnter={() => setHover(true)}
                onMouseLeave={() => setHover(false)}
              >Ver todos os filmes</a>
            </div>
          </div>
        </div>
        {nowPlaying ? (
          <MovieList 
            movieGenres={movieGenres} 
            currentMovieGenre={currentMovieGenre} 
            currentMovieIndex={currentMovieIndex} 
            movieData={movieData} 
            movieTimes={movieTimes}
            />
        ) : (
          <MovieList 
            movieGenres={movieGenres} 
            currentMovieGenre={currentMovieGenre} 
            currentMovieIndex={currentMovieIndex} 
            movieData={upcomingMovieData} 
            movieTimes={movieTimes}/>
        )}
      </>
      )}
    </div>
  );
}

export default App;
