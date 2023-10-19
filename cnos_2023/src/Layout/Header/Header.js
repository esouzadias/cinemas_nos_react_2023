import React, {useState} from 'react'
import "./Header.scss";
import PaymentWindow from "../PaymentWindow/PaymentWindow";

import logoNos from '../../Assets/Images/logo-nos.svg';
import SearchMenu from '../MainIntro/SearchMenu/SearchMenu';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSearch } from '@fortawesome/free-solid-svg-icons'

<<<<<<< Updated upstream
function Header() {
=======
function Header({ allMovies, setselectedMovie,  setOpenPaymentWindow, setLinkValue, setLink}) {
  const [ShowSearchResultsWindow, setShowSearchResultsWindow] = useState(false);
  const [numSearchResults, setNumSearchResults] = useState(0);
  const [movieResults, setMovieResults] = useState([]);
  
  const handleSearchInput = (e) => {
    setShowSearchResultsWindow(true);
    const searchText = e.currentTarget.value.toUpperCase();
    
    const filteredMovies = allMovies?.filter(movie => movie.original_title.toUpperCase().includes(searchText));
    setMovieResults(filteredMovies);
    setNumSearchResults(filteredMovies.length);

    if(e.currentTarget.value == '') {
      setNumSearchResults(0);
      setShowSearchResultsWindow(false);
    }
  }

  const handleShowPaymentWindow = (e) => {
    const movie = movieResults?.filter((movie) => movie.original_title == e.currentTarget.textContent);
    setselectedMovie(movie[0]);
    setOpenPaymentWindow(true);
    setShowSearchResultsWindow(false);
    setMovieResults([]);
    document.body.style.overflow = "hidden"; //Prevents scroll
  }

>>>>>>> Stashed changes
  return (
  <>
    <div className="header-main">
      <div className='header-content'>
        <span id='nos-cinemas-logo'><h2>Cinemas</h2> <img src={logoNos} /> </span>
        <span id="search">
          <input onChange={handleSearchInput.bind(this)} className='search-input' type='text' name="fulltext" role='combobox' placeholder='Pesquise por filmes, atores, realizadores...'/>
          <FontAwesomeIcon className='icon' icon={faSearch} />
          <div id={`search-results${ShowSearchResultsWindow ? '-active' : ''}`}>
            <h3>{numSearchResults} resultado{`${numSearchResults > 1 ||numSearchResults == 0 ? 's' : ''}`}:</h3>
            <hr/>
              {movieResults?.map((movie, index) =>(
                <div key={index}>
                  <h4 onClick={handleShowPaymentWindow.bind(this)}>{movie.original_title}</h4>
                </div>
              ))}
          </div>
        </span>
      </div>
      <SearchMenu setLink={setLink} setLinkValue={setLinkValue}/>
    </div>
<<<<<<< Updated upstream
=======
  </>
>>>>>>> Stashed changes
  )
}

export default Header