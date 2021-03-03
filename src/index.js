import './main.css';
import getWeather from './app/weather';

getWeather('Samobor').then((data) => console.log(data));
