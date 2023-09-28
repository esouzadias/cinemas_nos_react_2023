import React, { useState, useEffect } from 'react';
import './App.scss';

//*Components
import Header from "./Layout/Header/Header";
import MainIntro from './Layout/MainIntro/MainIntro';
import MovieList from './Layout/MovieList/MovieList';
import Cinemas from './Layout/Cinemas/Cinemas';
import Banner from './Components/Banner/Banner';
import GiftCard from './Components/GiftCard/GiftCard';
import Banner2Div from './Components/Banner2Div/Banner2Div';
import NumberList from './Components/NumberList/NumberList';
import { fetchNowPlayingMoviesData, fetchCommingSoonMoviesData, fetchMoviesGenres, fetchMovieTrailersData } from './Services/Utils/ApiRequests';

//*Assets
import cinemaStatic from './Assets/Images/cinema_icon_static.png';
import cinemaHover from './Assets/Images/output-onlinegiftools.gif';
import vantagensBg from './Assets/Images/banner-vantagens-desktop.png';
import outrosProdBg from './Assets/Images/banner_outros_produtos.png';

import gc_giftCards from './Assets/Images/gift-cards.png';
import gc_valesCinemas from './Assets/Images/vales-cinemas.png';
import gc_aluguerSalas from './Assets/Images/Aluguer_de_salas_CinemasNos.png';
import gc_festasAniv from './Assets/Images/cinemasnos_festasaniversario.png';
import gc_operasBailados from './Assets/Images/operas-a-bailados.jpg';
import gc_banner_gaming from './Assets/Images/banner_gaming.jpg';

import cinemasSalas from './Assets/Images/cinemas_nos_sala_de_cinema.jpeg';

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

  const GiftCardList = [
    { giftImg: gc_giftCards, title: "Gift Cards", paragraph: "Conhece os nossos cheques prenda cinema (10, 15, 20 ou 25 euros)." },
    { giftImg: gc_valesCinemas, title: "Diferentes Vale Cinema", paragraph: "Os Vales Cinema dão-te acesso a uma sessão de cinema (2D, IMAX OU 4DX)." },
    { giftImg: gc_aluguerSalas, title: "Alugueres para Empresas", paragraph: "Tudo o que procura para um evento, reunião, conferência ou apresentação." },
    { giftImg: gc_festasAniv, title: "Festas de Aniversário", paragraph: "O espaço ideal para as festas de aniversário dos mais novos." },
    { giftImg: gc_operasBailados, title: "Conteúdos Alternativos", paragraph: "Explora outras experiências para além de cinema, com a qualidade de som e imagem das nossas salas (Óperas, Bailados, Concertos)." },
    { giftImg: gc_banner_gaming, title: "Gaming", paragraph: "Inscreve-te, assiste e participa nas nossas experiências Gaming (*produto temporariamente indisponível)" },
  ];

  const numberListInfo = [
    {title: "Escolhe o filme e a sessão", paragraph: "Escolhe um filme em exibição numa sala de cinema NOS ou daqueles que te propomos. A reserva tem de ser feita até 72h antes do início da sessão."},
    {title: "Reserva a tua sala de cinema", paragraph: (<p>O aluguer da sala pode ser feito no balcão do cinema(*)<br /> <br /> Para mais informações contacta-nos através do e-mail: cinemas@nos.pt <br /><br /><br />(*) exclui sessões corporativas</p>)},
    {title: "Prepara a tua lista de convidados", paragraph: "Escolhe com quem queres partilhar esta experiência."},
    {title: "Bom filme!", paragraph: "Prepara-te para uma experiência inesquecível."},
  ]

  const handleMovieTypeClick = () => setNowPlaying(!nowPlaying);

  useEffect(() => {
    if (movieData && movieData[currentMovieIndex]) {
      const currentMovieGenreIds = movieData[currentMovieIndex].genre_ids || [];
      const currentMovieGenreNames = currentMovieGenreIds.map((genreId) => {
        const genre = movieGenres?.find((genre) => genre.id === genreId);
        return genre ? genre.name : "";
      }).join(", ");
      setCurrentMovieGenre(currentMovieGenreNames);
    } else if (upcomingMovieData && upcomingMovieData[currentMovieIndex]) {
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
                <h2 onClick={handleMovieTypeClick} className={nowPlaying ? 'header-links-active' : 'header-links'} id='filmesEmCartaz'><hr /> Filmes em cartaz</h2>
                <h2 onClick={handleMovieTypeClick} className={nowPlaying ? 'header-links' : 'header-links-active'} id='brevemente'><hr /> Brevemente</h2>
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
              movieTimes={movieTimes} />
          )}
        </>
      )}
      <Cinemas />
      <Banner backgroundImage={vantagensBg} title={"Doces ou salgadas"} paragraph={"Pipocas, menus, bebidas e muito mais"} buttonText={"Comprar artigos de bar"} />
      <Banner backgroundImage={outrosProdBg} title={"Mais do que um cinema, um espaço de entretenimento para todos"} paragraph={"Descobre toda a oferta de produto disponível nos Cinemas NOS."} />
      <div id='gift-card-list'>
        {GiftCardList.map((giftCard, index) => (
          <GiftCard key={index} giftImg={giftCard.giftImg} title={giftCard.title} paragraph={giftCard.paragraph} />
        ))}
      </div>
      <Banner2Div title="Uma sala só para ti" paragraph="Agora podes ter uma sessão de cinema exclusiva para ti e para os teus convidados em qualquer sala dos Cinemas NOS." image={cinemasSalas}/>
      <NumberList numberListInfo={numberListInfo}/>
    </div>
  );
}

export default App;
