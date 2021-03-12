import './styles/reset.css';
import './styles/main.css';
import PubSub from 'pubsub-js';
import formHandler from './app/formHandler';
import displayController from './app/displayController';

async function getIPLocation() {
  const url = 'https://ipapi.co/json/';

  const response = await fetch(url, {
    mode: 'cors',
  });
  const data = await response.json();

  const { city } = data;
  const { latitude } = data;
  const { longitude } = data;
  formHandler.requestWeather(latitude, longitude, city);
}

function init() {
  console.log('initialized');
  const searchButton = document.getElementById('search-btn');
  searchButton.addEventListener('click', formHandler.searchForm);

  const switchButton = document.getElementById('switch-span');
  switchButton.addEventListener('click', formHandler.switchUnits);

  getIPLocation();
}

init();
