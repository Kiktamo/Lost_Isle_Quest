import {
  qs,
  renderListWithTemplate,
  getData,
  getRandomArbitrary,
} from './utils.mjs';
import { mapTileTemplate } from './templates.mjs';
import {
  addToEventLog,
  displayEvents,
  getMap,
  getPlayer,
  setMap,
  setPlayer,
} from './dataManagment.mjs';

const selector = '.map';
const maxSize = 8;

export default async function renderMap() {
  const player = getPlayer();
  const mapList = qs(selector);
  let map = getMap();

  if (!map) {
    map = generateMap();
    map = await chooseTileType(map);
    spawnPlayer();
    addToEventLog('You awaken on the island.');
    setMap(map);
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

  map[maxSize - 2][maxSize - 2].type = tileTypes.find(
    (tileType) => tileType.id === 'dungeon',
  );
  map[maxSize / 2 - 1][maxSize / 2 - 1].type = tileTypes.find(
    (tileType) => tileType.id === 'town',
  );

  return map;
}

function setupTiles(mapList) {
  const player = getPlayer();
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
  const player = getPlayer();
  player.position = { x: 1, y: 1 };
  setPlayer(player);
}

async function movePlayer(position, tileName) {
  const player = getPlayer();
  player.position = position;
  setPlayer(player);

  const event = await triggerEvent();

  if (!event) {
    addToEventLog(`You move to ${tileName}`);
  }

  renderMap();
}

async function triggerEvent() {
  const player = getPlayer();

  const event = getRandomArbitrary(1, 10);

  switch (event) {
    case 1:
    case 2:
    case 3:
      const gold = getRandomArbitrary(3, 20);
      addToEventLog(`You've found ${gold} gold`);
      player.gold += gold;
      setPlayer(player);
      return true;
    case 4:
    case 5:
      const items = await getData('items');

      const item = items.find((item) => item.id === 'health_potion');
      const quantity = getRandomArbitrary(1, 3);

      const existingItem = player.inventory.find(
        (existingItem) => existingItem.id === item.id,
      );

      addToEventLog(`You've found ${item.name} x${quantity}`);

      if (existingItem) {
        existingItem.quantity += quantity;
      } else {
        item.quantity = quantity;
        player.inventory.push(item);
      }

      setPlayer(player);
      return true;
    case 6:
      const monster = 'test';
      addToEventLog(`You've ran into ${monster}`);
      window.location = `/battle/index.html?enemy=${monster}`;
      return true;
    default:
      return false;
  }
}
