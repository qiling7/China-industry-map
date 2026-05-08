import { render } from '../filter/render.js';
import { highlightMarker, getMarkerLatLng } from '../map/markers.js';
import { map } from '../map/map.js';
import { FOCUS_ZOOM, DEFAULT_VIEW } from '../config.js';

const qEl = document.getElementById('q');
const catEl = document.getElementById('cat');
const clearEl = document.getElementById('clear');

export function bindPanel() {
  const doSearch = () => render({ q: qEl.value.trim(), cat: catEl.value });
  
  qEl.addEventListener('input', doSearch);
  catEl.addEventListener('change', doSearch);
  clearEl.addEventListener('click', () => {
    qEl.value = '';
    catEl.value = '';
    doSearch();
    map.setView(DEFAULT_VIEW.center, DEFAULT_VIEW.zoom);
  });
}

export function bindDrawerSearch() {
  const drawerQ = document.getElementById('drawer-q');
  const drawerCat = document.getElementById('drawer-cat');
  const drawerClear = document.getElementById('drawer-clear');
  const drawerResults = document.getElementById('drawer-results');
  const drawerStats = document.getElementById('drawer-stats');

  const doSearch = () => {
    const q = drawerQ.value.trim();
    const cat = drawerCat.value;
    render({ q, cat });

    // 同步桌面端搜索控件状态
    document.getElementById('q').value = q;
    document.getElementById('cat').value = cat;

    // 将渲染输出重定向到抽屉
    const deskResults = document.getElementById('results');
    const deskStats = document.getElementById('stats');
    if (drawerResults && deskResults) {
      drawerResults.innerHTML = deskResults.innerHTML;
    }
    if (drawerStats && deskStats) {
      drawerStats.textContent = deskStats.textContent;
    }
  };

  drawerQ.addEventListener('input', doSearch);
  drawerCat.addEventListener('change', doSearch);
  drawerClear.addEventListener('click', () => {
    drawerQ.value = '';
    drawerCat.value = '';
    doSearch();
  });

  // 初始同步（页面加载后抽屉已有渲染好的桌面结果）
  if (drawerResults && document.getElementById('results')) {
    drawerResults.innerHTML = document.getElementById('results').innerHTML;
    drawerStats.textContent = document.getElementById('stats').textContent;
  }
}

/**
 * 全局定位联动函数
 * @param {string} id
 * @param {boolean} isFromMap
 */
window.locateOnMap = function(id, isFromMap = false) {
  const latlng = getMarkerLatLng(id);
  
  // 1. 地图动作
  if (latlng && !isFromMap) {
    const currentZoom = map.getZoom();
    const targetZoom = currentZoom >= FOCUS_ZOOM ? currentZoom : FOCUS_ZOOM;

    map.flyTo(latlng, targetZoom, {
      animate: true,
      duration: 1.2,
      easeLinearity: 0.25
    });
  }

  // 2. 点位动作
  highlightMarker(id);

  // 3. 卡片动作
  document.querySelectorAll('.card.active-card').forEach(el => el.classList.remove('active-card'));

  const card = document.getElementById(`card-${id}`);
  if (card) {
    card.classList.add('active-card');

    if (isFromMap) {
      card.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }

  // 手机端：卡片点击后关闭抽屉
  if (!isFromMap && window.closeDrawer) {
    window.closeDrawer();
  }
};