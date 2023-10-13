import React, { useState, useEffect } from 'react'
import './PaymentWindow.scss'

import Beneficio from './Beneficio'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faClose } from '@fortawesome/free-solid-svg-icons'

import mBox from '../../Assets/Images/menu_box.png'
import mPipocas from '../../Assets/Images/menu_pipocas.png'
import pipocasIcon from '../../Assets/Images/popcorn_icon.png'
import pipocasIndiv from '../../Assets/Images/pipocas_individual.png'
import refrigerante from '../../Assets/Images/refrigerante.png'
import snacks from '../../Assets/Images/snacks.png'

function PaymentWindow({ openPaymentWindow, setOpenPaymentWindow, selectedMovie, isAdult }) {
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

  const [sizeOptionActive, setSizeOptionActive] = useState(true);
  const [sizeSelection, setSizeSelection] = useState("");

  //* LISTS
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

  //* FUNCTIONS
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

  const calculateTotal = (selectedValue) => {
    const bilhetePorPessoa = 6.35;
    const totalBilhetes = selectedNumeroPessoas * bilhetePorPessoa;
    let additionalTotal = 0;

    if(selectedValue){
      const priceValue = extractNumberFromString(selectedValue);
      additionalTotal = priceValue;
    } else {
      // Busca todos os elementos com o id "price"
      const priceElements = document.querySelectorAll('#price');

      // Soma os valores extraídos ao total apenas se o elemento estiver selecionado
      priceElements.forEach((element) => {
        // Verifica se o elemento pai (option ou img) tem a classe 'active'
        const isSelected = element.classList.contains('active');
        if (isSelected) {
          element.classList.remove('active');
          const priceString = element.textContent; // Obtém o texto dentro do elemento
          const priceValue = extractNumberFromString(priceString); // Converte para número
          additionalTotal += priceValue;
        }
      });
    }
    // Adiciona o valor adicional ao total
    const finalTotal = totalBilhetes + additionalTotal;

    setTotal(finalTotal);
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

  const handleSizeSelection = (spanId) => {
    setSizeSelection(spanId);
    const element = document.querySelector(`#${spanId}`);
    element.classList.add("active");
    handleMenuSelection(element);
    calculateTotal();
  }

  const handleMenuSelection = (e) => {
    document.querySelectorAll('.menu').forEach(menu => menu.classList.remove("active"));
    if(e.currentTarget){
      e.currentTarget.closest('.menu').classList.add("active")
      e.currentTarget.querySelector("#price")?.classList.add("active");
    } else {
      e.closest('.menu').classList.add("active");
    }
    e.target ? calculateTotal(e.target.value) : calculateTotal();
  }

  const handleDrinkSelect = (e) => {
    if (e.currentTarget.value === "agua") setSizeOptionActive(false);
  }

  const handleClearMenus = (e) => {
    e.preventDefault();
    document.querySelectorAll(".menu").forEach(menu => menu.classList?.remove("active"));
    document.querySelectorAll("#price,.icon.active").forEach(item => item.classList.remove("active"));
    calculateTotal();
  }

  const extractNumberFromString = (str) => {
    if(str){
      const cleanStr = str.replace('(', '').replace(')', '').replace('€', '').replace(',', '.');
      // Converte a string para número
      const number = parseFloat(cleanStr.replace(/[^0-9.]/g, ''));
      return number;
    }
    return;
  };

  //* USE EFFECTS
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
  }, [selectedNumeroPessoas, sizeSelection]);

  useEffect(() => {
    setActiveRoom(0);
    cinemaSeats[selectedCinema] = null;
  }, [selectedCity, selectedCinema]);

  return (
    <div id={`payment-window-main${openPaymentWindow ? '-active' : ''}`}>
      <div onClick={() => setOpenPaymentWindow(false)} id='pw-close-icon'><FontAwesomeIcon className='icon' icon={faClose} /></div>
      <div id='payment-window-container' style={{ backgroundImage: `url(https://image.tmdb.org/t/p/w500${selectedMovie.backdrop_path})` }}>
        <div id='payment-window-content' >
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
            <div id='cidades'>
              {selectedMovie.salas.map((sala, index) => (
                <div key={index} className={`cidades-content${sala.Cidade === selectedCity ? '-active' : ''}`} onClick={(e) => handleSwitchCity(e)}>
                  <span
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
                              <h4>Menu Pipoca (Pipoca + Bebiba)</h4>
                              <div id='menu-pipoca'>
                                <div className='icon-size-container'>
                                  <span id='sm'
                                    className={`icon ${sizeSelection === 'sm' ? 'active' : ''}`}
                                    onClick={() => handleSizeSelection('sm')}>
                                    <img className='icon' id='ism' src={pipocasIcon} /><label>S <span className={sizeSelection === 'sm' ? 'active' : ''} id='price'>(€6,00)</span></label></span>
                                  <span id='m'
                                    className={`icon ${sizeSelection === 'm' ? 'active' : ''}`}
                                    onClick={() => handleSizeSelection('m')}>
                                    <img className='icon' id='im' src={pipocasIcon} /><label>M <span  className={sizeSelection === 'm' ? 'active' : ''} id='price'>(€6,50)</span></label></span>
                                  <span id='l'
                                    className={`icon ${sizeSelection === 'l' ? 'active' : ''}`}
                                    onClick={() => handleSizeSelection('l')}>
                                    <img className='icon' id='il' src={pipocasIcon} /><label>L <span  className={sizeSelection === 'l' ? 'active' : ''} id='price'>(€7,15)</span></label></span>
                                </div>
                                <div className='menu-details'>
                                  <div className='menu-img'>
                                    <img src={mPipocas} />
                                  </div>
                                  <div className='menu-options'>
                                    <label>Tipo</label>
                                    <select onChange={handleMenuSelection}>
                                      <option value="salgadas">salgadas</option>
                                      <option value="doces">doces</option>
                                      <option value="mistas">mistas</option>
                                    </select>
                                    <label>Bebida</label>
                                    <select onChange={handleMenuSelection}>
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
                            </div>
                            <hr />
                            <div className='menu'>
                              <h4>Menu Box (Pipoca + Bebida (2x))</h4>
                              <div id='menu-box-container'>
                                <div className='icon-size-container'>
                                  <span><img className='icon' id='u' src={pipocasIcon} /><label>Único (€7,90)</label></span>
                                </div>
                                <label>Tipo</label>
                                <select onChange={handleMenuSelection}>
                                  <option value="salgadas">salgadas</option>
                                  <option value="doces">doces</option>
                                  <option value="mistas">mistas</option>
                                </select>
                                <div id='menu-box'>
                                  <div className='menu-img'>
                                    <img src={mBox} />
                                  </div>
                                  <div className='menu-options'>
                                    <label>1º Bebida</label>
                                    <select onChange={handleMenuSelection}>
                                      <option value="coca-cola">coca-cola</option>
                                      <option value="coca-cola-zero">coca-cola zero</option>
                                      <option value="fanta-laranja">fanta laranja</option>
                                      <option value="spite">sprite</option>
                                      <option value="nestea-limão">nestea limão</option>
                                      <option value="nestea-pêssego">nestea pêssego</option>
                                    </select>
                                    <label>2º Bebida</label>
                                    <select onChange={handleMenuSelection}>
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
                            </div>
                          </div>
                        </li>
                        <li id='individuais'>
                          <h3>Individuais</h3>
                          <ul className='indiv-menus'>
                            <li>
                              <div className='menu'>
                                <h4>Pipocas</h4>
                                <div>
                                  <span>
                                    <img src={pipocasIndiv} />
                                  </span>
                                  <div className='menu-indiv-options'>
                                    <label>Tipo</label>
                                    <select onChange={handleMenuSelection}>
                                      <option value="salgadas">salgadas</option>
                                      <option value="doces">doces</option>
                                      <option value="mistas">mistas</option>
                                    </select>
                                    <label>Tamanho</label>
                                    <select onChange={handleMenuSelection}>
                                      <option id='price' value='pequena (€3,60)'>pequena (€3,60)</option>
                                      <option id='price' value='media (€3,90)'>média (€3,90)</option>
                                      <option id='price' value='grande (€4,10)'>grande (€4,10)</option>
                                    </select>
                                  </div>
                                </div>
                              </div>
                            </li>
                            <li>
                              <div className='menu'>
                                <h4>Bebidas</h4>
                                <div>
                                  <span>
                                    <img src={refrigerante} />
                                  </span>
                                  <div className='menu-indiv-options'>
                                    <label>Bebida</label>
                                    <select onChange={handleMenuSelection}>
                                      <option id='price' value="agua (€1,50)">água (€1,50)</option>
                                      <option value="coca-cola">coca-cola</option>
                                      <option value="coca-cola-zero">coca-cola zero</option>
                                      <option value="fanta-laranja">fanta laranja</option>
                                      <option value="spite">sprite</option>
                                      <option value="nestea-limão">nestea limão</option>
                                      <option value="nestea-pêssego">nestea pêssego</option>
                                      <option id='price' value="monster-mango (€3,00)">monster mango (€3,00)</option>
                                      <option id='price' value="monster-energy (€3,00)">monster energy (€3,00)</option>
                                      <option id='price' value="monster-ultra (€3,00)">monster ultra (€3,00)</option>
                                    </select>
                                    <label>Tamanho</label>
                                    <select className={`${sizeOptionActive ? 'active' : ''}`} onChange={handleMenuSelection}>
                                      <option id='price' value='pequena (€2,75)'>pequena (€2,75)</option>
                                      <option id='price' value='media (€3,00)'>média (€3,00)</option>
                                      <option id='price' value='grande (€3,25)'>grande (€3,25)</option>
                                    </select>
                                  </div>
                                </div>
                              </div>
                            </li>
                            <li>
                              <div className='menu'>
                                <h4>Snacks</h4>
                                <div>
                                  <span>
                                    <img src={snacks} />
                                  </span>
                                  <div className='menu-indiv-options'>
                                    <label>Tipo de toping</label>
                                    <select onChange={handleMenuSelection.bind(this)}>
                                      <option id='price' value="chocolate (€1,00)">chocolate (€1,00)</option>
                                      <option value="amendoim (€1,00)">amendoim (€1,00)</option>
                                    </select>
                                  </div>
                                </div>
                              </div>
                            </li>
                          </ul>
                        </li>
                      </ul>
                      <span className='clearButton'><button className='button' onClick={handleClearMenus}>Limpar</button></span>
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
    </div>
  )
}

export default PaymentWindow