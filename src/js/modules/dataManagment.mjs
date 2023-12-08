import {
  getLocalStorage,
  setLocalStorage,
  qs,
  renderListWithTemplate,
  clearLocalStorage,
} from './utils.mjs';
import { eventLogTemplate } from './templates.mjs';

export function getMap() {
  return getLocalStorage('map');
}

export function setMap(map) {
  setLocalStorage('map', map);
}

export function getEnemy() {
  return getLocalStorage('enemy');
}

export function removeEnemy() {
  clearLocalStorage('enemy');
}

export function setEnemy(enemy) {
  if (enemy != null) {
    if (enemy.health < 0) {
      enemy.health = 0;
    }
  }

  setLocalStorage('enemy', enemy);
}

export function getPlayer() {
  return getLocalStorage('player');
}

export function setPlayer(player) {
  if (player.hp <= 0) {
    addToEventLog('You have perished...');
    window.location = '/game_over/';
  }

  if (player.hp > player.maxHp) {
    player.hp = player.maxHp;
  }
  if (player.mp > player.maxMp) {
    player.mp = player.maxMp;
  }

  setLocalStorage('player', player);
}

export function initializePlayer(player) {
  const newPlayer = {
    name: player.name,
    gold: 0,
    level: 1,
    exp: 0,
    maxHp: 20,
    maxMp: 20,
    hp: 20,
    mp: 20,
    stats: { str: player.str, spd: player.spd, int: player.int },
    inventory: [],
    equipment: [],
    position: { x: 1, y: 1 },
  };

  setLocalStorage('player', newPlayer);
  clearLocalStorage('map');
  clearLocalStorage('events');
}

export function addToEventLog(message) {
  let eventsLog = getLocalStorage('events');

  if (!eventsLog) {
    eventsLog = [];
  }

  while (eventsLog.length >= 5) {
    eventsLog.shift();
  }

  eventsLog.push(message);

  setLocalStorage('events', eventsLog);
}

export function displayEvents() {
  const events = qs('.events');
  const eventsLog = getLocalStorage('events');

  renderListWithTemplate(eventLogTemplate, events, eventsLog);
}
