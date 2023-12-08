export function headerTemplate(data) {
  let header =
    '<img class="logo" src="../images/logo.svg" alt="Lost Isle Quest Logo"><h1>Lost Isle Quest</h1>';
  if (data) {
    header += data;
  }
  return header;
}

export function footerTemplate(data) {
  let footer = `Lost Isle Quest ${new Date().getFullYear()} &copy; All assets used are either owned by the developer or in the Public Domain.`;
  if (data) {
    footer += data;
  }
  return footer;
}

export function battleTemplate(battle) {
  let battleView = `<img class='enemy-img' src='../images/${battle.enemy.id}.png' alt='${battle.enemy.name}'>
  <ul class='turn-log'>`;
  battle.log.forEach((message) => {
    battleView += `<li>${message}</li>`;
  });
  battleView += `</ul> 
  <div class='player-stats'><p>Name: ${battle.player.name}</p><p>HP: ${battle.player.hp}/${battle.player.maxHp}</p></div>
  <div class='enemy-stats'><p>Name: ${battle.enemy.name}</p><p>HP: ${battle.enemy.health}</p></div>`;
  if (battle.enemy.health <= 0) {
    battleView += '<button class="victory-button">You Win</button>';
  } else {
    battleView +=
      '<ul class="battle-commands"><li><button class="attack">Attack</button></li><li><button class="items">Items</li></button><li><button class="run">Run</button></li></ul>';
  }
  return battleView;
}

export function mapTileTemplate(row) {
  let mapRow = '';

  row.forEach((tile) => {
    let color = '';
    if (tile.type) {
      color = tile.type.color_code;
    }
    mapRow += `<li class="tile" style="background-color: ${color};" data-x="${tile.position.x}" data-y="${tile.position.y}" data-name="${tile.type.name}" data-type="${tile.type.type}"><img style="background-color: ${color};" src="../images/${tile.type.id}.png"></li>`;
  });
  return mapRow;
}

export function statsTemplate(player) {
  let stats = `<ul>
  <li><img src="../images/player.png" alt="Player Character Icon"></li>
  <li>Gold: ${player.gold}</li>
  <li>Level: ${player.level}</li>`;

  if (player.exp >= player.level * 100) {
    stats += `<li>Experience: ${player.exp}/${
      player.level * 100
    } <button class='level-up'>Level Up</button></li>`;
  } else {
    stats += `<li>Experience: ${player.exp}/${player.level * 100}</li>`;
  }
  stats += `<li>Health: ${player.hp}/${player.maxHp}</li>
  <li>Magic: ${player.mp}/${player.maxMp}</li>
  <li>Strength: ${player.stats.str}</li>
  <li>Speed: ${player.stats.spd}</li>
  <li>Intelligence: ${player.stats.int}</li>
  </ul>
  `;

  return stats;
}

export function inventoryTemplate(item) {
  let itemDisplay = `<li><img src='../images/${item.id}.png' alt='${item.name}'><p>${item.description}</p><p>Quantity:${item.quantity}</p>`;
  if (item.type === 'CONSUMABLE') {
    itemDisplay += `<button class='consumable-button' data-id='${item.id}'>Use</button>`;
  }
  itemDisplay += '</li>';
  return itemDisplay;
}

export function endScreenTemplate(gameover = true) {}

export function eventLogTemplate(event) {
  return `<li class="event">${event}</li>`;
}

export function levelUpTemplate(player) {
  return `<h2>Level ${player.level + 1}</h2>
  <p>Please choose a stat to increase.</p>
  <button class='stat-button' data-stat='str'>Strength</button>
  <button class='stat-button' data-stat='spd'>Speed</button>
  <button class='stat-button' data-stat='int'>Intelligence</button>`;
}
