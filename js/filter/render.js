import { initMarkers, updateMarkersStyle } from '../map/markers.js';
import { filterFeatures } from './search.js';
import { makeCard } from '../ui/card.js';
import { map } from '../map/map.js';
import { DEFAULT_VIEW } from '../config.js';

const resultsEl = document.getElementById('results');
const statsEl   = document.getElementById('stats');

let allFeatures = [];

export function initRender(features) {
  allFeatures = features;
  initMarkers(allFeatures);
  render({ q: '', cat: '' });
}

export function render({ q, cat }) {
  const filtered = filterFeatures(allFeatures, { q, cat });
  const filteredIDs = filtered.map(f => f.id);

  // 1. 渲染列表
  resultsEl.innerHTML = filtered.length > 0 
    ? filtered.map(f => makeCard(f, q)).join('')
    : `<div style="text-align:center; color:#999; padding:20px;">未找到相关产业</div>`;

  // 2. 更新地图样式
  updateMarkersStyle(filteredIDs);

  // 3. 更新统计
  statsEl.textContent = `当前显示：${filtered.length} 条记录（共 ${allFeatures.length} 条）`;

  // 4. 搜索时重置视野 (防止点位跑到地图外)
  // 只有当有搜索内容，且不是初始化时(initRender也会调用render)，才重置
  // 判断：如果 filteredIDs 数量少于总数，说明发生了筛选
  if (filtered.length < allFeatures.length) {
      map.setView(DEFAULT_VIEW.center, DEFAULT_VIEW.zoom);
  }
}