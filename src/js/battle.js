import { getParam, loadHeaderFooter } from './modules/utils.mjs';
import renderBattle from './modules/battleScreen.mjs';

const enemy = getParam('enemy');
loadHeaderFooter();
renderBattle(enemy);
