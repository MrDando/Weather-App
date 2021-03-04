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
      return false;
    }
    return true;
  }

  const displayController = (function displayController() {
    function renderSearch(results) {
      const container = domHandler.getElement('#search-results');
      container.innerText = '';
      for (let i = 0; i < results.length; i += 1) {
        const result = document.createElement('div');
        result.setAttribute('data-id', `${i}`);
        result.innerText = results[i].formatted;
        container.appendChild(result);
      }
    }

    return { renderSearch };
  }());

  async function searchCityForm() {
    const input = domHandler.getElement('#search-input').value;
    const valid = validateForm(input);
    if (valid) {
      const locations = await getLocations(input);
      displayController.renderSearch(locations);
    }
  }

  return { searchCityForm };
}());

function init() {
  console.log('initialized');
  domHandler.addClickEventToButton('#search-btn', formHandler.searchCityForm);
}

init();
