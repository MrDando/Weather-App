import PubSub from 'pubsub-js';
import getLocations from './geocoding';

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

export { formHandler as default };
