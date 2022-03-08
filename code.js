'use strict';
// Elements
let totalMoneyElement = document.querySelector('#totalMoney');
let percentageElement = document.querySelector('#percentageLeft');
let buyButtons = document.querySelectorAll('#buy');
let sellButtons = document.querySelectorAll('#sell');
const appContainer = document.querySelector('.app-container');

// Default data
let elonFortune = 217000000000;
let totalPercentage = 100;

let elements = [];

// Events
appContainer.addEventListener('click', (e) => {
  let element = e.target.parentElement;

  if (e.target.classList.contains('btn-buy')) {
    buyItem(element);
  } else if (e.target.classList.contains('btn-sell')) {
    sellItem(element);
  }
});

// Buy item
function buyItem(element) {
  // change default data to new data

  if (elonFortune - Number(element.dataset.price) >= 0) {
    elonFortune -= Number(element.dataset.price);
    totalPercentage = (elonFortune * 100) / 217000000000;

    // Item name
    let itemName = element.parentElement.querySelector('#name').textContent;

    // get span to increment by one
    let amountOfItems = element.querySelector('#amount');
    amountOfItems.textContent = `${Number(amountOfItems.textContent) + 1}`;

    // get button to enable it when item is more than 0
    let button = element.querySelector('#sell');
    if (Number(amountOfItems.textContent) > 0) {
      button.disabled = false;
    }

    updateTotalAndPercentage();

    // Create (if its new) or update recipt item(if it already exists)
    createReciptItem(
      itemName,
      Number(amountOfItems.textContent),
      formatMoney(
        Number(element.dataset.price) * Number(amountOfItems.textContent)
      )
    );

    updateReceipt();
  } else {
    cantAffordAlert();
  }
}

function cantAffordAlert() {
  totalMoneyElement.innerHTML = `<p class="totalMoney">Can't afford that!</p>`;
  percentageElement.innerHTML = `<p class ="percentageLeft">Sell something!</p>`;
}

function createReciptItem(name, amount, total) {
  let receiptItem = new ReceiptItem();
  receiptItem.name = name;
  receiptItem.amount = amount;
  receiptItem.total = total;

  if (!checkReceiptItemExists(receiptItem)) {
    receiptItemsArr.push(receiptItem);
  } else {
    updateReceiptItem(receiptItem);
  }
}

// Sell Item
function sellItem(element) {
  // change default data to new data

  elonFortune += Number(element.dataset.price);
  totalPercentage = (elonFortune * 100) / 217000000000;

  // Item name
  let itemName = element.parentElement.querySelector('p').textContent;

  // get span to decrement by one
  let amountOfItems = element.querySelector('span');
  amountOfItems.textContent = `${Number(amountOfItems.textContent) - 1}`;

  // get button to disable when item is less than 0
  let button = element.querySelector('#sell');

  if (Number(amountOfItems.textContent) === 0) {
    button.disabled = true;
  }
  updateTotalAndPercentage();

  createReciptItem(
    itemName,
    Number(amountOfItems.textContent),
    formatMoney(
      Number(element.dataset.price) * Number(amountOfItems.textContent)
    )
  );

  updateReceipt();
}

function updateTotalAndPercentage() {
  totalMoneyElement.innerHTML = `<p class="totalMoney">Remaining: ${formatMoney(
    elonFortune
  )} USD</p>`;
  percentageElement.innerHTML = `<p class ="percentageLeft">You only spent ${(
    100 - totalPercentage
  ).toFixed(6)} % of the total!</p>`;
}

// Format Money Function
function formatMoney(number) {
  return number.toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, '$1,');
}

// Class to create unique receipt items
class ReceiptItem {
  constructor() {
    this.name;
    this.amount;
    this.total;
  }
}

let receiptItemsArr = [];

// Function that check if that receipt items its already added on the array
function checkReceiptItemExists(receiptItem) {
  let i = 0;
  let exists = false;

  while (!exists && i < receiptItemsArr.length) {
    let itemX = receiptItemsArr[i];
    if (itemX.name === receiptItem.name) {
      exists = true;
    }
    i++;
  }

  return exists;
}

function updateReceiptItem(receiptItem) {
  let i = 0;
  let itemInArr = null;

  while (itemInArr === null && i < receiptItemsArr.length) {
    let itemX = receiptItemsArr[i];

    if (itemX.name === receiptItem.name) {
      itemInArr = itemX;
    }
    i++;
  }

  if (itemInArr) {
    itemInArr.name = receiptItem.name;
    itemInArr.amount = receiptItem.amount;
    itemInArr.total = receiptItem.total;
  }
}

// Function to create recipt (iterara por el array y mostrara los objetos en una lista)
function updateReceipt() {
  let title = `<h1>Receipt</h1>`;
  let receipt = '';
  let total = formatMoney(217000000000 - elonFortune);

  for (let i = 0; i < receiptItemsArr.length; i++) {
    let itemX = receiptItemsArr[i];

    if (itemX.amount !== 0) {
      receipt += `<p>${itemX.name} x <strong> ${itemX.amount}</strong>..............$ ${itemX.total}</p>`;
    }
  }

  document.querySelector('#receipt-container').innerHTML =
    title + receipt + `<p class="totalRecipt">Total is: $ ${total}</p>`;
}

// Function to print
function printSection(el) {
  let printsection = document.getElementById(el).innerHTML;
  document.body.innerHTML = printsection;

  window.print();
}

// Element class - preload data - generate html elements

class Element {
  static nro = 1;
  constructor(name, price, image) {
    this.id = Element.nro++;
    this.name = name;
    this.price = price;
    this.amount = 0;
    this.image = image;
  }
}

function createAndSaveElement(elementName, price, image) {
  if (elementName !== '' && price > 0 && image !== '') {
    let newElement = new Element(elementName, price, image);
    elements.push(newElement);
  }
}

preLoad();

function preLoad() {
  createAndSaveElement('AirPods Pro', 249, 'https://i.imgur.com/jImRpPw.jpg');

  createAndSaveElement(
    'Nintendo Switch',
    299,
    'https://i.imgur.com/LUyQhmF.jpg'
  );
  createAndSaveElement('PS5', 499, 'https://i.imgur.com/CugpEfY.jpg');
  createAndSaveElement('Xbox Series X', 499, 'https://i.imgur.com/HgPROm3.jpg');
  createAndSaveElement(
    'Iphone 13 Pro Max - 1TB',
    1499,
    'https://i.imgur.com/uUyKgKG.jpg'
  );
  createAndSaveElement(
    'Samsung S22 Ultra - 1TB',
    1399,
    'https://i.imgur.com/1Vf4DWy.jpg'
  );
  createAndSaveElement(
    "New MacBook Pro 14' M1 Max (64GB RAM | 4TB) ",
    4699,
    'https://i.imgur.com/69V42nb.jpg'
  );

  createAndSaveElement(
    'New 2022 Mac Studio M1 Ultra (128GB RAM | 8TB)',
    6999,
    'https://i.imgur.com/TaO01Rv.jpg'
  );

  createAndSaveElement(
    'Pro Gaming PC(AMD 5950X, RTX 3090, 64GB, 4TB SSD)',
    4950,
    'https://i.imgur.com/PXJj7z0.jpg'
  );
  createAndSaveElement(
    'Razer Blade 14 Top spec (2022)',
    2799,
    'https://i.imgur.com/XrStrbb.jpg'
  );
  createAndSaveElement(
    'Mac Pro Top spec (2022) (28 Cores, 8TB SSD, 1TB RAM, 32GB Video)',
    53799,
    'https://i.imgur.com/Kx4cEmk.jpg'
  );

  createAndSaveElement(
    'Ipad Air M1 Chip (2022) (256GB)',
    749,
    'https://i.imgur.com/2fWckgJ.jpg'
  );

  createAndSaveElement(
    'Open Fast Food Franchise',
    1500000,
    'https://i.imgur.com/PzvSI1z.jpg'
  );
  createAndSaveElement(
    'Spotify for 80 years',
    9600,
    'https://i.imgur.com/ldwb3kB.jpg'
  );
  createAndSaveElement(
    'Entire Steam library (2022 - No discounts)',
    628000,
    'https://i.imgur.com/qXETLS0.jpg'
  );
  createAndSaveElement(
    'Netflix for 80 Years',
    13500,
    'https://i.imgur.com/ndCJpQO.jpg'
  );
  createAndSaveElement(
    'Entire production of Nvidia GPUs for 2022',
    700000000,
    'https://i.imgur.com/gLZoi2G.jpg'
  );

  createAndSaveElement(
    'Influence 1 high ranking politician',
    2000000,
    'https://i.imgur.com/iELtucq.jpg'
  );

  createAndSaveElement(
    'Private Concert with ANY Super Star',
    1000000,
    'https://i.imgur.com/NemUFgb.jpg'
  );
  createAndSaveElement(
    'Give 10,000 USD to 5000 people',
    50000000,
    'https://i.imgur.com/kym3viy.jpg'
  );
  createAndSaveElement(
    "LG 88' OLED 8K ThinQ®",
    19990,
    'https://i.imgur.com/OWLoofS.jpg'
  );
  createAndSaveElement('Fiat 500', 19000, 'https://i.imgur.com/apb6YDR.jpg');
  createAndSaveElement(
    'Toyota Camry',
    29000,
    'https://i.imgur.com/SfGExTq.jpg'
  );
  createAndSaveElement(
    'Ford F150 Raptor 2022',
    65900,
    'https://i.imgur.com/4jSjHIo.jpg'
  );
  createAndSaveElement(
    'Tesla Model S Plaid',
    132000,
    'https://i.imgur.com/mJWmq7c.jpg'
  );

  createAndSaveElement(
    'Cybertruck (Tri Motor)',
    70000,
    'https://i.imgur.com/VcilGS4.jpg'
  );

  createAndSaveElement(
    'Tesla Roadster 2022',
    200000,
    'https://i.imgur.com/AHkboQ5.jpg'
  );
  createAndSaveElement('Ferrari F8', 276000, 'https://i.imgur.com/WzJBQ28.jpg');

  createAndSaveElement(
    'Lamborghini Aventador SVJ',
    512000,
    'https://i.imgur.com/g9hStpM.jpg'
  );
  createAndSaveElement(
    'Bugatti La Voiture Noire',
    11000000,
    'https://i.imgur.com/z3GMspz.jpg'
  );
  createAndSaveElement(
    '1000 Acres of land',
    4100000,
    'https://i.imgur.com/fzz17Jh.jpg'
  );
  createAndSaveElement(
    'Private Island, Central America (medium size)',
    4950000,
    'https://i.imgur.com/hORfY2Y.jpg'
  );
  createAndSaveElement(
    'Eating out for 80 years (4 meals/day)',
    3100000,
    'https://i.imgur.com/1DegErb.jpg'
  );

  createAndSaveElement(
    'Diamond Ring (Tiffany - 1 carat)',
    17000,
    'https://i.imgur.com/sCfpUGZ.jpg'
  );

  createAndSaveElement(
    'Whisky Macallan Michael Dillon 1926',
    1530000,
    'https://i.imgur.com/tta1VSx.png'
  );

  createAndSaveElement('Rolex', 12000, 'https://i.imgur.com/yOoFsVc.jpg');
  createAndSaveElement(
    'Les Femmes d’Alger by Picasso',
    179400000,
    'https://i.imgur.com/7iKWz6P.jpg'
  );

  createAndSaveElement(
    'Monalisa by Leonardo da Vinci (estimate)',
    869000000,
    'https://i.imgur.com/7gJGSxO.jpg'
  );

  createAndSaveElement(
    'Helicopter Bell 206',
    750000,
    'https://i.imgur.com/PfondRN.jpg'
  );

  createAndSaveElement(
    '10 plastic surgeries',
    130000,
    'https://i.imgur.com/DSTtX6u.jpg'
  );

  createAndSaveElement(
    'One week in EVERY country of the planet',
    1250000,
    'https://i.imgur.com/FTlLdn5.jpg'
  );

  createAndSaveElement(
    'College Education (USA)',
    170000,
    'https://i.imgur.com/32IK5OT.jpg'
  );

  createAndSaveElement(
    'NFL Team (Average)',
    3000000000,
    'https://i.imgur.com/NlZwVTY.jpg'
  );

  createAndSaveElement(
    'NBA Team (Average)',
    2400000000,
    'https://i.imgur.com/4Ri5Db3.jpg'
  );

  createAndSaveElement(
    'F1 Team (Average)',
    700000000,
    'https://i.imgur.com/YTCSphH.jpg'
  );

  createAndSaveElement(
    'Jet Gulfstream G450',
    17000000,
    'https://i.imgur.com/nzI2BgD.jpg'
  );

  createAndSaveElement('M1 Abrams', 8000000, 'https://i.imgur.com/pQ5GHLq.jpg');

  createAndSaveElement(
    'Produce a Hollywood Movie',
    90000000,
    'https://i.imgur.com/gYFuXLE.jpg'
  );

  createAndSaveElement(
    'Regular Modern Apartment (3 bd, 2 ba)',
    320000,
    'https://i.imgur.com/M1hLEQ4.jpg'
  );

  createAndSaveElement(
    'Paris Luxury Apartment(3 bd, 3 ba)',
    3200000,
    'https://i.imgur.com/izKKBfM.jpg'
  );

  createAndSaveElement(
    'L.A Home (5bd, 6ba)',
    6000000,
    'https://i.imgur.com/jUV3CMC.jpg'
  );

  createAndSaveElement(
    'L.A Mega Mansion (8 bd, 20 ba)',
    52000000,
    'https://i.imgur.com/2dosPGH.jpg'
  );

  createAndSaveElement(
    'Modern Building (35 condos + 10 Offices)',
    12000000,
    'https://i.imgur.com/qtlfCFv.jpg'
  );

  createAndSaveElement('Sailboat', 130000, 'https://i.imgur.com/ucF5agb.jpg');

  createAndSaveElement(
    'Mega Yatch',
    300000000,
    'https://i.imgur.com/ch7b6Yh.jpg'
  );
}

elements.forEach((element) => {
  let newElement = document.createElement('div');

  newElement.classList.add('element');

  newElement.innerHTML = `<img src="${element.image}" alt="${element.name}" />
  <p id="name">${element.name}</p>
  <span id="price">USD ${formatMoney(element.price)}</span>
  <div class="buyAndSellContainer" data-price="${element.price}">
    <button class="btn-sell" id="sell" disabled>Sell</button>
    <span id="amount">${element.amount}</span>
    <button class="btn-buy" id="buy" >Buy</button>
  </div>`;

  appContainer.appendChild(newElement);
});
