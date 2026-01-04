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

/**
 * 全局定位联动函数
 * @param {string} id - 产业ID
 * @param {boolean} isFromMap - 是否是由地图点击触发的？
 */
window.locateOnMap = function(id, isFromMap = false) {
  const latlng = getMarkerLatLng(id);
  
  // 1. 地图动作
  if (latlng && !isFromMap) {
    // 只有点击卡片时，地图才飞；点击地图点时，地图不动
    const currentZoom = map.getZoom();
    const targetZoom = currentZoom >= FOCUS_ZOOM ? currentZoom : FOCUS_ZOOM;

    map.flyTo(latlng, targetZoom, {
      animate: true,
      duration: 1.2,
      easeLinearity: 0.25
    });
  }

  // 2. 点位动作 (无论哪边点击，点位都闪烁)
  highlightMarker(id);

  // 3. 卡片动作 (高亮 + 滚动)
  document.querySelectorAll('.card.active-card').forEach(el => el.classList.remove('active-card'));
  
  const card = document.getElementById(`card-${id}`);
  if (card) {
    card.classList.add('active-card');
    
    // 功能：如果点击地图点，侧边栏自动滚到对应卡片
    if (isFromMap) {
      card.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }
};