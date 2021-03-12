import './styles/reset.css';
import './styles/main.css';
import PubSub from 'pubsub-js';
import formHandler from './app/formHandler';
import displayController from './app/displayController';
import getIPLocation from './app/IPlookup';

function init() {
  console.log('initialized');
  const searchButton = document.getElementById('search-btn');
  searchButton.addEventListener('click', formHandler.searchForm);

  const switchButton = document.getElementById('switch-span');
  switchButton.addEventListener('click', formHandler.switchUnits);

  getIPLocation();
}

init();
