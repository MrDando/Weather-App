import PubSub from 'pubsub-js';

const displayController = (function displayController() {
  function renderSearch(title, results) {
    const container = document.getElementById('search-results');

    container.innerText = '';

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

  function renderWeather(title, data) {
    const location = data[0];
    const weatherData = data[1];

    function renderCurrentWeather() {
      const currentWeather = weatherData.current;
      console.log(currentWeather); // testing
    }

    function renderDailyWeather() {
      const dailyWeather = weatherData.daily;
      console.log(dailyWeather); // testing
    }

    function convertUnixTime(unixTimestamp) {
      const date = new Date(unixTimestamp * 1000);
      const hours = date.getHours();
      const minutes = `0${date.getMinutes()}`;
      const seconds = `0${date.getSeconds()}`;
      const formattedTime = `${hours}:${minutes.substr(-2)}:${seconds.substr(-2)}`;

      return (formattedTime);
    }
    renderCurrentWeather();
    renderDailyWeather();
  }
  PubSub.subscribe('RENDER SEARCH RESULTS', renderSearch);
  PubSub.subscribe('RENDER WEATHER DATA', renderWeather);
}());

export { displayController as default };
