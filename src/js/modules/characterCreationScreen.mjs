import { qs } from "./utils.mjs";

const maxStats = 20;

export default async function setupCharacterCreation() {

    updatePool();

    const statsFields = document.querySelectorAll('.stats');

    statsFields.forEach(field => {
        field.setAttribute('max', maxStats - getAllocated() + field.value);

        field.addEventListener('change', updateStats); 
      });

}

function getAllocated() {
    const statsFields = document.querySelectorAll('.stats');

    let points = 0;

    statsFields.forEach(field => {
        points += parseInt(field.value);
      });

    return points;
}

function updatePool(){
    const statPool = qs('#pool');
    statPool.innerHTML = maxStats - getAllocated();
}

function updateStats(){
    updatePool();
    this.setAttribute('max', (maxStats - getAllocated()) + this.value);

    if (parseInt(this.value) > maxStats){
        this.value = maxStats;
    }
}