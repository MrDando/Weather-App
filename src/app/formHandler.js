import PubSub from 'pubsub-js';
import getLocations from './geocoding';
import getWeather from './weather';
import getName from './helpers/getName';

const formHandler = (function formHandler() {
  let results = [];
  let units = 'metric';
  let location;
  let locationName;
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
    PubSub.publish('RENDER WEATHER DATA', [locationName, weatherData, units]);
  }

  async function requestWeather(lat, lng, name = null) {
    if (name) {
      locationName = name;
    }
    const apiKey = '7e82125835d749e0e51d3420e0cdf1ed';
    weatherData = await getWeather(apiKey, lat, lng, 'metric');

    PubSub.publish('RENDER WEATHER DATA', [locationName, weatherData, units]);
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
    locationName = getName(location);
    const { lat } = location.geometry;
    const { lng } = location.geometry;
    requestWeather(lat, lng);
  }

  PubSub.subscribe('LOCATION SELECTED', formatLocation);
  return { searchForm, switchUnits, requestWeather };
}());

export { formHandler as default };
