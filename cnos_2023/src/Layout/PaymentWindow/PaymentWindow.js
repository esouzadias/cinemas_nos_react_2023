import React, { useState, useEffect } from 'react'
import './PaymentWindow.scss'

import Beneficio from './Beneficio'
import SelectBancos from './SelectBancos';

import PhoneInput from 'react-phone-number-input';
import 'react-phone-number-input/style.css';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faClose } from '@fortawesome/free-solid-svg-icons'

import mBox from '../../Assets/Images/menu_box.png'
import mPipocas from '../../Assets/Images/menu_pipocas.png'
import pipocasIcon from '../../Assets/Images/popcorn_icon.png'
import pipocasIndiv from '../../Assets/Images/pipocas_individual.png'
import refrigerante from '../../Assets/Images/refrigerante.png'
import snacks from '../../Assets/Images/snacks.png'
import visa from '../../Assets/Images/visa-logo.png'
import mastercard from '../../Assets/Images/Mastercard-logo.png'
import mbway from '../../Assets/Images/mbway-logo.png'
import paypal from '../../Assets/Images/PayPal-logo.png'

function PaymentWindow({ openPaymentWindow, setOpenPaymentWindow, selectedMovie, isAdult }) {
  //Informações do filme
  const data = new Date();
  const diasDaSemana = ['Domingo', 'segunda-feira', 'terça-feira', 'quarta-feira', 'quinta-feira', 'sexta-feira', 'Sábado'];
  const diaDaSemana = diasDaSemana[data.getDay()];
  const dia = data.getDate();
  const meses = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];
  const mes = meses[data.getMonth()];
  const ano = data.getFullYear();
  const horas = data.getHours();
  const minutos = data.getMinutes();
  const [selectedCity, setSelectedCity] = useState(selectedMovie?.salas[0]?.Cidade);
  const [selectedCinema, setSelectedCinema] = useState(selectedMovie?.salas[0]?.Cinemas[0]?.Nome);
  const [movieSessions, setMovieSessions] = useState([]);

  //Matriz dos bancos de cada cinema
  const [selectedNumeroPessoas, setSelectedNumeroPessoas] = useState(2);
  const [selectedBancos, setSelectedBancos] = useState([]);

  //Variáveis auxiliares
  const maxForms = 5;
  const formsArray = Array.from({ length: maxForms }, (_, index) => `form${index + 1}`);
  const [form1Error, setForm1Error] = useState('');
  const [form4Error, setForm4Error] = useState('');
  const [currentForm, setCurrentForm] = useState(formsArray[0]);
  const [currentProgress, setCurrentProgress] = useState(10);
  const [total, setTotal] = useState("6,35");

  //Produtos de bar
  const [sizeOptionActive, setSizeOptionActive] = useState(true);
  const [sizeSelection, setSizeSelection] = useState("");
  const [barProductsSelected, setBarProductsSelected] = useState(false);
  const [barProductSelected, setBarProductSelected] = useState(null);

  //Metodo de pagamento
  const [phoneValue, setPhoneValue] = useState('');
  const [isBillingVisible, setBillingVisible] = useState(false);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('');
  const [creditCardInfo, setCreditCardInfo] = useState({
    nome: '',
    numeroCartao: '',
    dataValidade: '',
    codigoSeguranca: ''
  });
  const [mbWayInfo, setMbWayInfo] = useState({
    numeroTelemovel: ''
  });

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
  //Informações Iniciais
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
  }

  const handleSwitchCinema = (e) => {
    setSelectedCinema(e.target.value);
  };

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

  //Selecionar Bancos
  const handleNumeroPessoasSelect = (numPessoas) => {
    setSelectedNumeroPessoas(numPessoas);
  };

  //Form3 - Produtos de bar
  const handleSizeSelection = (spanId) => {
    setSizeSelection(spanId);
    const element = document.querySelector(`#${spanId}`);
    element.classList.add("active");
    handleMenuSelection(element);
    calculateTotal();
  }

  const handleMenuSelection = (e) => {
    document.querySelectorAll('.menu').forEach(menu => menu.classList.remove("active"));
    if (e.currentTarget) {
      e.currentTarget.closest('.menu').classList.add("active")
      e.currentTarget.querySelector("#price")?.classList.add("active");
    } else {
      e.closest('.menu').classList.add("active");
    }
    setBarProductsSelected(e.currentTarget?.closest('.menu-bar-list') !== null || e.currentTarget?.closest('.menu-indiv-options') !== null);
    e.target ? calculateTotal(e.target.value) : calculateTotal();
  }

  const handleClearMenus = (e) => {
    e.preventDefault();
    document.querySelectorAll(".menu").forEach(menu => menu.classList?.remove("active"));
    document.querySelectorAll("#price,.icon.active").forEach(item => item.classList.remove("active"));
    calculateTotal();
  }

  //Form4 - Metodo de pagamento
  const handleToggleChange = () => {
    setBillingVisible(!isBillingVisible);
  };

  const handlePaymentMethodClick = (method, e) => {
    setSelectedPaymentMethod(method);
    document.querySelectorAll(".payMethod").forEach(method => method.classList.remove("active"));
    document.getElementById(method).classList.add("active");
  };

  const handleCreditCardChange = (event) => {
    const { name, value } = event.target;
    setCreditCardInfo({
      ...creditCardInfo,
      [name]: value
    });
  };

  const handleMbWayChange = (value) => {
    setMbWayInfo({
      numeroTelemovel: value
    });
  };

  //Métodos Auxiliares
  const extractNumberFromString = (str) => {
    if (str) {
      const cleanStr = str.replace('(', '').replace(')', '').replace('€', '').replace(',', '.');
      // Converte a string para número
      const number = parseFloat(cleanStr.replace(/[^0-9.]/g, ''));
      return number;
    }
    return;
  };

  const calculateTotal = (selectedValue) => {
    let bilhetePorPessoa = 6.35;
    const menuBox = document.querySelector('.menu.active')?.querySelector("#menu-box");
    const menuPipoca = document.querySelector('.menu.active')?.querySelector("#menu-pipoca");
    if(menuBox) bilhetePorPessoa = 7.90;
    else bilhetePorPessoa = 6.35;
    const totalBilhetes = selectedNumeroPessoas * bilhetePorPessoa;
    let additionalTotal = 0;

    if (selectedValue) {
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
    const finalTotal = totalBilhetes + (additionalTotal ? additionalTotal : 0);

    setTotal(finalTotal);
  };

  const validateForm1 = () => {
    if (selectedBancos.length < selectedNumeroPessoas) {
      setForm1Error('Todos os bancos têm de ser preenchidos antes de avançar.');
      return false;
    }
    setForm1Error('');
    return true;
  };

  const validateForm4 = () => {
    if (!selectedPaymentMethod) {
      setForm4Error('Selecione um método de pagamento antes de avançar.');
      return false;
    }

    if (selectedPaymentMethod === 'credito') {
      // Validar informações do cartão de crédito
      if (!creditCardInfo.nome || !creditCardInfo.numeroCartao || !creditCardInfo.dataValidade || !creditCardInfo.codigoSeguranca) {
        setForm4Error('Preencha corretamente as informações do cartão de crédito.');
        return false;
      }
    }

    if (selectedPaymentMethod === 'mb-way') {
      // Validar informações do MB Way
      if (!mbWayInfo.numeroTelemovel) {
        setForm4Error('Preencha corretamente as informações do MB Way.');
        return false;
      }
    }

    setForm4Error('');
    return true;
  };

  const handleSwitchForm = (direction) => {
    if (currentForm === 'form1' && !validateForm1()) {
      return;
    }

    if (currentForm === 'form3' && !barProductsSelected) {
      const confirmMessage = "Você não selecionou nenhum produto de bar. Tem certeza de que deseja avançar?";
      // Cancela a mudança de formulário se o user optar por não avançar
      if (!window.confirm(confirmMessage)) {
        return;
      }
    }

    if (currentForm === 'form4' && !validateForm4()) {
      return;
    }

    setCurrentForm((prevForm) => {
      const formIndex = formsArray.indexOf(prevForm);

      // Circular para o próximo formulário
      const nextFormIndex = (formIndex + (direction === 'mais' ? 1 : maxForms - 1)) % maxForms;
      const nextForm = formsArray[nextFormIndex];

      // Atualizar o progresso
      const newProgress = currentForm === 'form5' ? 100 : nextFormIndex * (100 / maxForms);
      setCurrentProgress(newProgress);

      return nextForm;
    });
  };

  const handleClosePaymentWindow = () => {
    setOpenPaymentWindow(false);
    document.querySelector('body').style.overflow = 'auto';
  }

  //* USE EFFECTS
  //Informação do filme
  useEffect(() => {
    if (selectedMovie && selectedMovie.duration) {
      const sessions = calculateSessions(selectedMovie.duration);
      setMovieSessions(sessions);
    }
  }, [selectedMovie, selectedCity, selectedCinema]);

  useEffect(() => {
    setBarProductSelected(document.querySelectorAll(".menu").forEach(menu => menu.classList.contains("active")));
    document.querySelector('body').style.overflow = 'hidden';
  }, []);

  //Calculo final
  useEffect(() => {
    calculateTotal();
  }, [selectedNumeroPessoas, sizeSelection]);

  return (
    <div id={`payment-window-main${openPaymentWindow ? '-active' : ''}`}>
      <div onClick={handleClosePaymentWindow} id='pw-close-icon'><FontAwesomeIcon className='icon' icon={faClose} /></div>
      <div id='payment-window-container' style={{ backgroundImage: `url(https://image.tmdb.org/t/p/w500${selectedMovie?.backdrop_path})` }}>
        <div id='payment-window-content' >
          <div id='movie-information'>
            <div id='movie-info-content'>
              <h3>{selectedMovie?.original_title}</h3>
              <span>{isAdult ? `M18 • ${selectedMovie?.duration} Min` : `M16 • ${selectedMovie?.duration} Min • Sala: `}</span>
            </div>
            <div id='current-date-time'>
              <span>{diaDaSemana}, {dia} de {mes} de {ano} <br /> {horas}:{minutos}h</span>
            </div>
          </div>
          <div id='movie-information-details'>
            <div id='cidades'>
              {selectedMovie?.salas.map((sala, index) => (
                <div key={index} className={`cidades-content${sala.Cidade === selectedCity ? '-active' : ''}`} onClick={(e) => handleSwitchCity(e)}>
                  <span
                    id='cidade'>{sala.Cidade}</span>
                </div>
              ))}
            </div>
            <div id='cinemas-by-city-main'>
              {selectedMovie?.salas?.filter((sala) => sala.Cidade === selectedCity).map((sala, index) => (
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
              <div>
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
                      {<span>Bancos preenchidos: {selectedBancos.length}</span>}
                      <hr />
                      <div id='escolha-bancos-container'>
                        <div id='movie-screen'></div>
                        <SelectBancos selectedNumeroPessoas={selectedNumeroPessoas} setSelectedBancos={setSelectedBancos} />
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
                                    <img className='icon' id='im' src={pipocasIcon} /><label>M <span className={sizeSelection === 'm' ? 'active' : ''} id='price'>(€6,50)</span></label></span>
                                  <span id='l'
                                    className={`icon ${sizeSelection === 'l' ? 'active' : ''}`}
                                    onClick={() => handleSizeSelection('l')}>
                                    <img className='icon' id='il' src={pipocasIcon} /><label>L <span className={sizeSelection === 'l' ? 'active' : ''} id='price'>(€7,15)</span></label></span>
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
                <div id='form4' style={{ display: currentForm === 'form4' ? 'block' : 'none' }}>
                  <div id='form-data'>
                    <h3>Podemos finalizar a compra?</h3>
                    <hr />
                    <div id='form-data-content'>
                      <div className='form-fill'>
                        <h4>Introduza os seus dados pessoais:</h4>
                        <form>
                          <input type='text' placeholder='Nome*'></input>
                          <PhoneInput
                            placeholder='Nº de Telemóvel*'
                            value={phoneValue}
                            onChange={setPhoneValue}
                            defaultCountry='PT'
                          />
                          <input type='email' placeholder='email (onde irá receber os bilhetes)'></input>
                          <input type='email' placeholder='Confirme o email'></input>
                          <div className='toggle-container'>
                            <input type="checkbox" id="toggle" checked={isBillingVisible} onChange={handleToggleChange} />
                            <label htmlFor="toggle"></label>
                          </div>
                          {isBillingVisible && (
                            <div className='form-billing'>
                              <input type='text' placeholder='Nome'></input>
                              <input type='number' placeholder='Nº de Contribuinte*'></input>
                              <input type='text' placeholder='Morada'></input>
                              <input type='text' placeholder='Localidade'></input>
                              <input type='text' pattern="^\s*?\d{5}(?:[-\s]\d{4})?\s*?$" placeholder='Código postal'></input>
                              <p>A fatura será enviada para o e-mail</p>
                            </div>
                          )}
                        </form>
                      </div>
                      <div className='form-info'>
                        <p>
                          Todos os campos assinalados com * são de preenchimento obrigatório. <br />
                          <br />
                          Não se efetuam trocas ou devoluções de bilhetes de cinema, nos termos legais em vigor de acordo com o art.17º, n.º1 k) do DL n.º24/2014, de 14 de Fevereiro. <br /><br />

                          O espetáculo inicia-se alguns minutos após o horário de sessão.<br /><br />

                          Para sessões 3D, no caso de não ter óculos 3D, terá de os comprar aquando do levantamento dos bilhetes.<br /><br />

                          Existe uma Taxa de Serviço associado ao Lugar Vip.<br /><br />

                          A compra de bilhetes com cartão NOS não abrange os suplementos das Salas Vip, upgrade 3D e óculos 3D. O levantamento da fatura é efetuado juntamente com os respetivos bilhetes.
                        </p>
                      </div>
                    </div>
                    <div className='metodo-pagamento'>
                      <h4>Método de pagamento</h4>
                      <ul>
                        <li id='credito' className='payMethod' onClick={() => handlePaymentMethodClick('credito')}> <div className='payCard'><h3>Crédito</h3> <span><img src={visa} /><img src={mastercard} /></span></div>
                          {selectedPaymentMethod === 'credito' && (
                            <div className='credInfo'>
                              <input type='text' name='nome' placeholder='Nome' value={creditCardInfo.nome} onChange={handleCreditCardChange} />
                              <input type='number' name='numeroCartao' placeholder='Nº de Cartão de Crédito' value={creditCardInfo.numeroCartao} onChange={handleCreditCardChange} />
                              <input type='date' name='dataValidade' placeholder='Data de Validade' value={creditCardInfo.dataValidade} onChange={handleCreditCardChange} />
                              <input type='number' name='codigoSeguranca' placeholder='Código de 3 dígitos' value={creditCardInfo.codigoSeguranca} onChange={handleCreditCardChange} />
                            </div>
                          )}
                        </li>
                        <li id='mb-way' className='payMethod' onClick={() => handlePaymentMethodClick('mb-way')}>
                          <div className='payCard'><h3>MB Way</h3><img src={mbway} /></div>
                          {selectedPaymentMethod === 'mb-way' && (
                            <PhoneInput
                              placeholder='Nº de Telemóvel*'
                              value={mbWayInfo.numeroTelemovel}
                              onChange={handleMbWayChange}
                              defaultCountry='PT'
                            />
                          )}
                        </li>
                        <li id='paypal' className='payMethod' onClick={() => handlePaymentMethodClick('paypal')}>
                          <div className='payCard'><h3>Paypal</h3><img src={paypal} /></div>
                        </li>
                        <div className='error-message-container'>
                          {form4Error && <div className="error-message">{form4Error}</div>}
                        </div>
                      </ul>
                    </div>

                  </div>
                </div>
                <div id='form5' style={{ display: currentForm === 'form5' ? 'block' : 'none' }}>
                  <div id='final-form'>
                    <h3>Confirme of seus dados</h3>
                    <hr />
                    <div id='final-form-content'>
                      <ul>
                        <li>
                          <h4>Informações do Form 1:</h4>
                          <hr />
                          <p>Número de Pessoas: {selectedNumeroPessoas}</p>
                          <p>Bancos Selecionados:</p>
                          <ul>
                            {selectedBancos.map((banco, index) => (
                              <li key={index}>
                                Célula: {banco.cellId}
                              </li>
                            ))}
                          </ul>
                        </li>
                        <li>
                          <h4>Informações do Form 2:</h4>
                          <hr />
                          <p>Benefícios NOS Selecionados:</p>
                          <ul>
                            {beneficiosNOSList.map((beneficio, index) => (
                              <li key={index}>{/* Renderizar informações do benefício aqui */}</li>
                            ))}
                          </ul>
                          <p>Outros Benefícios Selecionados:</p>
                          <ul>
                            {outrosBeneficiosList.map((beneficio, index) => (
                              <li key={index}>{/* Renderizar informações do benefício aqui */}</li>
                            ))}
                          </ul>
                        </li>
                        <li>
                          <h4>Informações do Form 3:</h4>
                          <hr />
                          <p>Produto de Bar Selecionado: {barProductSelected}</p>
                        </li>
                        <li>
                          <h4>Informações do Form 4:</h4>
                          <p>Método de Pagamento Selecionado: {selectedPaymentMethod}</p>
                          {selectedPaymentMethod === 'credito' && (
                            <div>
                              <p>Informações do Cartão de Crédito:</p>
                              <p>Nome: {creditCardInfo.nome}</p>
                              <p>Número do Cartão: {creditCardInfo.numeroCartao}</p>
                              <p>Data de Validade: {creditCardInfo.dataValidade}</p>
                              <p>Código de Segurança: {creditCardInfo.codigoSeguranca}</p>
                            </div>
                          )}
                          {selectedPaymentMethod === 'mb-way' && (
                            <div>
                              <p>Informações do MB Way:</p>
                              <p>Número de Telemóvel: {mbWayInfo.numeroTelemovel}</p>
                            </div>
                          )}
                        </li>
                      </ul>
                      <button onClick={handleClosePaymentWindow} className='button'>Confirmar</button>
                    </div>
                  </div>
                </div>
              </div>

              <div id='total-navigation'>
                <h3>{`Total: € ${Number(total).toFixed(2)}`}</h3>
                <div className='form-buttons'>
                  {currentForm === 'form1' && (
                    <div className='error-message-container'>
                      {form1Error && <div className="error-message">{form1Error}</div>}
                    </div>
                  )}
                  {currentForm != 'form1' ? (
                    <button onClick={() => handleSwitchForm('menos')}>Menos</button>
                  ) : <></>}
                  {currentForm != 'form5' && (
                    <button onClick={() => handleSwitchForm('mais')}>Mais</button>
                  )}
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