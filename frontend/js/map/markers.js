import { map, markersLayer } from './map.js';
import { MARKER_STYLE, CATEGORY_COLORS } from '../config.js';

let markerInstances = new Map();

function createPieHtml(industries, size) {
  const segmentSize = 100 / industries.length;
  const stops = industries.map((ind, i) => {
    const color = CATEGORY_COLORS[ind.category]?.fill || '#999';
    return `${color} ${i * segmentSize}% ${(i + 1) * segmentSize}%`;
  }).join(', ');

  return `
    <div class="mixed-marker" style="
      background: conic-gradient(${stops});
      width: ${size}px; height: ${size}px;
      border-radius: 50%;
      border: 2px solid rgba(255,255,255,0.8); 
    "></div>
  `;
}

export function initMarkers(features) {
  markersLayer.clearLayers();
  markerInstances.clear();

  features.forEach(f => {
    const list = f.industries;
    let m;

    // === 单一产业 ===
    if (list.length === 1) {
      const cat = list[0].category;
      const c = CATEGORY_COLORS[cat];
      const style = c ? { fillColor: c.fill, color: c.border } : { fillColor: '#555', color: '#333' };
      
      m = L.circleMarker([f.lat, f.lng], {
        ...MARKER_STYLE,
        ...style
      });

      m.on('mouseover', () => {
        m.openTooltip();
        m.setStyle({ radius: MARKER_STYLE.radius + 4 });
      });
      
      m.on('mouseout', () => {
        if (m.options.fillOpacity !== 1) {
           m.setStyle({ radius: MARKER_STYLE.radius });
        }
      });
      
    } 
    // === 多产业 ===
    else {
      const size = (MARKER_STYLE.radius + 1) * 2; 
      
      m = L.marker([f.lat, f.lng], { 
        icon: L.divIcon({
          className: '',
          html: createPieHtml(list, size),
          iconSize: [size, size],
          iconAnchor: [size / 2, size / 2],
        })
      });
    }

    const tooltipContent = `
      <div style="text-align:center;">
        <div style="font-weight:bold; margin-bottom:4px;">${f.region}</div>
        ${list.map(i => `<div style="font-size:11px;">
          <span style="color:${CATEGORY_COLORS[i.category]?.border || '#333'}">●</span> ${i.name}
        </div>`).join('')}
      </div>
    `;
    
    m.bindTooltip(tooltipContent, { direction: 'top', offset: [0, -8] });

    m.on('click', () => {
      highlightMarker(f.id);
      const card = document.getElementById(`card-${f.id}`);
      if (card) {
        card.scrollIntoView({ behavior: 'smooth', block: 'center' });
        document.querySelectorAll('.card.active-card').forEach(el => el.classList.remove('active-card'));
        card.classList.add('active-card');
      }
    });

    markersLayer.addLayer(m);
    markerInstances.set(f.id, m);
  });
}

export function updateMarkersStyle(filteredIDs) {
  const targetSet = new Set(filteredIDs);
  const isSearching = filteredIDs.length > 0 && filteredIDs.length < markerInstances.size;

  markerInstances.forEach((marker, id) => {
    const isPie = !marker.setStyle; 

    if (isSearching) {
      if (targetSet.has(id)) {
        if (isPie) marker.setOpacity(1);
        else {
          marker.setStyle({ fillOpacity: 1, opacity: 1, weight: MARKER_STYLE.weight });
          marker.bringToFront();
        }
      } else {
        if (isPie) marker.setOpacity(0.35);
        else marker.setStyle({ fillOpacity: 0.35, opacity: 0.2, weight: 0 });
      }
    } else {
      if (isPie) marker.setOpacity(1);
      else marker.setStyle({ 
        fillOpacity: MARKER_STYLE.fillOpacity, 
        opacity: MARKER_STYLE.opacity, 
        weight: MARKER_STYLE.weight 
      });
    }
  });
}

export function highlightMarker(id) {
  const m = markerInstances.get(id);
  if (!m) return;

  const isPie = !m.setStyle;

  if (isPie) {
    const originalIcon = m.getIcon();
    const flashIcon = L.divIcon({
      className: '',
      html: `<div style="background:#fff; width:24px; height:24px; border-radius:50%; border:3px solid #333; box-shadow:0 0 10px white;"></div>`,
      iconSize: [24, 24],
      iconAnchor: [12, 12]
    });
    m.setIcon(flashIcon);
    m.setZIndexOffset(2000);
    setTimeout(() => {
      m.setIcon(originalIcon);
      m.setZIndexOffset(0);
    }, 1000);
  } else {
    const originalStyle = { ...m.options };
    m.setStyle({ 
      color: '#000', weight: 3, fillColor: '#fff',  
      fillOpacity: 1, opacity: 1, 
      radius: originalStyle.radius + 5
    });
    m.bringToFront();
    setTimeout(() => {
      m.setStyle({
        color: originalStyle.color,
        weight: originalStyle.weight,
        fillColor: originalStyle.fillColor,
        fillOpacity: originalStyle.fillOpacity,
        radius: MARKER_STYLE.radius
      });
    }, 1000);
  }
}

export function getMarkerLatLng(id) {
  return markerInstances.get(id)?.getLatLng();
}