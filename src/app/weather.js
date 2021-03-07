async function getWeather(apiKey, lat, lon, units) {
  const url = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&appid=${apiKey}&units=${units}`;

  const response = await fetch(url);
  const data = await response.json();
  return data;
}

export { getWeather as default };
