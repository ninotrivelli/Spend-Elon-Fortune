"use strict";
// Elements
let totalMoneyElement = document.querySelector("#totalMoney");
let percentageElement = document.querySelector("#percentageLeft");
const appContainer = document.querySelector(".app-container");
const personSelect = document.querySelector("#personSelect");
const incomeInput = document.querySelector("#incomeInput");
const expensesInput = document.querySelector("#expensesInput");
const calcTimeBtn = document.querySelector("#calcTime");
const timeResult = document.querySelector("#timeResult");

// Default data
let startingFortune = 245000000000;
let currentFortune = startingFortune;
let totalPercentage = 100;

let elements = [];
let richestPeople = [];
let worldIssues = [];

async function loadJSON(url, fallback) {
  try {
    const r = await fetch(url);
    if (!r.ok) throw new Error('fail');
    return await r.json();
  } catch (e) {
    const r = await fetch(fallback);
    return await r.json();
  }
}

async function loadRichestPeople() {
  richestPeople = await loadJSON(
    'https://example.com/data/richest_people.json',
    'data/richest_people.json'
  );
  personSelect.innerHTML = '';
  richestPeople.forEach((person, index) => {
    const opt = document.createElement('option');
    opt.value = person.net_worth;
    opt.textContent = person.name;
    if (index === 0) opt.selected = true;
    personSelect.appendChild(opt);
  });
  startingFortune = Number(personSelect.value);
  currentFortune = startingFortune;
  personSelect.addEventListener('change', () => {
    startingFortune = Number(personSelect.value);
    currentFortune = startingFortune;
    totalPercentage = 100;
    updateTotalAndPercentage();
  });
}

async function loadCpiItems() {
  const items = await loadJSON(
    'https://example.com/data/cpi_items.json',
    'data/cpi_items.json'
  );
  items.forEach((item) =>
    createAndSaveElement(item.name, item.price, './img/usd-circle.svg')
  );
}

async function loadWorldIssues() {
  worldIssues = await loadJSON(
    'https://example.com/data/world_issues.json',
    'data/world_issues.json'
  );
  worldIssues.forEach((item) =>
    createAndSaveElement(item.name, item.price, './img/usd-circle.svg')
  );
}

async function init() {
  await loadRichestPeople();
  preLoad();
  await loadCpiItems();
  await loadWorldIssues();
  renderElements();
  updateTotalAndPercentage();
  setInterval(updateData, 8 * 60 * 60 * 1000);
}

// Events
appContainer.addEventListener("click", (e) => {
  const container = e.target.closest(".buyAndSellContainer");
  if (!container) return;
  if (e.target.classList.contains("btn-buy")) {
    buyItem(container);
  } else if (e.target.classList.contains("btn-sell")) {
    sellItem(container);
  }
});

appContainer.addEventListener("change", (e) => {
  if (e.target.classList.contains("amount-input")) {
    const container = e.target.closest(".buyAndSellContainer");
    setItemAmount(container, e.target.value);
  }
});

// Buy item
function buyItem(element) {
  setItemAmount(element, Number(element.dataset.amount) + 1);
}

function cantAffordAlert() {
  totalMoneyElement.innerHTML = `<p class="totalMoney">Can't afford that!</p>`;
  percentageElement.innerHTML = `<p class ="percentageLeft">Sell something!</p>`;
}

function setItemAmount(container, newAmount) {
  newAmount = Math.max(0, Math.floor(newAmount));
  const price = Number(container.dataset.price);
  const oldAmount = Number(container.dataset.amount);
  const diff = newAmount - oldAmount;
  if (diff > 0) {
    const cost = diff * price;
    if (currentFortune - cost < 0) {
      cantAffordAlert();
      container.querySelector('#amount').value = oldAmount;
      return;
    }
    currentFortune -= cost;
  } else if (diff < 0) {
    currentFortune += -diff * price;
  }
  container.dataset.amount = newAmount;
  const input = container.querySelector('#amount');
  input.value = newAmount;
  const sellBtn = container.querySelector('#sell');
  sellBtn.disabled = newAmount === 0;
  const itemName = container.parentElement.querySelector('#name').textContent;
  totalPercentage = (currentFortune * 100) / startingFortune;
  createReciptItem(itemName, newAmount, formatMoney(price * newAmount));
  updateTotalAndPercentage();
  updateReceipt();
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
  setItemAmount(element, Number(element.dataset.amount) - 1);
}

function updateTotalAndPercentage() {
  totalMoneyElement.innerHTML = `<p class="totalMoney">Remaining: ${formatMoney(
    currentFortune
  )} USD</p>`;
  percentageElement.innerHTML = `<p class ="percentageLeft">You only spent ${(
    100 - totalPercentage
  ).toFixed(6)} % of the total!</p>`;
}

// Format Money Function
function formatMoney(number) {
  return number.toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,");
}

function formatDuration(seconds) {
  const units = [
    ['millennium', 31557600000],
    ['century', 3155760000],
    ['decade', 315576000],
    ['year', 31557600],
    ['month', 2629800],
    ['week', 604800],
    ['day', 86400],
    ['hour', 3600],
    ['minute', 60],
    ['second', 1],
  ];
  let remaining = seconds;
  const parts = [];
  for (const [name, value] of units) {
    const qty = Math.floor(remaining / value);
    if (qty > 0) {
      parts.push(`${qty} ${name}${qty > 1 ? 's' : ''}`);
      remaining -= qty * value;
    }
  }
  if (parts.length === 0) return '0 seconds';
  return parts.join(', ');
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
  let receipt = "";
  let total = formatMoney(startingFortune - currentFortune);

  for (let i = 0; i < receiptItemsArr.length; i++) {
    let itemX = receiptItemsArr[i];

    if (itemX.amount !== 0) {
      receipt += `<p>${itemX.name} x <strong> ${itemX.amount}</strong>..............$ ${itemX.total}</p>`;
    }
  }

  document.querySelector("#receipt-container").innerHTML =
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
  if (elementName !== "" && price > 0 && image !== "") {
    let newElement = new Element(elementName, price, image);
    elements.push(newElement);
  }
}

function preLoad() {
  createAndSaveElement("AirPods Pro", 249, "https://i.imgur.com/9QtYXwu.jpg");

  createAndSaveElement(
    "Nintendo Switch",
    299,
    "https://i.imgur.com/NjB1B10.jpg"
  );
  createAndSaveElement("PS5", 499, "https://i.imgur.com/0GPFIYa.jpg");
  createAndSaveElement("Xbox Series X", 499, "https://i.imgur.com/B9ePUN9.jpg");
  createAndSaveElement(
    "Iphone 15 Pro Max Titanium - 1TB",
    1599,
    "https://i.imgur.com/VmU4KDK.jpg"
  );
  createAndSaveElement(
    "Samsung S24 Ultra - 1TB",
    1499,
    "https://i.imgur.com/Dfnlv06.png"
  );
  createAndSaveElement(
    "MacBook Pro 14' M3 Max (64GB RAM | 4TB) ",
    4699,
    "https://i.imgur.com/6QjVUZV.jpg"
  );

  createAndSaveElement(
    "Mac Studio M3 Ultra (128GB RAM | 8TB)",
    6999,
    "https://i.imgur.com/fminWBH.jpg"
  );

  createAndSaveElement(
    "Pro Gaming PC(I9 14900K, RTX 4090, 64GB, 4TB SSD)",
    6950,
    "https://i.imgur.com/diqWGS7.jpg"
  );
  createAndSaveElement(
    "Razer Blade 14 Top spec (2024)",
    2799,
    "https://i.imgur.com/C91Spgr.jpg"
  );

  createAndSaveElement(
    "Ipad Air M2 Chip (2024) (256GB)",
    749,
    "https://i.imgur.com/6cs5d6D.jpg"
  );

  createAndSaveElement(
    "Tesla Bot (Available 2026)",
    20000,
    "https://i.imgur.com/1zf8Od2.jpg"
  );

  createAndSaveElement(
    "Start your own StartUp",
    5000000,
    "https://i.imgur.com/F8tPuHG.jpg"
  );

  createAndSaveElement(
    "Open Fast Food Franchise",
    1200000,
    "https://i.imgur.com/LSZCZfI.jpg"
  );
  createAndSaveElement(
    "Spotify for 80 years",
    12600,
    "https://i.imgur.com/sgDA4Jc.jpg"
  );
  createAndSaveElement(
    "Entire Steam library (2024 - No discounts)",
    828000,
    "https://i.imgur.com/6GP748G.jpg"
  );

  createAndSaveElement(
    "Launch your own satellite with your name",
    80000000,
    "https://i.imgur.com/ekogdpq.jpg"
  );

  createAndSaveElement(
    "Netflix for 80 Years",
    18500,
    "https://i.imgur.com/zGaCSFJ.jpg"
  );
  createAndSaveElement(
    "Entire production of Nvidia GPUs for 2024",
    1100000000,
    "https://i.imgur.com/kjmUU0f.jpg"
  );

  createAndSaveElement(
    "Influence 1 high ranking politician",
    2000000,
    "https://i.imgur.com/7IB3CLt.jpg"
  );

  createAndSaveElement(
    "Private Concert with ANY Super Star",
    1000000,
    "https://i.imgur.com/qjQqs0v.jpg"
  );
  createAndSaveElement(
    "Give 10,000 USD to 5000 people",
    50000000,
    "https://i.imgur.com/NE7sbRU.jpg"
  );
  createAndSaveElement(
    "LG 88' OLED 8K ThinQ®",
    19990,
    "https://i.imgur.com/TGGOqdl.jpg"
  );
  createAndSaveElement("Fiat 500", 19000, "https://i.imgur.com/sk9EP1i.jpg");
  createAndSaveElement(
    "Toyota Camry",
    29000,
    "https://i.imgur.com/yfQjaS6.jpg"
  );
  createAndSaveElement(
    "Ford F150 Raptor 2024",
    65900,
    "https://i.imgur.com/SaSBjQ7.jpg"
  );
  createAndSaveElement(
    "Tesla Model S Plaid",
    132000,
    "https://i.imgur.com/tfSw6ND.jpg"
  );

  createAndSaveElement(
    "Cybertruck (Tri Motor)",
    70000,
    "https://i.imgur.com/pHxajOw.jpg"
  );

  createAndSaveElement(
    "Tesla Roadster 2024",
    200000,
    "https://i.imgur.com/bX4SeTv.jpg"
  );
  createAndSaveElement(
    "Ferrari F8 Tributo",
    276000,
    "https://i.imgur.com/giumAZC.jpg"
  );

  createAndSaveElement(
    "Lamborghini Aventador SVJ",
    512000,
    "https://i.imgur.com/NdHxu2p.jpg"
  );
  createAndSaveElement(
    "Bugatti La Voiture Noire",
    11000000,
    "https://i.imgur.com/ULFQYv1.jpg"
  );
  createAndSaveElement(
    "1000 Acres of land",
    5100000,
    "https://i.imgur.com/4fY8du1.jpg"
  );
  createAndSaveElement(
    "Private Island, Central America (medium size)",
    4950000,
    "https://i.imgur.com/jtbz2S4.jpg"
  );
  createAndSaveElement(
    "Eating out for 80 years (4 meals/day)",
    3100000,
    "https://i.imgur.com/CNyhJF3.jpg"
  );

  createAndSaveElement(
    "Diamond Ring (Tiffany - 1 carat)",
    17000,
    "https://i.imgur.com/E8sg2YQ.jpg"
  );

  createAndSaveElement(
    "Whisky Macallan Michael Dillon 1926",
    1530000,
    "https://i.imgur.com/momWXBT.jpg"
  );

  createAndSaveElement(
    "Rolex Oyster 36mm",
    14000,
    "https://i.imgur.com/MUGVZ8i.jpg"
  );

  createAndSaveElement(
    "Rolex Day Date 40mm Gold",
    65000,
    "https://i.imgur.com/Cynw2Zw.png"
  );

  createAndSaveElement(
    "Les Femmes d’Alger by Picasso",
    179400000,
    "https://i.imgur.com/4a6CDQK.jpg"
  );

  createAndSaveElement(
    "Monalisa by Leonardo da Vinci (estimate)",
    869000000,
    "https://i.imgur.com/wDo8a6C.jpg"
  );

  createAndSaveElement(
    "Helicopter Bell 206",
    850000,
    "https://i.imgur.com/rqZ7IIk.jpg"
  );

  createAndSaveElement(
    "10 plastic surgeries",
    130000,
    "https://i.imgur.com/yU4EsJj.jpg"
  );

  createAndSaveElement(
    "One week in EVERY country of the planet",
    1250000,
    "https://i.imgur.com/dUxUeHi.jpg"
  );

  createAndSaveElement(
    "College Education (USA)",
    190000,
    "https://i.imgur.com/fVNcvTE.jpg"
  );

  createAndSaveElement(
    "NFL Team (Average)",
    3000000000,
    "https://i.imgur.com/stpt2ZG.jpg"
  );

  createAndSaveElement(
    "NBA Team (Average)",
    2400000000,
    "https://i.imgur.com/dr2aFvN.jpg"
  );

  createAndSaveElement(
    "F1 Team (Average)",
    700000000,
    "https://i.imgur.com/PKvVuAm.jpg"
  );

  createAndSaveElement(
    "Jet Gulfstream G450",
    18000000,
    "https://i.imgur.com/QlgwDGF.jpg"
  );

  createAndSaveElement("M1 Abrams", 8000000, "https://i.imgur.com/jemMZg5.jpg");

  createAndSaveElement(
    "Produce a Hollywood Movie",
    90000000,
    "https://i.imgur.com/06isRMk.jpg"
  );

  createAndSaveElement(
    "Regular Modern Apartment (3 bd, 2 ba)",
    420000,
    "https://i.imgur.com/8Dd6fiM.jpg"
  );

  createAndSaveElement(
    "Paris Luxury Apartment(3 bd, 3 ba)",
    3200000,
    "https://i.imgur.com/my8vglc.jpg"
  );

  createAndSaveElement(
    "L.A Home (5bd, 6ba)",
    6000000,
    "https://i.imgur.com/ypjjQYX.jpg"
  );

  createAndSaveElement(
    "L.A Mega Mansion (8 bd, 20 ba)",
    52000000,
    "https://i.imgur.com/iGbwSSM.jpg"
  );

  createAndSaveElement(
    "Modern Building (35 condos + 10 Offices)",
    12000000,
    "https://i.imgur.com/j2JS3Us.jpg"
  );

  createAndSaveElement("Sailboat", 130000, "https://i.imgur.com/jsbtkG7.jpg");

  createAndSaveElement(
    "Mega Yatch",
    300000000,
    "https://i.imgur.com/DGX1I5F.jpg"
  );
}

function renderElements() {
  appContainer.innerHTML = "";
  elements.forEach((element) => {
    let newElement = document.createElement("div");

    newElement.classList.add("element");

    newElement.innerHTML = `<img src="${element.image}" alt="${element.name}" />
    <p id="name">${element.name}</p>
    <span id="price">USD ${formatMoney(element.price)}</span>
    <div class="buyAndSellContainer" data-price="${element.price}" data-amount="0">
      <button class="btn-sell" id="sell" disabled>-</button>
      <input type="number" class="amount-input" id="amount" min="0" value="0" />
      <button class="btn-buy" id="buy">+</button>
    </div>`;

    appContainer.appendChild(newElement);
  });
}

async function updateData() {
  await loadRichestPeople();
  elements = [];
  preLoad();
  await loadCpiItems();
  await loadWorldIssues();
  renderElements();
  updateTotalAndPercentage();
}

if (calcTimeBtn) {
  calcTimeBtn.addEventListener('click', () => {
    const income = Number(incomeInput.value);
    const expenses = Number(expensesInput.value);
    const yearlySavings = income - expenses * 12;
    if (yearlySavings <= 0) {
      timeResult.textContent = 'You would never reach this amount at this rate.';
      return;
    }
    const seconds = (startingFortune / yearlySavings) * 31557600;
    timeResult.textContent = formatDuration(seconds);
  });
}

init();
