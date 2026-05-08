import { map } from '../map/map.js';

const drawerEl = document.getElementById('drawer');
const handleEl = document.getElementById('drawer-handle');
const backdropEl = document.getElementById('drawer-backdrop');
const closeEl = document.getElementById('drawer-close');

let isOpen = false;

function open() {
  drawerEl.classList.add('open');
  backdropEl.classList.add('active');
  handleEl.style.display = 'none';
  isOpen = true;
  map.invalidateSize();
}

function close() {
  drawerEl.classList.remove('open');
  backdropEl.classList.remove('active');
  handleEl.style.display = '';
  isOpen = false;
  map.invalidateSize();
}

function toggle() {
  isOpen ? close() : open();
}

export function initDrawer() {
  handleEl.addEventListener('click', open);
  closeEl.addEventListener('click', close);
  backdropEl.addEventListener('click', close);
}

export { open as openDrawer, close as closeDrawer, toggle as toggleDrawer };

// 暴露到 window 供 panel.js / markers.js 调用（避免循环依赖）
window.closeDrawer = close;
window.openDrawer = open;
