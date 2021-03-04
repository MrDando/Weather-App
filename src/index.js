import './styles/reset.css';
import './styles/main.css';
import getWeather from './app/weather';
import getLocations from './app/geocoding';

const domHandler = (function domHandler() {
  const body = document.querySelector('body');

  function getElement(selector) {
    const element = body.querySelector(selector);
    return element;
  }

  function addClickEventToButton(selector, callback) {
    const button = body.querySelector(selector);
    button.addEventListener('click', callback);
  }

  return { getElement, addClickEventToButton };
}());

const formHandler = (function formHandler() {
  function validateForm(query) {
    if (query === '') {
      alert('Please enter a city name');
    }
  }

  function searchCityForm() {
    const input = domHandler.getElement('#search-input').value;
    validateForm(input);
  }

  return { searchCityForm };
}());

function init() {
  console.log('initialized');
  domHandler.addClickEventToButton('#search-btn', formHandler.searchCityForm);
}

init();
