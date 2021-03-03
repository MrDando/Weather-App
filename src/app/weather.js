async function getWeather(city, units = 'metric') {
  const apiKey = '7e82125835d749e0e51d3420e0cdf1ed';

  async function getCurrentWeatherData() {
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=${units}`;

    const response = await fetch(url);
    const data = await response.json();
    return data;
  }

  async function getForecast() {
    const url = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=${units}`;

    const response = await fetch(url);
    const data = await response.json();
    return data;
  }

  const currentData = await getCurrentWeatherData();
  const forecast = await getForecast();

  return Promise.all([currentData, forecast]);
}

export { getWeather as default };
