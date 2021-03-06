import './styles/reset.css';
import './styles/main.css';
import PubSub from 'pubsub-js';
import getWeather from './app/weather';
import getLocations from './app/geocoding';

const displayController = (function displayController() {
  function renderSearch(title, results) {
    const container = document.getElementById('search-results');

    container.innerText = '';
    console.log(results); // for testing

    function selectLocation() {
      PubSub.publish('LOCATION SELECTED', this);
    }

    function formatResult(result) {
      const resultElement = document.createElement('div');
      resultElement.setAttribute('data-id', results.indexOf(result));
      resultElement.classList.add('result');
      resultElement.addEventListener('click', selectLocation);

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
  PubSub.subscribe('RENDER SEARCH RESULTS', renderSearch);
}());

const formHandler = (function formHandler() {
  let results = [];

  function validateForm(query) {
    if (query === '') {
      return false;
    }
    return true;
  }

  async function searchForm() {
    const input = document.getElementById('search-input').value;
    const valid = validateForm(input);
    if (valid) {
      const apiKey = '8f6b0328053f4228ab88381794a2a47f';
      const locations = await getLocations(apiKey, input, ['city', 'village']);
      results = locations;
      PubSub.publish('RENDER SEARCH RESULTS', locations);
    }
  }

  function selectLocation(title, data) {
    const { id } = data.dataset;
    const location = results[id];
    console.log(location); // Test line
  }
  PubSub.subscribe('LOCATION SELECTED', selectLocation);
  return { searchForm };
}());

function init() {
  console.log('initialized');
  const button = document.getElementById('search-btn');
  button.addEventListener('click', formHandler.searchForm);
}

init();
