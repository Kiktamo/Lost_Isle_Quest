import {
  qs,
  getData,
  renderWithTemplate,
  setClick,
  getRandomArbitrary,
} from './utils.mjs';
import { addToEventLog, removeEnemy } from './dataManagment.mjs';
import { battleTemplate } from './templates.mjs';
import { getEnemy, getPlayer, setEnemy, setPlayer } from './dataManagment.mjs';

const battleLog = [];

export default async function renderBattle(enemy) {
  const battleView = qs('.battle');
  let savedEnemy = getEnemy();
  const player = getPlayer();

  if (!savedEnemy) {
    const enemies = await getData('enemies');
    savedEnemy = enemies.find((newEnemy) => newEnemy.id === enemy);
    setEnemy(savedEnemy);
  }

  if (battleLog.length < 1) {
    addToBattleLog(`You've encountered ${savedEnemy.name}`);
  }

  const battle = { enemy: savedEnemy, player: player, log: battleLog };

  renderWithTemplate(battleTemplate, battleView, battle, setupBattleButtons);
}

function addToBattleLog(message) {
  while (battleLog.length >= 5) {
    battleLog.shift();
  }

  battleLog.push(message);
}

function setupBattleButtons() {
  const commandButtons = qs('.battle-commands');
  const victoryButton = qs('.victory-button');

  if (commandButtons || victoryButton) {
    if (commandButtons) {
      setClick('.attack', attack);
      setClick('.items', items);
      setClick('.run', run);
    } else {
      setClick('.victory-button', victory);
    }
  } else {
    setTimeout(setupBattleButtons, 500);
  }
}

function attack() {
  const enemy = getEnemy();
  const player = getPlayer();
  const enemyImage = qs('.enemy-img');

  let playerDamage = getRandomArbitrary(0, 10);

  if (playerDamage > 0) {
    playerDamage += Math.round(player.stats.str / 10);
    addToBattleLog(`You strike the ${enemy.name} for ${playerDamage}`);
    enemy.health -= playerDamage;
    setEnemy(enemy);
    enemyImage.classList.toggle('flashing-object');
    enemyImage.addEventListener('animationend', (event) => {
      this.classList.toggle('flashing-object');
      renderBattle();
    });
  } else {
    addToBattleLog(`You miss the ${enemy.name}`);
    renderBattle();
  }
}

function items() {
  const player = getPlayer();
}

function run() {
  const enemy = getEnemy();
  const player = getPlayer();
  let success = getRandomArbitrary(0, 10) + player.stats.spd / 10;

  if (success >= 8) {
    addToEventLog(`You successfully run away from ${enemy.name}.`);
    removeEnemy();
    window.location = '/world_map/';
  } else {
    addToBattleLog('You fail to get away.');
  }
  renderBattle();
}

function victory() {
  const enemy = getEnemy();
  const player = getPlayer();

  player.exp += enemy.exp;
  setPlayer(player);
  addToEventLog(
    `You've defeated the ${enemy.name}, and earned ${enemy.exp} experience.`,
  );
  removeEnemy();
  window.location = '/world_map/';
}
