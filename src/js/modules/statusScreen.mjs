import {
  qs,
  renderWithTemplate,
  renderListWithTemplate,
  setClick,
  toggleModal,
} from './utils.mjs';
import {
  statsTemplate,
  inventoryTemplate,
  levelUpTemplate,
} from './templates.mjs';
import { getPlayer, setPlayer } from './dataManagment.mjs';

export default async function renderStatusScreen() {
  renderStats();
  renderInventory();
}

function renderStats() {
  const player = getPlayer();
  const stats = qs('.stats-sheet');
  renderWithTemplate(statsTemplate, stats, player, setupLevelUp);
}

function renderInventory() {
  const player = getPlayer();
  const inventory = qs('.inventory-list');
  if (player.inventory.length > 0) {
    renderListWithTemplate(inventoryTemplate, inventory, player.inventory);
    setTimeout(setupInventoryButtons, 500);
  } else {
    inventory.innerHTML = 'You have no items.';
  }
}

function setupInventoryButtons() {
  const usableItems = document.querySelectorAll('.consumable-button');

  if (usableItems && usableItems.length > 0) {
    usableItems.forEach((item) => {
      item.addEventListener('click', useItem);
    });
  }
}

function setupLevelUp() {
  const levelUpButton = qs('.level-up');

  if (levelUpButton) {
    setClick('.level-up', levelUp);
  }
}

async function useItem() {
  const player = getPlayer();

  const usableItem = player.inventory.find(
    (item) => item.id === this.dataset.id,
  );

  if (usableItem.use == 'HEALING') {
    player[usableItem.target] += usableItem.amount;
  }

  usableItem.quantity -= 1;
  if (usableItem.quantity <= 0) {
    player.inventory.filter((item) => item.id != usableItem.id);
  }

  setPlayer(player);
  renderInventory();
}

function levelUp() {
  const player = getPlayer();
  toggleModal(levelUpTemplate, player, setupStatButtons);
}

function setupStatButtons() {
  const statButtons = document.querySelectorAll('.stat-button');
  if (statButtons) {
    statButtons.forEach((btn) => {
      btn.addEventListener('click', completeLevelUp);
    });
  }
}

function completeLevelUp() {
  const stat = this.dataset.stat;
  const player = getPlayer();

  player[stat] += 1;
  player.level += 1;
  player.maxHp += 20;
  player.maxMp += 20;
  player.hp = player.maxHp;
  player.mp = player.maxMp;
  setPlayer(player);
  toggleModal();
  renderStats();
}
