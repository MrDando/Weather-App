import PubSub from 'pubsub-js';
import getName from './helpers/getName';

const displayController = (function displayController() {
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
      bottomDivElement.classList.add('flex');
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

  function showLoadingScreen() {
    const main = document.querySelector('main');
    const loadingScreen = main.querySelector('.loading-screen');
    loadingScreen.classList.remove('hidden');

    const currentConditions = main.querySelector('#current-conditions-container');
    currentConditions.classList.add('hidden');

    const forecast = main.querySelector('#forecast-table');
    forecast.classList.add('hidden');
  }

  function removeLoadingScreen() {
    const main = document.querySelector('main');
    const loadingScreen = main.querySelector('.loading-screen');
    loadingScreen.classList.add('hidden');

    const currentConditions = main.querySelector('#current-conditions-container');
    currentConditions.classList.remove('hidden');

    const forecast = main.querySelector('#forecast-table');
    forecast.classList.remove('hidden');
  }

  function renderConditions(title, data) {
    const locationName = data[0];
    const weatherData = data[1];
    const units = data[2];

    function importAll(r) {
      const images = {};
      r.keys().map((item, index) => { images[item.replace('./', '')] = r(item); });
      return images;
    }

    function convertToFahrenheit(celsius) {
      const fahrenheit = (celsius * 1.8) + 32;
      return fahrenheit;
    }

    const images = importAll(require.context('./assets/svg/weather', false, /\.(png|jpe?g|svg)$/));

    function convertUnixTime(unixTimestamp) {
      const date = new Date(unixTimestamp * 1000);

      return date;
    }

    function renderCurrentConditions() {
      const container = document.getElementById('current-conditions-container');
      const currentWeather = weatherData.current;

      function renderLocationName() {
        const nameElement = document.getElementById('location-name');
        nameElement.innerText = locationName;
      }

      function renderWeather() {
        const imageDivElement = container.querySelector('.icon');
        imageDivElement.innerText = '';

        const imageElement = document.createElement('img');
        const descriptionElement = container.querySelector('.description span');

        const currentWeatherIcon = `${currentWeather.weather[0].icon}.svg`;
        const image = images[currentWeatherIcon];
        imageElement.src = image.default;

        const { description } = currentWeather.weather[0];
        descriptionElement.innerText = description.charAt(0).toUpperCase() + description.slice(1);

        imageDivElement.appendChild(imageElement);
      }

      function renderTemperature() {
        const exactTemperatureElement = container.querySelector('.exact .value');
        let exactTemperature = currentWeather.temp;

        if (units === 'metric') {
          exactTemperature = Math.round(exactTemperature);
        } else {
          exactTemperature = Math.round(convertToFahrenheit(exactTemperature));
        }
        exactTemperatureElement.innerText = exactTemperature;

        const exactTemperatureUnits = container.querySelector('.exact .units');
        if (units === 'metric') {
          exactTemperatureUnits.innerHTML = '°C';
        } else {
          exactTemperatureUnits.innerHTML = '°F';
        }

        const feelslikeTemperatureElement = container.querySelector('.feels-like span');
        let feelsLikeTemperature = currentWeather.feels_like;

        if (units === 'metric') {
          feelsLikeTemperature = Math.round(feelsLikeTemperature);
        } else {
          feelsLikeTemperature = Math.round(convertToFahrenheit(feelsLikeTemperature));
        }
        feelslikeTemperatureElement.innerText = `Feels like: ${feelsLikeTemperature}°`;
      }

      function renderAlerts() {
        const alertDiv = container.querySelector('.alerts');
        const alertElement = container.querySelector('.alerts .value');

        const { alerts } = weatherData;

        if (alerts) {
          alertElement.innerText = alerts[0].event;
          alertDiv.classList.add('danger');
        } else {
          alertElement.innerText = 'No Alerts';
          alertDiv.classList.remove('danger');
        }
      }

      function renderPrecipitation() {
        const precipitationElement = container.querySelector('.precipitation .value');
        precipitationElement.innerText = '';

        const { rain } = weatherData.current;
        const { snow } = weatherData.current;

        if (rain && snow) {
          precipitationElement.innerText = `${Math.round((rain['1h'] + snow['1h']) * 10) / 10} mm`;
        } else if (rain) {
          precipitationElement.innerText = `${Math.round(rain['1h'] * 10) / 10} mm`;
        } else if (snow) {
          precipitationElement.innerText = `${Math.round(snow['1h'] * 10) / 10} mm`;
        } else {
          precipitationElement.innerText = '0 mm';
        }
      }

      function renderWind() {
        function degToCard(value) {
          value = parseFloat(value);
          if (value <= 11.25) return 'N';
          value -= 11.25;
          const allDirections = ['NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW', 'N'];
          const dIndex = parseInt(value / 22.5);
          return allDirections[dIndex] ? allDirections[dIndex] : 'N';
        }

        const windElement = container.querySelector('.wind .value');
        const windSpeed = `${Math.round(currentWeather.wind_speed)} m/s`;

        const windDeg = currentWeather.wind_deg;
        const windDirection = degToCard(windDeg);

        windElement.innerText = `${windDirection} ${windSpeed} `;
      }

      function renderHumidity() {
        const humidityElement = container.querySelector('.humidity .value');
        const { humidity } = currentWeather;

        humidityElement.innerText = `${humidity} %`;
      }

      renderLocationName();
      renderWeather();
      renderTemperature();
      renderAlerts();
      renderPrecipitation();
      renderWind();
      renderHumidity();
    }

    function renderDailyForecast() {
      const dailyWeather = weatherData.daily;
      const container = document.querySelector('#forecast-container');
      container.innerText = '';

      function getDayName(date) {
        const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        return days[date.getDay()];
      }

      function getMonthName(date) {
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        return months[date.getMonth()];
      }

      function renderDate(i, dateTime, wrapperDiv) {
        const dateDiv = document.createElement('td');
        dateDiv.classList.add('first-row');
        const day = (i === 0) ? 'Today' : getDayName(dateTime);
        const month = getMonthName(dateTime);
        const date = dateTime.getDate();
        dateDiv.innerText = `${day}, ${month}. ${date}`;
        wrapperDiv.appendChild(dateDiv);
      }

      function renderWeatherImage(icon, wrapperDiv) {
        const imageTd = document.createElement('td');
        const imageElement = document.createElement('img');
        const image = images[`${icon}.svg`].default;
        imageElement.src = image;

        imageTd.appendChild(imageElement);
        wrapperDiv.appendChild(imageTd);
      }

      function renderMaxMinTemperature(temp, wrapperDiv) {
        const temperatureTd = document.createElement('td');
        const temeratureSpan = document.createElement('span');
        let maxTemp = temp.max;
        let minTemp = temp.min;

        if (units === 'metric') {
          maxTemp = Math.round(maxTemp);
          minTemp = Math.round(minTemp);
        } else {
          maxTemp = Math.round(convertToFahrenheit(maxTemp));
          minTemp = Math.round(convertToFahrenheit(minTemp));
        }

        temeratureSpan.innerText = `${maxTemp}° / ${minTemp}°`;
        temperatureTd.appendChild(temeratureSpan);
        wrapperDiv.appendChild(temperatureTd);
      }

      function renderPrecipitation(dailyData, wrapperDiv) {
        const precipitationTd = document.createElement('td');
        const precipitationSpan = document.createElement('span');
        const { rain } = dailyData;
        const { snow } = dailyData;
        let precipitation;

        if (rain && snow) {
          precipitation = rain + snow;
        } else if (rain) {
          precipitation = rain;
        } else if (snow) {
          precipitation = snow;
        } else {
          precipitation = 0;
        }

        if (precipitation > 10) {
          precipitation = Math.round(precipitation);
        } else {
          precipitation = Math.round(precipitation * 10) / 10;
        }
        precipitationSpan.innerText = `${precipitation} mm`;

        precipitationTd.appendChild(precipitationSpan);
        wrapperDiv.appendChild(precipitationTd);
      }

      function renderWind(wind, wrapperDiv) {
        const windTd = document.createElement('td');
        const windSpan = document.createElement('span');

        windSpan.innerText = `${Math.round(wind)} m/s`;

        windTd.appendChild(windSpan);
        wrapperDiv.appendChild(windTd);
      }

      for (let i = 0; i < dailyWeather.length; i += 1) {
        const wrapperDiv = document.createElement('tr');
        const dailyData = dailyWeather[i];
        wrapperDiv.classList.add('day');
        const dateTime = convertUnixTime(dailyData.dt);

        renderDate(i, dateTime, wrapperDiv);
        renderWeatherImage(dailyData.weather[0].icon, wrapperDiv);
        renderMaxMinTemperature(dailyData.temp, wrapperDiv);
        renderPrecipitation(dailyData, wrapperDiv);
        renderWind(dailyData.wind_speed, wrapperDiv);

        container.appendChild(wrapperDiv);
      }
    }

    renderCurrentConditions();
    renderDailyForecast();
    setTimeout(() => { PubSub.publish('REMOVE LOADING SCREEN'); }, 1000);
  }
  PubSub.subscribe('RENDER SEARCH RESULTS', renderSearch);
  PubSub.subscribe('RENDER WEATHER DATA', renderConditions);
  PubSub.subscribe('SHOW LOADING SCREEN', showLoadingScreen);
  PubSub.subscribe('REMOVE LOADING SCREEN', removeLoadingScreen);
}());

export { displayController as default };
