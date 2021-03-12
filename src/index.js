import './styles/reset.css';
import './styles/main.css';
import PubSub from 'pubsub-js';
import formHandler from './app/formHandler';
import displayController from './app/displayController';

function init() {
  console.log('initialized');
  const searchButton = document.getElementById('search-btn');
  searchButton.addEventListener('click', formHandler.searchForm);

  const switchButton = document.querySelector('#unit-selector .switch');
  // switchButton.addEventListener('click');
  formHandler.searchForm('', 'Zagreb'); // Remove after testing
}

init();
