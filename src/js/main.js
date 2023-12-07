import { loadHeaderFooter, getLocalStorage, qs } from './modules/utils.mjs';
import { displayEvents } from './modules/dataManagment.mjs';

const eventLog = getLocalStorage('events');
const eventsContainer = qs('.event-log');

if (eventLog && eventLog.length > 0) {
  eventsContainer.classList.toggle('none');
  displayEvents();
}
loadHeaderFooter();
