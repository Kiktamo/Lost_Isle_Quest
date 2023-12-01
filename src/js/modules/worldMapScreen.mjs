import {
  qs,
  getLocalStorage,
  setLocalStorage,
  renderListWithTemplate,
  getData,
  addToEventLog,
} from './utils.mjs';
import { mapTileTemplate, eventLogTemplate } from './templates.mjs';

const player = getLocalStorage('player');
const selector = '.map';
const maxSize = 8;

export default async function renderMap() {
  const mapList = qs(selector);
  var map = getLocalStorage('map');

  if (!map) {
    map = generateMap();
    map = await chooseTileType(map);
    spawnPlayer();
    addToEventLog('You awaken on the island.');
    setLocalStorage('map', map);
  }

  renderListWithTemplate(mapTileTemplate, mapList, map);

  setupTiles(mapList, selector);

  const typeHeading = qs('.tile-type');
  const currentTile = qs('.current-tile');
  typeHeading.innerHTML = `: ${currentTile.dataset.name}`;

  displayEvents();
}

function generateMap() {
  const map = [];

  for (let x = 0; x < maxSize; x++) {
    const row = [];

    for (let y = 0; y < maxSize; y++) {
      const tile = {
        position: {
          x: x,
          y: y,
        },
      };
      row.push(tile);
    }

    map.push(row);
  }

  return map;
}

async function chooseTileType(map) {
  const tileTypes = await getData('mapTiles');
  const randomSelection = (num, min, max) =>
    Math.min(Math.max(Math.floor(Math.random() * num), min), max);

  map.forEach((row) => {
    row.forEach((tile) => {
      if (
        tile.position.x == 0 ||
        tile.position.y == 0 ||
        tile.position.x == maxSize - 1 ||
        tile.position.y == maxSize - 1
      ) {
        tile.type = tileTypes.find((tileType) => tileType.type === 'WATER');
      } else {
        let adjacentSelection;
        let adjacentTile1 = map[tile.position.x - 1][tile.position.y];
        let adjacentTile2 = map[tile.position.x][tile.position.y - 1];
        if (tile.position.x == maxSize - 2 || tile.position.y == maxSize - 2) {
          let adjacentTile3 = map[0][0];
          let adjacentSelection1 = adjacentTile1.type.allowed_adjacent.filter(
            (value) => adjacentTile2.type.allowed_adjacent.includes(value),
          );
          adjacentSelection = adjacentSelection1.filter((value) =>
            adjacentTile3.type.allowed_adjacent.includes(value),
          );
        } else {
          adjacentSelection = adjacentTile1.type.allowed_adjacent.filter(
            (value) => adjacentTile2.type.allowed_adjacent.includes(value),
          );
        }
        let randomAdjacent =
          adjacentSelection[
            randomSelection(
              adjacentSelection.length,
              0,
              adjacentSelection.length,
            )
          ];
        tile.type = tileTypes.find(
          (tileType) => tileType.id === randomAdjacent,
        );
      }
    });
  });

  return map;
}

function setupTiles(mapList, selector) {
  const tiles = mapList.getElementsByClassName('tile');
  const adjacentTiles = [];

  for (const tile of tiles) {
    if (
      tile.dataset.x == player.position.x &&
      tile.dataset.y == player.position.y
    ) {
      tile.classList.add('current-tile');
    }

    if (
      Math.abs(tile.dataset.x - player.position.x) <= 1 &&
      Math.abs(tile.dataset.y - player.position.y) <= 1 &&
      !tile.classList.contains('current-tile') &&
      tile.dataset.type != 'WATER'
    ) {
      tile.classList.add('adjacent-tile');
      adjacentTiles.push(tile);
    }

    adjacentTiles.forEach((tile) => {
      tile.addEventListener('click', handleMove);
    });
  }
}

function handleMove() {
  const position = { x: this.dataset.x, y: this.dataset.y };
  const tileName = this.dataset.name;
  movePlayer(position, tileName);
}

function spawnPlayer() {
  player.position = { x: 1, y: 1 };
  setLocalStorage('player', player);
}

function movePlayer(position, tileName) {
  player.position = position;
  setLocalStorage('player', player);
  addToEventLog(`You move to ${tileName}`);

  renderMap();
}

function displayEvents() {
  const events = qs('.events');
  const eventsLog = getLocalStorage('events');

  renderListWithTemplate(eventLogTemplate, events, eventsLog);
}
