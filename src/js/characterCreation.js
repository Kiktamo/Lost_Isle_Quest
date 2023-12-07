import {
  loadHeaderFooter,
  formDataToJSON,
  alertMessage,
  qs,
} from './modules/utils.mjs';
import { initializePlayer } from './modules/dataManagment.mjs';
import setupCharacterCreation from './modules/characterCreationScreen.mjs';

loadHeaderFooter();
setupCharacterCreation();

document.forms['character-creation'].addEventListener('submit', (e) => {
  e.preventDefault();
  // e.target would contain our form in this case
  let chk_status = e.target.checkValidity();

  if (chk_status) {
    let statPool = qs('#pool');

    if (parseInt(statPool.innerHTML) != 0) {
      alertMessage('Please Distribute All Stat Points.');
    } else {
      initializePlayer(formDataToJSON(e.target));
      window.location.href = '../world_map/';
    }
  }
});
