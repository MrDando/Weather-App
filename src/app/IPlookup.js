import formHandler from './formHandler';

async function getIPLocation() {
  const url = 'https://ipapi.co/json/';

  const response = await fetch(url, {
    mode: 'cors',
  });
  const data = await response.json();

  const { city } = data;
  const { latitude } = data;
  const { longitude } = data;
  formHandler.requestWeather(latitude, longitude, city);
}

export { getIPLocation as default };
