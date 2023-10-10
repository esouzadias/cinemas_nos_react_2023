import React, { useState, useEffect } from 'react'
import './PaymentWindow.scss'

import Beneficio from './Beneficio'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faClose } from '@fortawesome/free-solid-svg-icons'
import { faCheck } from '@fortawesome/free-solid-svg-icons'

import mBox from '../../Assets/Images/menu_box.png'
import mPipocas from '../../Assets/Images/menu_pipocas.png'

function PaymentWindow({ openPaymentWindow, setOpenPaymentWindow, selectedMovie, isAdult, /* cinemasList */ }) {
  const data = new Date();
  const diasDaSemana = ['Domingo', 'segunda-feira', 'terça-feira', 'quarta-feira', 'quinta-feira', 'sexta-feira', 'Sábado'];
  const diaDaSemana = diasDaSemana[data.getDay()];
  const dia = data.getDate();
  const meses = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];
  const mes = meses[data.getMonth()];
  const ano = data.getFullYear();
  const horas = data.getHours();
  const minutos = data.getMinutes();

  const [selectedCity, setSelectedCity] = useState(selectedMovie.salas[0]?.Cidade);
  const [selectedCinema, setSelectedCinema] = useState(selectedMovie.salas[0]?.Cinemas[0]?.Nome);
  const [movieSessions, setMovieSessions] = useState([]);
  const [activeRoom, setActiveRoom] = useState(0);
  const [seatsMatrix, setSeatsMatrix] = useState([]);
  const [selectedNumeroPessoas, setSelectedNumeroPessoas] = useState(2);
  const [selectedBancos, setSelectedBancos] = useState([]);
  const cinemaSeats = {};

  const maxForms = 3;
  const formsArray = Array.from({ length: maxForms }, (_, index) => `form${index + 1}`);
  const [currentForm, setCurrentForm] = useState(formsArray[0]);
  const [currentProgress, setCurrentProgress] = useState(10);
  const [total, setTotal] = useState("6,35");

  const [checkBoxClicked, setCheckBoxClicked] = useState(false);

  const calculateSessions = (duration) => {
    const startHour = 11;
    const endHour = 23;
    const sessionDuration = duration + 15; // Assumimos 15 minutos entre cada sessão
    const sessions = [];
    let currentHour = startHour;
    let currentMinute = 0;

    while (currentHour < endHour || (currentHour === endHour && currentMinute === 0)) {
      const formattedHour = `${currentHour.toString().padStart(2, '0')}:${currentMinute.toString().padStart(2, '0')}`;
      sessions.push(formattedHour);
      currentMinute += sessionDuration;

      if (currentMinute >= 60) {
        currentHour++;
        currentMinute %= 60;
      }
    }

    return sessions;
  };

  const calculateTotal = () => {
    const bilhetePorPessoa = 6.35;
    const totalBilhetes = selectedNumeroPessoas * bilhetePorPessoa;
    setTotal(totalBilhetes);
  };

  // Função para gerar a matriz de bancos
  const generateSeatsMatrix = () => {
    const minHorizontalSeats = 6;
    const maxHorizontalSeats = 12;
    const minVerticalSeats = 7;
    const maxVerticalSeats = 12;
    const minUnavailableColumns = 1;
    const maxUnavailableColumns = 4; // Defina o número máximo de colunas "unavailable" desejado
    const minUnavailableSeats = 4;
    const maxUnavailableSeats = 6;

    const horizontalSeats = Math.floor(Math.random() * (maxHorizontalSeats - minHorizontalSeats + 1)) + minHorizontalSeats;
    const verticalSeats = Math.floor(Math.random() * (maxVerticalSeats - minVerticalSeats + 1)) + minVerticalSeats;

    const newSeatsMatrix = [];

    // Gera colunas "unavailable" com uma probabilidade de 10%
    const unavailableColumns = [];
    let lastUnavailableIndex = -1;

    while (unavailableColumns.length < maxUnavailableColumns) {
      const startIndex = lastUnavailableIndex + 3; // Garante pelo menos duas colunas entre cada "unavailable"
      const endIndex = Math.min(horizontalSeats - 1, startIndex + 1);

      const unavailableIndex = Math.floor(Math.random() * (endIndex - startIndex + 1)) + startIndex;
      unavailableColumns.push(unavailableIndex);
      lastUnavailableIndex = unavailableIndex;
    }

    for (let i = 0; i < verticalSeats; i++) {
      const row = [];

      for (let j = 0; j < horizontalSeats; j++) {
        // Verifica se a coluna atual é uma coluna "unavailable"
        const isUnavailableColumn = unavailableColumns.includes(j);

        // Evita que mais bancos sejam marcados como "unavailable"
        const isUnavailable = isUnavailableColumn && row.length < maxUnavailableSeats;

        if (isUnavailable) {
          row.push('unavailable');
        } else {
          row.push('banco');
        }
      }

      newSeatsMatrix.push(row);
    }
    cinemaSeats[selectedCinema] = newSeatsMatrix;

    setSeatsMatrix(newSeatsMatrix);
  };

  const beneficiosNOSList = [
    { title: "Vale Cinema", subtitle: "", paragraph: "Valida 1 código de cada vez.", id: "vcine" },
    { title: "WTF 2f ou 4f", paragraph: "", price: `€ ${6.25}`, id: "wtf" },
    { title: "Cartão NOS (1=2)", paragraph: "", price: `€ ${6.25}`, id: "cNOS" },
    { title: "Cartão NOS_Menu", paragraph: "", price: `€ ${6.25}`, id: "cNOSMenu" },
  ]

  const outrosBeneficiosList = [
    { title: "Bilhete 2 ou 4 feira", paragraph: "", price: `€ ${6.25}`, id: "b24f" },
    { title: "Senior", paragraph: "Idade igual ou superior a 65 anos", price: `€ ${6.35}`, id: "senior" },
    { title: "Criança até 10 anos", paragraph: "Idade igual ou inferior a 10 anos", price: `€ ${6.35}`, id: "c10anos" },
    { title: "Bilhete Família (2pax)", paragraph: "1 adulto + 1 criança até 12 anos", price: `€ ${10.50}`, id: "bfam" },
  ]

  const handleSwitchCity = (e) => {
    if (e.currentTarget.className != "cidade-active") {
      const spans = document.querySelectorAll('#cidade');
      const selected = e.currentTarget;
      setSelectedCity(selected.textContent);
      setSelectedCinema(selectedMovie.salas.find((sala) => sala.Cidade === selected.textContent)?.Cinemas[0]?.Nome);
      spans.forEach((span) => {
        if (span == selected) {
          span.classList.add('cidade-active');
          span.classList.remove('cidade');
        }
        else {
          span.classList.add('cidade');
          span.classList.remove('cidade-active');
        }
      });
    }
    cinemaSeats[selectedCinema] = null;
  }

  const handleSwitchCinema = (e) => {
    setSelectedCinema(e.target.value);

    if (cinemaSeats[selectedCinema]) {
      setSeatsMatrix(cinemaSeats[selectedCinema]);
    } else {
      // Se não houver, gerar uma nova matriz
      generateSeatsMatrix();
    }
  };

  const handleNumeroPessoasSelect = (numPessoas) => {
    setSelectedNumeroPessoas(numPessoas);
  };

  const handleBancoSelect = (rowIndex, seatIndex) => {
    // Verifica se o banco já está selecionado
    const isBancoSelected = selectedBancos.some((banco) => banco.rowIndex === rowIndex && banco.seatIndex === seatIndex);

    if (isBancoSelected) {
      // Se o banco já estiver selecionado, remove-o da seleção
      const updatedBancos = selectedBancos.filter((banco) => !(banco.rowIndex === rowIndex && banco.seatIndex === seatIndex));
      setSelectedBancos(updatedBancos);
    } else {
      // Verifica se atingiu o número máximo de bancos permitidos
      if (selectedBancos.length < selectedNumeroPessoas) {
        // Adiciona o banco à seleção
        setSelectedBancos([...selectedBancos, { rowIndex, seatIndex }]);
      }
    }
  };

  const handleSwitchForm = (direction) => {
    setCurrentForm((prevForm) => {
      const formIndex = formsArray.indexOf(prevForm);

      // Circular para o próximo formulário
      const nextFormIndex = (formIndex + (direction === 'mais' ? 1 : maxForms - 1)) % maxForms;
      const nextForm = formsArray[nextFormIndex];

      // Atualizar o progresso
      const newProgress = nextFormIndex * (100 / maxForms);
      setCurrentProgress(newProgress);

      return nextForm;
    });
  };

  useEffect(() => {
    if (selectedMovie && selectedMovie.duration) {
      const sessions = calculateSessions(selectedMovie.duration);
      setMovieSessions(sessions);
    }
    if (cinemaSeats[selectedCinema]) {
      setSeatsMatrix(cinemaSeats[selectedCinema]);
    } else {
      // Se não houver, gerar uma nova matriz
      generateSeatsMatrix();
    }
  }, [selectedMovie, selectedCity, selectedCinema]);

  useEffect(() => {
    generateSeatsMatrix();
  }, []);

  useEffect(() => {
    calculateTotal();
  }, [selectedNumeroPessoas]);

  useEffect(() => {
    setActiveRoom(0);
    cinemaSeats[selectedCinema] = null;
  }, [selectedCity, selectedCinema]);

  return (
    <div id={`payment-window-main${openPaymentWindow ? '-active' : ''}`}>
      <div onClick={() => setOpenPaymentWindow(false)} id='pw-close-icon'><FontAwesomeIcon className='icon' icon={faClose} /></div>
      <div id='payment-window-content' style={{backgroundImage: `linear-gradient(to top, rgba(42, 42, 51, 0.52), rgba(117, 19, 93, 0.73)), url(https://image.tmdb.org/t/p/w500${selectedMovie.backdrop_path})`}}>
        <div id='movie-information'>
          <div id='movie-info-content'>
            <h3>{selectedMovie?.original_title}</h3>
            <span>{isAdult ? `M18 • ${selectedMovie.duration} Min` : `M16 • ${selectedMovie.duration} Min • Sala: `}</span>
          </div>
          <div id='current-date-time'>
            <span>{diaDaSemana}, {dia} de {mes} de {ano} <br /> {horas}:{minutos}h</span>
          </div>
        </div>
        <div id='movie-information-details'>
          <hr />
          <div id='cidades'>
            {selectedMovie.salas.map((sala, index) => (
              <div className={`cidades-content${sala.Cidade === selectedCity ? '-active' : ''}`} onClick={(e) => handleSwitchCity(e)}>
                <span
                  key={index}
                  id='cidade'>{sala.Cidade}</span>
              </div>
            ))}
          </div>
          <div id='cinemas-by-city-main'>
            {selectedMovie.salas?.filter((sala) => sala.Cidade === selectedCity).map((sala, index) => (
              <div key={index} id='cinema-selection-box'>
                <span>Cinema: </span>
                <select value={selectedCinema} onChange={handleSwitchCinema}>
                  {sala.Cinemas.map((cinema, index) => (
                    <option key={index} value={cinema.Nome}>
                      {cinema.Nome}
                    </option>
                  ))}
                </select>
              </div>
            ))}
            <div id='movie-sessions'>
              <span>Sessões: </span>
              <select>
                {movieSessions.map((session, index) => {
                  const [sessionHour, sessionMinute] = session.split(':').map(Number);
                  const currentTime = new Date();
                  const currentHour = currentTime.getHours();
                  const currentMinute = currentTime.getMinutes();
                  const isSessionActive = currentHour < sessionHour || (currentHour === sessionHour && currentMinute <= sessionMinute);
                  return (
                    <option key={index} disabled={!isSessionActive}>
                      {session}
                    </option>
                  );
                })}
              </select>
            </div>

          </div>
          <div id='payment-information'>
            <div id='progress-bar'>
              <div className="progress-bar-border">
                <div className="progress-bar-fill" style={{ width: `${currentProgress}%` }}></div>
              </div>
            </div>

            <form>
              <div id='form1' style={{ display: currentForm === 'form1' ? 'block' : 'none' }}>
                <div id='numero-pessoas'>
                  <h3>Quantas pessoas?</h3>
                  <hr />
                  <ul>
                    {[1, 2, 3, 4, 5, 6].map((num, index) => (
                      <li
                        key={index}
                        onClick={() => handleNumeroPessoasSelect(num)}
                        className={`pessoa ${num === selectedNumeroPessoas ? 'active' : ''}`}
                      >
                        {num}
                      </li>
                    ))}
                  </ul>
                </div>
                <div id='escolha-bancos-main'>
                  <div id='escolha-bancos-content'>
                    <h3>Escolha os bancos</h3>
                    <span>Bancos preenchidos: {selectedBancos.length}</span>
                    <hr />
                    <div id='escolha-bancos-container'>
                      <div id='movie-screen'></div>
                      {seatsMatrix.map((row, rowIndex) => (
                        <div key={rowIndex} className='seat-row'>
                          {row.map((seat, seatIndex) => (
                            <div
                              key={seatIndex}
                              onClick={() => handleBancoSelect(rowIndex, seatIndex)}
                              className={`banco ${seat} ${selectedBancos.some((banco) => banco.rowIndex === rowIndex && banco.seatIndex === seatIndex) ? 'active' : ''}`}
                              id={`banco-${rowIndex}-${seatIndex}`}
                            ></div>
                          ))}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
              <div id='form2' style={{ display: currentForm === 'form2' ? 'block' : 'none' }}>
                <div id='beneficios'>
                  <h3>Tem algum beneficio?</h3>
                  <hr />
                  <div id='beneficios-content'>
                    <div id='beneficios-list'>
                      <ul>
                        <span>Beneficios NOS
                        </span>
                        {beneficiosNOSList.map((beneficio, index) => (
                          <li key={index} className='beneficio'>
                            <Beneficio selectedNumeroPessoas={selectedNumeroPessoas} total={total} setTotal={setTotal} beneficio={beneficio} />
                          </li>
                        ))}
                      </ul>
                      <ul>
                        <span>Outros Beneficios
                        </span>
                        {outrosBeneficiosList.map((beneficio, index) => (
                          <li key={index} className='beneficio'>
                            <Beneficio selectedNumeroPessoas={selectedNumeroPessoas} total={total} setTotal={setTotal} beneficio={beneficio} />
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
              <div id='form3' style={{ display: currentForm === 'form3' ? 'block' : 'none' }}>
                <div id='menu-bar'>
                  <h3>Deseja algum artigo de bar?</h3>
                  <hr />
                  <div id='menu-bar-content'>
                    <ul id='menu-bar-list'>
                      <li id='menu'>
                        <h3>Menus</h3>
                        <div id='menus-list'>
                          <div className='menu'>
                            <h4>Menu Pipoca (Pipoca + Bebiba) <span onClick={() => setCheckBoxClicked(true)} id='checkbox'> <FontAwesomeIcon className='icon' icon={faCheck} style={{opacity: `${checkBoxClicked ? '1' : '0'}`}}/></span></h4>
                            <div id='menu-pipoca'>
                              <div className='menu-img'>
                                <img src={mPipocas}/>
                              </div>
                              <div className='menu-options'>
                                <label>Tamanho</label>
                                <select>
                                  <option value="pequeno">pequeno</option>
                                  <option value="medio">medio</option>
                                  <option value="grande">grande</option>
                                </select>
                                <label>Tipo</label>
                                <select>
                                  <option value="salgadas">salgadas</option>
                                  <option value="doces">doces</option>
                                  <option value="mistas">mistas</option>
                                </select>
                                <label>Bebida</label>
                                <select>
                                  <option value="coca-cola">coca-cola</option>
                                  <option value="coca-cola-zero">coca-cola zero</option>
                                  <option value="fanta-laranja">fanta laranja</option>
                                  <option value="spite">sprite</option>
                                  <option value="nestea-limão">nestea limão</option>
                                  <option value="nestea-pêssego">nestea pêssego</option>
                                </select>
                              </div>
                            </div>
                          </div>
                          <hr />
                          <div className='menu'>
                            <h4>Menu Box (Pipoca + Bebida (2x)) <span onClick={() => setCheckBoxClicked(true)} id='checkbox'> <FontAwesomeIcon className='icon' icon={faCheck} style={{opacity: `${checkBoxClicked ? '1' : '0'}`}}/></span></h4>
                            <div id='menu-box-container'>
                              <div id='menu-box'>
                                <div className='menu-img'>
                                  <img src={mBox}/>
                                </div>
                                <div className='menu-options'>
                                  <label>Tamanho</label>
                                  <select>
                                    <option value="pequeno">pequeno</option>
                                    <option value="medio">medio</option>
                                    <option value="grande">grande</option>
                                  </select>
                                  <label>Tipo</label>
                                  <select>
                                    <option value="salgadas">salgadas</option>
                                    <option value="doces">doces</option>
                                    <option value="mistas">mistas</option>
                                  </select>
                                </div>
                              </div>
                              <section>
                                <label>1º Bebida</label>
                                <select>
                                  <option value="coca-cola">coca-cola</option>
                                  <option value="coca-cola-zero">coca-cola zero</option>
                                  <option value="fanta-laranja">fanta laranja</option>
                                  <option value="spite">sprite</option>
                                  <option value="nestea-limão">nestea limão</option>
                                  <option value="nestea-pêssego">nestea pêssego</option>
                                </select>
                                <label>2º Bebida</label>
                                <select>
                                  <option value="coca-cola">coca-cola</option>
                                  <option value="coca-cola-zero">coca-cola zero</option>
                                  <option value="fanta-laranja">fanta laranja</option>
                                  <option value="spite">sprite</option>
                                  <option value="nestea-limão">nestea limão</option>
                                  <option value="nestea-pêssego">nestea pêssego</option>
                                </select>
                              </section>
                            </div>
                          </div>
                        </div>

                      </li>
                      {/* <li id='outros'>
                        <div>Pipocas</div>
                        <div>Bebidas</div>
                        <div>Snacks</div>
                      </li> */}
                    </ul>
                  </div>
                </div>
              </div>
            </form>

            <div id='total-navigation'>
              <h3>{`Total: € ${Number(total).toFixed(2)}`}</h3>
              <div className='form-buttons'>
                <button onClick={() => handleSwitchForm('menos')}>Menos</button>
                <button onClick={() => handleSwitchForm('mais')}>Mais</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PaymentWindow