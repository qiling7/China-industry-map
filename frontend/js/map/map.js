import { TILE_URL, ATTRIBUTION, DEFAULT_VIEW } from '../config.js';

export const map = L.map('map', { minZoom: 3, maxZoom: 12, zoomSnap: 0.5 });
L.tileLayer(TILE_URL, { attribution: ATTRIBUTION, maxZoom: 19 }).addTo(map);
map.setView(DEFAULT_VIEW.center, DEFAULT_VIEW.zoom);

export const markersLayer = L.layerGroup().addTo(map);