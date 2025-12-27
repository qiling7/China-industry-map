import { TILE_URL, ATTRIBUTION, DEFAULT_VIEW } from '../config.js';

// 创建地图实例，单例导出
export const map = L.map('map', { minZoom: 3, maxZoom: 12, zoomSnap: 0.5 });
L.tileLayer(TILE_URL, { attribution: ATTRIBUTION, maxZoom: 19 }).addTo(map);
map.setView(DEFAULT_VIEW.center, DEFAULT_VIEW.zoom);

// 所有 marker 都丢进这一层，方便一键清空
export const markersLayer = L.layerGroup().addTo(map);