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

  function addClickEventToElement(selector, callback) {
    const button = body.querySelector(selector);
    button.addEventListener('click', callback);
  }

  return { getElement, addClickEventToElement };
}());

const displayController = (function displayController() {
  function renderSearch(results) {
    const container = domHandler.getElement('#search-results');
    container.innerText = '';
    console.log(results); // for testing

    function formatResult(result) {
      const resultElement = document.createElement('div');
      resultElement.setAttribute('data-id', results.indexOf(result));
      resultElement.classList.add('result');
      resultElement.addEventListener('click', formHandler.selectLocation);

      const topDivElement = document.createElement('div');
      const bottomDivElement = document.createElement('div');
      topDivElement.classList.add('top');
      bottomDivElement.classList.add('bottom');
      const nameElement = document.createElement('h3');
      const typeElement = document.createElement('p');
      const descriptionElement = document.createElement('p');

      function getName() {
        const types = ['city', 'town', 'village', 'hamlet'];
        let locationName;
        types.forEach((type) => {
          if (result.components.hasOwnProperty(type)) {
            locationName = result.components[type];
          }
        });
        return locationName;
      }

      function getDescription() {
        let description;
        const { county } = result.components;
        const { state } = result.components;
        const country = result.components['ISO_3166-1_alpha-3'];

        if (county && state && country) {
          description = `${county}, ${state}, ${country}`;
        } else if (county && country) {
          description = `${county}, ${country}`;
        } else if (state && country) {
          description = `${state}, ${country}`;
        } else {
          description = country;
        }

        return description;
      }

      nameElement.innerText = getName();
      typeElement.innerText = result.components._type;
      descriptionElement.innerText = getDescription();

      topDivElement.appendChild(nameElement);
      topDivElement.appendChild(typeElement);
      bottomDivElement.appendChild(descriptionElement);
      topDivElement.appendChild(nameElement);
      topDivElement.appendChild(typeElement);
      resultElement.appendChild(topDivElement);
      resultElement.appendChild(bottomDivElement);
      container.appendChild(resultElement);
    }

    results.forEach((item) => formatResult(item));
  }

  return { renderSearch };
}());

const itemHandler = (function itemHandler() {
  let results = [];

  function setSearchResults(data) {
    results = data;
  }

  function getSearchResults() {
    return results;
  }

  return { setSearchResults, getSearchResults };
}());

const formHandler = (function formHandler() {
  function validateForm(query) {
    if (query === '') {
      return false;
    }
    return true;
  }

  async function searchCityForm() {
    const input = domHandler.getElement('#search-input').value;
    const valid = validateForm(input);
    if (valid) {
      const locations = await getLocations(input);
      itemHandler.setSearchResults(locations);
      displayController.renderSearch(locations);
    }
  }

  function selectLocation() {
    const { id } = this.dataset;
    const locations = itemHandler.getSearchResults();
    const location = locations[id];
    console.log(location); // Test line
  }

  return { searchCityForm, selectLocation };
}());

function init() {
  console.log('initialized');
  domHandler.addClickEventToElement('#search-btn', formHandler.searchCityForm);
}

init();
