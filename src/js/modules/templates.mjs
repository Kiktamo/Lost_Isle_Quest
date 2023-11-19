export function headerTemplate(){

}

export function footerTemplate(){

}

export function itemTemplate(item){

}

export function battleTemplate(monster){

}

export function mapTileTemplate(row){
    var mapRow = '';

    row.forEach(tile => {
        mapRow += `<li class="tile" data-x="${tile.position.x}" data-y="${tile.position.y}">${tile.position.x}, ${tile.position.y}</li>`
    });
    return mapRow;
}

export function statsTemplate(player){
    
}

export function inventoryTemplate(player){

}

export function endScreenTemplate(gameover = true){

}

