import React, { useState, useEffect } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBars } from '@fortawesome/free-solid-svg-icons'
import './AllMovies.scss'
import MoviePoster from '../MovieList/MoviePoster';
import '../MovieList/MoviePoster.scss'

function AllMovies({ movieGenres, allMovieData, upcomingMovieData, movieData, currentMovieIndex, movieTimes, setOpenPaymentWindow, setSelectedMovie }) {
  const [imaxMovies, setImaxMovies] = useState([]);
  const [inTheaterMovies, setInTheaterMovies] = useState([]);
  const [upcoming, setUpcoming] = useState([]);
  const [moviesToShow, setMoviesToShow] = useState(inTheaterMovies);
  const [showMenuOptions, setShowMenuOptions] = useState(false);
  const [moviesToShowCount, setMoviesToShowCount] = useState(6); 

  useEffect(() => {
    // Gera os valores IMAX apenas uma vez quando o componente é montado
    const imaxMoviesData = allMovieData?.map((movie) => ({
      ...movie,
      Imax: Math.random() < 0.15,
    }));
    setImaxMovies(imaxMoviesData?.filter((movie) => movie.Imax));

    const currentDate = new Date();

    const recentMovies = movieData?.filter(movie => new Date(movie.release_date) <= currentDate)
      .sort((a, b) => new Date(b.release_date) - new Date(a.release_date))
    setInTheaterMovies(recentMovies);

    const allUpcomingMovies = upcomingMovieData?.filter(movie => new Date(movie.release_date) <= currentDate)
      .sort((a, b) => new Date(b.release_date) - new Date(a.release_date));

    setUpcoming(allUpcomingMovies);

    const desiredCount = Math.ceil(allUpcomingMovies?.length / 2);
    const selectedUpcomingMovies = allUpcomingMovies?.slice(0, desiredCount);

    setUpcoming(selectedUpcomingMovies ? selectedUpcomingMovies : 0);

    setMoviesToShow(inTheaterMovies?.slice(0, moviesToShowCount));

  }, [allMovieData, moviesToShowCount]);

  const handleMenuClick = (e) => {
    setShowMenuOptions(!showMenuOptions);
  }

  const handleMenuSwitch = (e) => {
    const menuItems = e.target.parentElement.querySelectorAll(".menu-item");
    menuItems.forEach(menu => {
      menu.classList.remove("menu-active");
    });

    if (e.currentTarget.id === "inTheater") {
      setMoviesToShow(inTheaterMovies);
      e.currentTarget.classList.add("menu-active");
    } else if (e.currentTarget.id === "upcoming") {
      setMoviesToShow(upcoming);
      e.currentTarget.classList.add("menu-active");
    } else {
      setMoviesToShow(imaxMovies);
      e.currentTarget.classList.add("menu-active");
    }
  }

  const handleShowMoreClick = () => {
    // Aumenta o número de filmes a serem exibidos quando o botão "Mostrar Mais" é clicado
    setMoviesToShowCount(prevCount => prevCount + 6);
  };

  return (
    <div id='all-movies-main'>
      <div id='movie-filter-menus-mobile'>
        <div id='movie-filter-menus-content'>
          <FontAwesomeIcon className='menuBtn' onClick={handleMenuClick.bind(this)} icon={faBars} />
          {showMenuOptions ? (
            <div id='mobile-menu-options'>
              <h2 id='inTheater' className='menu-item menu-active' onClick={handleMenuSwitch.bind(this)}>Em Cartaz ({inTheaterMovies?.length})</h2>
              <h2 id='upcoming' className='menu-item' onClick={handleMenuSwitch.bind(this)}>Brevemente ({upcoming?.length})</h2>
              <h2 id='imax' className='menu-item' onClick={handleMenuSwitch.bind(this)}>IMAX ({imaxMovies?.length})</h2>
            </div>
          ) : (<></>)}
          <div id='movies-filter-by-genere'>
            <select>
              {<option>Selecionar género</option>}
              {movieGenres?.map((genre, index) => (
                <option key={index}>{genre.name}</option>
              ))}
            </select>
          </div>
        </div>
      </div>
      <div id='movie-filter-menus'>
        <div id='movie-filter-menus-content'>
          <h2 id='inTheater' className='menu-item menu-active' onClick={handleMenuSwitch.bind(this)}>Em Cartaz ({inTheaterMovies?.length})</h2>
          <h2 id='upcoming' className='menu-item' onClick={handleMenuSwitch.bind(this)}>Brevemente ({upcoming?.length})</h2>
          <h2 id='imax' className='menu-item' onClick={handleMenuSwitch.bind(this)}>IMAX ({imaxMovies?.length})</h2>
          <div id='movies-filter-by-genere'>
            <label>Pesquisar por género</label>
            <select>
              {<option>Selecionar género</option>}
              {movieGenres?.map((genre, index) => (
                <option key={index}>{genre.name}</option>
              ))}
            </select>
          </div>
        </div>
      </div>
      <div id='all-movies-list'>
        <ul>
          {moviesToShow?.map((movie, index) => (
            <MoviePoster key={index} currentMovieIndex={currentMovieIndex} movie={movie} index={index} movieTimes={movieTimes} movieGenres={movieGenres} setSelectedMovie={setSelectedMovie} setOpenPaymentWindow={setOpenPaymentWindow} movieData={moviesToShow} />
          ))}
        </ul>
        <div id='show-more-button'>
          {inTheaterMovies?.length > moviesToShowCount && (
            <button onClick={handleShowMoreClick}>Mostrar Mais</button>
          )}
        </div>
      </div>
    </div>
  )
}

export default AllMovies