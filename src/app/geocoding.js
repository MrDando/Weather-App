async function getLocations(query) {
  async function fetchData() {
    const apiKey = '8f6b0328053f4228ab88381794a2a47f';
    const url = `https://api.opencagedata.com/geocode/v1/json?q=${query}&key=${apiKey}&no_annotations=1`;

    const response = await fetch(url);
    const data = await response.json();

    console.log('Total results: ', data.total_results);
    return data.results;
  }

  function filterResults(locations, filter) {
    const filtered = [];
    locations.forEach((loc) => {
      if (filter.includes(loc.components._type)) {
        filtered.push(loc);
      }
    });
    return filtered;
  }
  // Test function. Remove after testing
  function display(arr) {
    arr.forEach((element) => {
      console.log(element.formatted);
    });
  }

  const locations = await fetchData();
  const filteredLocations = filterResults(locations, ['city', 'village']);
  // display(filteredLocations); // Remove after testing
  return filteredLocations;
}

export { getLocations as default };
