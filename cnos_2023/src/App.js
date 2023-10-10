import React, { useState, useEffect, useMemo } from 'react';
import './App.scss';

//*Layouts
import Header from "./Layout/Header/Header";
import MainIntro from './Layout/MainIntro/MainIntro';
import MovieList from './Layout/MovieList/MovieList';
import AllMovies from './Layout/AllMovies/AllMovies'
import Cinemas from './Layout/Cinemas/Cinemas';
import Footer from './Layout/Footer/Footer';

//*Components
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
  const [movieData, setMovieData] = useState(null);
  const [allMovieData, setAllMovieData] = useState(null);
  const [upcomingMovieData, setupcomingMovieData] = useState(null);
  const [movieGenres, setMovieGenres] = useState(null);
  const [currentMovieGenre, setCurrentMovieGenre] = useState([]);
  const [currentMovieIndex, setCurrentMovieIndex] = useState(0); // Índice inicial
  const intervalTime = 10000; // Alterar a cada 5 segundos (ou o que desejar)
  const [movieTimes, setMovieTimes] = useState([]); // Estado para armazenar os valores de movieTime
  const [hover, setHover] = useState(false);
  const [nowPlaying, setNowPlaying] = useState(true);
  const adultGenres = ["Horror", "Thriller", "Drama"];
  const [isAdult, setIsAdult] = useState(false);

  // LISTA DE INFORMAÇÕES
  const GiftCardList = [
    { giftImg: gc_giftCards, title: "Gift Cards", paragraph: "Conhece os nossos cheques prenda cinema (10, 15, 20 ou 25 euros)." },
    { giftImg: gc_valesCinemas, title: "Diferentes Vale Cinema", paragraph: "Os Vales Cinema dão-te acesso a uma sessão de cinema (2D, IMAX OU 4DX)." },
    { giftImg: gc_aluguerSalas, title: "Alugueres para Empresas", paragraph: "Tudo o que procura para um evento, reunião, conferência ou apresentação." },
    { giftImg: gc_festasAniv, title: "Festas de Aniversário", paragraph: "O espaço ideal para as festas de aniversário dos mais novos." },
    { giftImg: gc_operasBailados, title: "Conteúdos Alternativos", paragraph: "Explora outras experiências para além de cinema, com a qualidade de som e imagem das nossas salas (Óperas, Bailados, Concertos)." },
    { giftImg: gc_banner_gaming, title: "Gaming", paragraph: "Inscreve-te, assiste e participa nas nossas experiências Gaming (*produto temporariamente indisponível)" },
  ];

  const numberListInfo = [
    { title: "Escolhe o filme e a sessão", paragraph: "Escolhe um filme em exibição numa sala de cinema NOS ou daqueles que te propomos. A reserva tem de ser feita até 72h antes do início da sessão." },
    { title: "Reserva a tua sala de cinema", paragraph: (<p>O aluguer da sala pode ser feito no balcão do cinema(*)<br /> <br /> Para mais informações contacta-nos através do e-mail: cinemas@nos.pt <br /><br /><br />(*) exclui sessões corporativas</p>) },
    { title: "Prepara a tua lista de convidados", paragraph: "Escolhe com quem queres partilhar esta experiência." },
    { title: "Bom filme!", paragraph: "Prepara-te para uma experiência inesquecível." },
  ]

  const cinemasList = {
    "Grande Lisboa": [
      { "cinema": "Alfragide", "salas": 8 },
      { "cinema": "Amoreiras", "salas": 12 },
      { "cinema": "Colombo", "salas": 9 },
      { "cinema": "Odivelas Parque", "salas": 6 },
      { "cinema": "Parque Nascente", "salas": 5 },
      { "cinema": "Vasco da Gama", "salas": 7 },
      { "cinema": "Alvaláxia", "salas": 6 }
    ],
    "Grande Porto": [
      { "cinema": "NorteShopping", "salas": 16 },
      { "cinema": "Mar Shopping", "salas": 7 },
      { "cinema": "Parque Maia", "salas": 5 },
      { "cinema": "Parque Vila do Conde", "salas": 9 },
      { "cinema": "Parque Nascente", "salas": 7 },
      { "cinema": "GaiaShopping", "salas": 10 }
    ],
    "Norte": [
      { "cinema": "Braga Parque", "salas": 7 },
      { "cinema": "GuimarãeShopping", "salas": 12 },
      { "cinema": "MaiaShopping", "salas": 7 },
      { "cinema": "Gaiashopping", "salas": 5 }
    ],
    "Centro": [
      { "cinema": "Fórum Coimbra", "salas": 12 },
      { "cinema": "Alma Shopping", "salas": 6 },
      { "cinema": "Palácio do Gelo", "salas": 9 },
      { "cinema": "Fórum Aveiro", "salas": 7 },
      { "cinema": "Fórum Viseu", "salas": 6 }
    ],
    "Sul": [
      { "cinema": "AlgarveShopping", "salas": 7 },
      { "cinema": "Forum Algarve", "salas": 8 },
      { "cinema": "Faro", "salas": 6 },
      { "cinema": "Guia", "salas": 5 },
      { "cinema": "Tavira", "salas": 12 }
    ],
    "Madeira": [
      { "cinema": "Madeira Shopping", "salas": 8 },
      { "cinema": "Parque Central", "salas": 7 },
      { "cinema": "La Vie", "salas": 6 },
      { "cinema": "Porto Santo", "salas": 7 }
    ]
  }

  // PEDIDO A API PARA BUSCAR OS FILMES E OS GÉNEROS
  const fetchMoviesAndGenres = async (cinemasList) => {
    try {
      const movieResponse = await fetchNowPlayingMoviesData();
      const upcomingMoviesResponse = await fetchCommingSoonMoviesData();
      const genreResponse = await fetchMoviesGenres();

      const generatedMovieDurations = Array.from({ length: movieResponse.results.length }, () => {
        return Math.floor(Math.random() * (275 - 80 + 1)) + 80; // Gera um número entre 80 e 275
      });

      // Atualize os dados do filme com as durações geradas
      const updatedMovieData = movieResponse.results.map((movie, index) => {
        return {
          ...movie,
          duration: generatedMovieDurations[index],
          salas: generateSalasInfo(cinemasList),
        };
      });

      setMovieData(updatedMovieData);
      setAllMovieData(updatedMovieData);
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

  // ALTERNAR ENTRE FILMES EM CARTAZ E BREVEMENTE
  const handleMovieTypeClick = () => setNowPlaying(!nowPlaying);

  // ATRIBUI OS VALORES DOS FILMES E GENRES PARA OS ESTADOS PARA SEREM PASSADOS PARA OS OUTROS COMPONENTES
  // CORRE APENAS QUANDO CURRENTMOVIEINDEX, MOVIEDATA, UPCOMINGMOVIEDATA E MOVIEGENRES EXISTEM.
  useEffect(() => {
    if (movieData && movieData[currentMovieIndex]) {
      const currentMovieGenreIds = movieData[currentMovieIndex]?.genre_ids || [];
      const currentMovieGenreNames = currentMovieGenreIds.map((genreId) => {
        const genre = movieGenres?.find((genre) => genre.id === genreId);
        return genre ? genre.name : "";
      }).join(", ");

      setCurrentMovieGenre(currentMovieGenreNames);
    } else if (upcomingMovieData && upcomingMovieData[currentMovieIndex]) {
      const currentMovieGenreIds = upcomingMovieData[currentMovieIndex]?.genre_ids || [];
      const currentMovieGenreNames = currentMovieGenreIds.map((genreId) => {
        const genre = movieGenres?.find((genre) => genre.id === genreId);
        return genre ? genre.name : "";
      }).join(", ");
      setCurrentMovieGenre(currentMovieGenreNames);
    }
  }, [currentMovieIndex, movieData, upcomingMovieData, movieGenres]);

  // CORRE QUANDO O COMPONENTE CARREGA.
  useEffect(() => {
    fetchMoviesAndGenres(cinemasList);
    // Configurar um intervalo para alterar o filme exibido a cada x segundos
    const intervalId = setInterval(() => {
      setCurrentMovieIndex((prevIndex) => (prevIndex + 1) % 6); // Alternar entre os 6 filmes
    }, intervalTime);

    return () => {
      // Limpar o intervalo quando o componente é desmontado
      clearInterval(intervalId);
    };
  }, []);

  // VALIDA TODOS OS FILMES E ATRIBUI O BOOLEANO TRUE OU FALSE SE O FILME FOR ADULTO
  const validateIsAdult = useMemo(() => {
    if (movieGenres && movieData && movieData[currentMovieIndex]) {
      const currentGenreIds = movieData[currentMovieIndex].genre_ids || [];
      const currentGenreNames = currentGenreIds.map((genreId) => {
        const genre = movieGenres.find((genre) => genre.id === genreId);
        return genre ? genre.name : "";
      });
      return currentGenreNames.some((genre) => adultGenres?.includes(genre));
      setIsAdult(validateIsAdult);
    }
    return false;
  }, [movieGenres, movieData, allMovieData, currentMovieIndex]);

  const generateSalasInfo = (cinemasList) => {
    if (!cinemasList) {
      return null;
    }

    const cities = Object.keys(cinemasList);

    const numCities = Math.floor(Math.random() * cities.length) + 1;

    const shuffledCities = cities.sort(() => Math.random() - 0.5);
    const selectedCities = shuffledCities.slice(0, numCities);

    const selectedCinemasInfo = selectedCities.map((city) => {
      const cityCinemas = cinemasList[city];

      const minCinemas = city === "Grande Lisboa" || city === "Grande Porto" ? 4 : 2;
      const maxCinemas = city === "Grande Lisboa" || city === "Grande Porto" ? 8 : 5;
      const numCinemas = Math.floor(Math.random() * (maxCinemas - minCinemas + 1)) + minCinemas;

      const shuffledCinemas = cityCinemas.sort(() => Math.random() - 0.5);
      const selectedCinemas = shuffledCinemas.slice(0, numCinemas);

      return {
        Cidade: city,
        Cinemas: selectedCinemas.map((cinema) => ({
          Nome: cinema.cinema,
          Salas: cinema.salas,
        })),
      };
    });

    return selectedCinemasInfo;
  };

  return (
    <div className="App">
      <Header /* cinemasList={cinemasList} */ movieTimes={movieTimes} isAdult={isAdult} adultGenres={adultGenres} allMovies={allMovieData} />
      {movieData && currentMovieGenre && movieTimes.length > 0 && (
        <>
          <MainIntro
            mainMovie={movieData ? movieData : null}
            currentMovieIndex={currentMovieIndex}
            currentMovieGenre={currentMovieGenre}
            movieTime={movieTimes[currentMovieIndex]}
            isAdult={isAdult}
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
              adultGenres={adultGenres}
              isAdult={isAdult}
            />
          ) : (
            <MovieList
              movieGenres={movieGenres}
              currentMovieGenre={currentMovieGenre}
              currentMovieIndex={currentMovieIndex}
              movieData={upcomingMovieData}
              movieTimes={movieTimes}
              adultGenres={adultGenres}
              isAdult={isAdult}
            />
          )}
        </>
      )}
      <Cinemas cinemasList={cinemasList} />
      <AllMovies currentMovieIndex={currentMovieIndex} movieTimes={movieTimes} movieGenres={movieGenres} allMovieData={allMovieData} movieData={movieData} upcomingMovieData={upcomingMovieData} />
      <Banner backgroundImage={vantagensBg} title={"Doces ou salgadas"} paragraph={"Pipocas, menus, bebidas e muito mais"} buttonText={"Comprar artigos de bar"} />
      <Banner backgroundImage={outrosProdBg} title={"Mais do que um cinema, um espaço de entretenimento para todos"} paragraph={"Descobre toda a oferta de produto disponível nos Cinemas NOS."} />
      <div id='gift-card-list'>
        {GiftCardList.map((giftCard, index) => (
          <GiftCard key={index} giftImg={giftCard.giftImg} title={giftCard.title} paragraph={giftCard.paragraph} />
        ))}
      </div>
      <Banner2Div title="Uma sala só para ti" paragraph="Agora podes ter uma sessão de cinema exclusiva para ti e para os teus convidados em qualquer sala dos Cinemas NOS." image={cinemasSalas} />
      <NumberList numberListInfo={numberListInfo} />
      <Footer />
    </div>
  );
}

export default App;
