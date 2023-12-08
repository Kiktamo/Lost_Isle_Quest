import { headerTemplate, footerTemplate } from './templates.mjs';

// wrapper for querySelector...returns matching element
export function qs(selector, parent = document) {
  return parent.querySelector(selector);
}

// retrieve data from localstorage
export function getLocalStorage(key) {
  return JSON.parse(localStorage.getItem(key));
}

// save data to local storage
export function setLocalStorage(key, data) {
  localStorage.setItem(key, JSON.stringify(data));
}

export function clearLocalStorage(key) {
  localStorage.removeItem(key);
}

// set a listener for both touchend and click
export function setClick(selector, callback) {
  qs(selector).addEventListener('touchend', (event) => {
    event.preventDefault();
    callback();
  });
  qs(selector).addEventListener('click', callback);
}

// Get a query parameter value from the URL
export function getParam(param) {
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  return urlParams.get(param);
}

export function getData(category) {
  return fetch(`../data/${category}.json`)
    .then(convertToJson)
    .then((data) => data);
}

function convertToJson(res) {
  if (res.ok) {
    return res.json();
  } else {
    throw new Error('Bad Response');
  }
}

export function formDataToJSON(formElement) {
  const formData = new FormData(formElement),
    convertedJSON = {};

  formData.forEach(function (value, key) {
    convertedJSON[key] = value;
  });

  return convertedJSON;
}

export function renderListWithTemplate(
  templateFn,
  parentElement,
  list,
  position = 'afterbegin',
  clear = true,
) {
  if (clear) {
    parentElement.innerHTML = '';
  }
  const htmlString = list.map(templateFn);
  parentElement.insertAdjacentHTML(position, htmlString.join(''));
}

export async function renderWithTemplate(
  templateFn,
  parentElement,
  data,
  callback,
  position = 'afterbegin',
  clear = true,
) {
  if (clear) {
    parentElement.innerHTML = '';
  }
  const htmlString = await templateFn(data);
  parentElement.insertAdjacentHTML(position, htmlString);

  if (callback) {
    callback(data);
  }
}

export async function loadHeaderFooter(headerData, footerData) {
  const header = qs('header');
  const footer = qs('footer');

  header.classList.add('divider-bottom');
  footer.classList.add('divider-top');

  renderWithTemplate(headerTemplate, header, headerData);
  renderWithTemplate(footerTemplate, footer, footerData);
}

export async function toggleModal(templateFn, data, callback) {
  const modal = qs('.modal');
  const overlay = qs('.overlay');
  const modalButton = document.createElement('span');
  modalButton.classList.add('modal-button');

  // Check if a modal is being displayed
  if (modal.classList.contains('none')) {
    // If not then render with the given template and arguments.
    renderWithTemplate(templateFn, modal, data, callback);
    modal.insertBefore(modalButton, modal.firstChild);
    modalButton.addEventListener('click', function () {
      toggleModal(templateFn, data, callback);
    });
  } else {
    // Clear the modal otherwise
    modal.querySelectorAll('*').forEach((n) => n.remove());
  }

  // At the end toggle visibility regardless
  modal.classList.toggle('none');
  overlay.classList.toggle('invisible');
}

export function alertMessage(message, scroll = true) {
  // Prevent alert spam
  const alerts = document.getElementsByClassName('alert');

  if (alerts.length >= 5) {
    alerts[0].remove();
  }

  // Create an element to hold our alert
  const main = qs('main');
  const alert = document.createElement('div');

  // Add a class to style the alert
  alert.classList.add('alert');

  // Set the contents. You should have a message and an X or something the user can click on to remove
  alert.innerHTML = `${message} <span class="close">X</span>`;

  // Add a listener to the alert to see if they clicked on the X
  // If they did, then remove the alert
  alert.addEventListener('click', function (e) {
    if (e.target.tagName === 'SPAN' && e.target.innerText === 'X') {
      main.removeChild(this);
    }
  });

  // Add the alert to the top of main
  main.prepend(alert);

  // Make sure they see the alert by scrolling to the top of the window
  // We may not always want to do this, so default to scroll=true, but allow it to be passed in and overridden.
  if (scroll) {
    window.scrollTo(0, 0);
  }
}

export function getRandomArbitrary(min, max) {
  return Math.round(Math.random() * (max - min) + min);
}
