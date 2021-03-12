import PubSub from 'pubsub-js';
import getLocations from './geocoding';
import getWeather from './weather';

const formHandler = (function formHandler() {
  let results = [];
  let units = 'metric';
  let location;
  let weatherData;

  function validateForm(query) {
    if (query === '') {
      return false;
    }
    return true;
  }

  function switchUnits() {
    if (units === 'metric') {
      units = 'imperial';
    } else {
      units = 'metric';
    }
    PubSub.publish('RENDER WEATHER DATA', [location, weatherData, units]);
  }

  async function requestWeather(lat, lng, name = null) {
    const apiKey = '7e82125835d749e0e51d3420e0cdf1ed';
    weatherData = await getWeather(apiKey, lat, lng, 'metric');
    if (name) {
      PubSub.publish('RENDER WEATHER DATA', [name, weatherData, units]);
    } else {
      PubSub.publish('RENDER WEATHER DATA', [location, weatherData, units]);
    }
  }

  async function searchForm() {
    const input = document.getElementById('search-input').value;
    const valid = validateForm(input);
    if (valid) {
      const apiKey = '8f6b0328053f4228ab88381794a2a47f';
      const locations = await getLocations(apiKey, input, ['city', 'village']);
      results = locations;
      if (results.length === 1) {
        location = results[0];
        const { lat } = location.geometry;
        const { lng } = location.geometry;
        requestWeather(lat, lng);
      } else {
        PubSub.publish('RENDER SEARCH RESULTS', locations);
      }
    }
  }

  function formatLocation(title, data) {
    const { id } = data.dataset;
    location = results[id];
    const { lat } = location.geometry;
    const { lng } = location.geometry;
    requestWeather(lat, lng);
  }

  PubSub.subscribe('LOCATION SELECTED', formatLocation);
  return { searchForm, switchUnits, requestWeather };
}());

export { formHandler as default };
