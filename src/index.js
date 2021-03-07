import './styles/reset.css';
import './styles/main.css';
import PubSub from 'pubsub-js';
import formHandler from './app/formHandler';
import displayController from './app/displayController';

function init() {
  console.log('initialized');
  const button = document.getElementById('search-btn');
  button.addEventListener('click', formHandler.searchForm);
}

init();
