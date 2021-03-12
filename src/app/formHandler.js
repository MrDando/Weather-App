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

  async function requestWeather() {
    const { lat } = location.geometry;
    const { lng } = location.geometry;
    const apiKey = '7e82125835d749e0e51d3420e0cdf1ed';
    weatherData = await getWeather(apiKey, lat, lng, 'metric');
    PubSub.publish('RENDER WEATHER DATA', [location, weatherData, units]);
  }

  async function searchForm(e, val) { // remove val parameter after testing
    // temporary code. Remove after testing
    let input = val;
    if (!input) {
      input = document.getElementById('search-input').value;
    } // end of temp code
    // input = document.getElementById('search-input').value;
    const valid = validateForm(input);
    if (valid) {
      const apiKey = '8f6b0328053f4228ab88381794a2a47f';
      const locations = await getLocations(apiKey, input, ['city', 'village']);
      results = locations;
      if (results.length === 1) {
        location = results[0];
        requestWeather();
      } else {
        PubSub.publish('RENDER SEARCH RESULTS', locations);
      }
    }
  }

  function formatLocation(title, data) {
    const { id } = data.dataset;
    location = results[id];
    requestWeather();
  }

  PubSub.subscribe('LOCATION SELECTED', formatLocation);
  return { searchForm, switchUnits };
}());

export { formHandler as default };
