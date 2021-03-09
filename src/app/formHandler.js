import PubSub from 'pubsub-js';
import getLocations from './geocoding';
import getWeather from './weather';

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

  async function requestWeather(title, data) {
    const { id } = data.dataset;
    const location = results[id];
    const { lat } = location.geometry;
    const { lng } = location.geometry;
    const apiKey = '7e82125835d749e0e51d3420e0cdf1ed';
    const weatherData = await getWeather(apiKey, lat, lng, 'metric');
    PubSub.publish('RENDER WEATHER DATA', [location, weatherData, 'metric']);
  }
  PubSub.subscribe('LOCATION SELECTED', requestWeather);
  return { searchForm };
}());

export { formHandler as default };
