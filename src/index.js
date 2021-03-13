import './styles/reset.css';
import './styles/main.css';
import PubSub from 'pubsub-js';
import formHandler from './app/formHandler';
import displayController from './app/displayController';
import getIPLocation from './app/IPlookup';

function init() {
  console.log('initialized');
  const searchForm = document.querySelector('#search-wrapper form');
  searchForm.addEventListener('submit', formHandler.searchForm);

  const switchButton = document.getElementById('switch-span');
  switchButton.addEventListener('click', formHandler.switchUnits);

  getIPLocation();
}

init();
