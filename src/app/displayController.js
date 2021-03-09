import PubSub from 'pubsub-js';

const displayController = (function displayController() {
  function getName(location) {
    const types = ['city', 'town', 'village', 'hamlet'];
    let locationName;
    types.forEach((type) => {
      if (location.components.hasOwnProperty(type)) {
        locationName = location.components[type];
      }
    });
    return locationName;
  }

  function renderSearch(title, results) {
    const container = document.getElementById('search-results');

    container.innerText = '';

    function selectLocation() {
      container.innerText = '';
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
      topDivElement.classList.add('flex');
      bottomDivElement.classList.add('bottom');
      const nameElement = document.createElement('h3');
      const typeElement = document.createElement('p');
      const descriptionElement = document.createElement('p');

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

      nameElement.innerText = getName(result);
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

  function renderConditions(title, data) {
    const location = data[0];
    const weatherData = data[1];
    const units = data[2];

    function importAll(r) {
      const images = {};
      r.keys().map((item, index) => { images[item.replace('./', '')] = r(item); });
      return images;
    }

    function renderCurrentConditions() {
      const container = document.getElementById('current-weather-container');
      const currentWeather = weatherData.current;

      function renderLocationName() {
        const nameElement = document.getElementById('location-name');
        nameElement.innerText = getName(location);
      }

      function renderWeather() {
        const imageDivElement = container.querySelector('.icon');
        imageDivElement.innerText = '';

        const imageElement = document.createElement('img');
        const descriptionElement = container.querySelector('.description span');

        const currentWeatherIcon = `${currentWeather.weather[0].icon}.svg`;
        const images = importAll(require.context('./assets/svg/weather', false, /\.(png|jpe?g|svg)$/));
        const image = images[currentWeatherIcon];
        imageElement.src = image.default;

        descriptionElement.innerText = currentWeather.weather[0].description;

        imageDivElement.appendChild(imageElement);
      }

      function renderTemperature() {
        const exactTemperatureElement = container.querySelector('.exact .value');
        const exactTemperature = Math.round(currentWeather.temp);
        exactTemperatureElement.innerText = exactTemperature;

        const exactTemperatureUnits = container.querySelector('.exact .units');
        if (units === 'metric') {
          exactTemperatureUnits.innerHTML = '°C';
        } else {
          exactTemperatureUnits.innerHTML = '°F';
        }

        const feelslikeTemperatureElement = container.querySelector('.feels-like span');
        const feelsLikeTemperature = Math.round(currentWeather.feels_like);
        feelslikeTemperatureElement.innerText = `Feels like ${feelsLikeTemperature}`;
      }

      function renderPrecipitation() {
        const precipitationElement = container.querySelector('.precipitation .value');
        precipitationElement.innerText = '';

        const { rain } = weatherData.current;
        const { snow } = weatherData.current;

        if (rain) {
          precipitationElement.innerText = `${rain['1h']} mm`;
        } else if (snow) {
          precipitationElement.innerText = `${snow['1h']} mm`;
        } else {
          precipitationElement.innerText = '0 mm';
        }
      }

      function renderWind() {

      }

      renderLocationName();
      renderWeather();
      renderTemperature();
      renderPrecipitation();
      renderWind();
    }
    /*
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
    } */
    renderCurrentConditions();
    // renderDailyWeather();
  }
  PubSub.subscribe('RENDER SEARCH RESULTS', renderSearch);
  PubSub.subscribe('RENDER WEATHER DATA', renderConditions);
}());

export { displayController as default };
