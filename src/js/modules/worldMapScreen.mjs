import {
    qs,
    getLocalStorage,
    setLocalStorage,
    renderListWithTemplate
} from "./utils.mjs";
import {
    mapTileTemplate
} from "./templates.mjs";

const player = getLocalStorage('player')

export default function renderMap(selector) {
    const mapList = qs(selector);
    var map = getLocalStorage('map');

    if (!map) {
        map = generateMap();
        setLocalStorage('map', map);
    }

    renderListWithTemplate(mapTileTemplate, mapList, map)

    setupTiles(mapList, selector);

}

function generateMap() {
    const maxSize = 8;
    const map = [];

    for (let x = 0; x < maxSize; x++) {
        const row = [];

        for (let y = 0; y < maxSize; y++) {
            const tile = {
                position: {
                    x: x,
                    y: y
                }
            };
            row.push(tile);
        }

        map.push(row);

    }

    return map;

}

function setupTiles(mapList, selector) {
    const tiles = mapList.getElementsByClassName('tile');
    const adjacentTiles = []

    for (const tile of tiles) {
        if (tile.dataset.x == player.position.x && tile.dataset.y == player.position.y) {
            tile.classList.add('current-tile');
        }

        if (Math.abs(tile.dataset.x - player.position.x) <= 1 && Math.abs(tile.dataset.y - player.position.y) <= 1 &&  !tile.classList.contains('current-tile')) {
            tile.classList.add('adjacent-tile');
            adjacentTiles.push(tile)
        }

        adjacentTiles.forEach(tile => {
            tile.addEventListener("click", function () {
                const position = {'x': tile.dataset.x, 'y': tile.dataset.y}
                movePlayer(position, selector)
              });
        });

    };

    
}

function movePlayer(position, selector) {
    player.position = position;
    setLocalStorage('player', player);

    renderMap(selector);
}