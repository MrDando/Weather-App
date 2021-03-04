import './main.css';
import getWeather from './app/weather';
import getLocations from './app/geocoding';

const locations = getLocations('Springfield');
console.log(locations);
