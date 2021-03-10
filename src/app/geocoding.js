async function getLocations(apiKey, query, filters = null) {
  async function fetchData() {
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

  const locations = await fetchData();
  if (filters) {
    const filteredLocations = filterResults(locations, ['city', 'village', 'neighbourhood']);
    return filteredLocations;
  }
  return locations;
}

export { getLocations as default };
