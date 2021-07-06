'use strict';
// Elements
let totalMoneyElement = document.querySelector('#totalMoney');
let percentageElement = document.querySelector('#percentageLeft');
let buyButtons = document.querySelectorAll('#buy');
let sellButtons = document.querySelectorAll('#sell');
const appContainer = document.querySelector('.app-container');

// Default data
let elonFortune = 164000000000;
let totalPercentage = 100;

// Events
appContainer.addEventListener('click', (e) => {
  let element = e.target.parentElement;

  if (e.target.id === 'buy') {
    buyItem(element);
  } else if (e.target.id === 'sell') {
    sellItem(element);
  }
});

// Buy item
function buyItem(element) {
  // change default data to new data
  elonFortune -= Number(element.dataset.price);
  totalPercentage = (elonFortune * 100) / 164000000000;

  // get span to increment by one
  let amountOfItems = element.querySelector('span');
  amountOfItems.textContent = `${Number(amountOfItems.textContent) + 1}`;

  // get button to enable it when item is more than 0
  let button = element.querySelector('#sell');
  if (Number(amountOfItems.textContent) > 0) {
    button.disabled = false;
  }
  updateTotalAndPercentage();
}

// Sell Item
function sellItem(element) {
  // change default data to new data

  elonFortune += Number(element.dataset.price);
  totalPercentage = (elonFortune * 100) / 164000000000;

  // get span to decrement by one
  let amountOfItems = element.querySelector('span');
  amountOfItems.textContent = `${Number(amountOfItems.textContent) - 1}`;

  // get button to disable when item is less than 0
  let button = element.querySelector('#sell');

  if (Number(amountOfItems.textContent) === 0) {
    button.disabled = true;
  }
  updateTotalAndPercentage();
}

function updateTotalAndPercentage() {
  totalMoneyElement.innerHTML = formatMoney(elonFortune) + ' USD';
  percentageElement.innerHTML = `You still have ${totalPercentage.toFixed(
    4
  )} % Left!`;
}

// Format Money Function
function formatMoney(number) {
  return number.toLocaleString('en-US', {
    style: 'currency',
    currency: 'USD',
  });
}

// Function to create recipt

function createRecpit() {}
