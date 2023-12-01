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

export function itemTemplate(item) {}

export function battleTemplate(monster) {}

export function mapTileTemplate(row) {
  let mapRow = '';

  row.forEach((tile) => {
    let color = '';
    if (tile.type) {
      color = tile.type.color_code;
    }
    mapRow += `<li class="tile" style="background-color: ${color};" data-x="${tile.position.x}" data-y="${tile.position.y}" data-name="${tile.type.name}" data-type="${tile.type.type}"><img style="background-color: ${color}; width: 80%;" src="../images/${tile.type.id}.png"></li>`;
  });
  return mapRow;
}

export function statsTemplate(player) {}

export function inventoryTemplate(player) {}

export function endScreenTemplate(gameover = true) {}

export function eventLogTemplate(event) {
  return `<li class="event">${event}</li>`;
}
