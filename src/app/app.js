import formHandler from './formHandler';
import displayController from './displayController';
import getIPLocation from './IPlookup';

function init() {
  const searchForm = document.querySelector('#search-wrapper form');
  searchForm.addEventListener('submit', formHandler.searchForm);

  const switchButton = document.getElementById('switch-span');
  switchButton.addEventListener('click', formHandler.switchUnits);

  getIPLocation();
}

export { init as default };
