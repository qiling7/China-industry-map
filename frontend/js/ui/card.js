import { CATEGORY_COLORS } from '../config.js';

export function makeCard(f, term) {
  const esc = s => s ? s.replace(/[&<>"']/g, t => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#x27;'
  }[t])) : '';
    
  const hi = s => {
    const txt = esc(s);
    if (!term) return txt;
    const re = new RegExp(`(${term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
    return txt.replace(re, '<mark class="hit">$1</mark>');
  };

  const list = f._displayIndustries || f.industries;

  const industriesHTML = list.map(ind => {
    const colorStyle = CATEGORY_COLORS[ind.category] 
      ? `background:${CATEGORY_COLORS[ind.category].fill}20; color:${CATEGORY_COLORS[ind.category].border}` 
      : 'background:#eee; color:#666';

    return `
      <div style="margin-top:10px; padding-top:10px; border-top:1px dashed #eee;">
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:4px;">
          <strong style="font-size:15px;">${hi(ind.name)}</strong>
          <span style="font-size:11px; padding:1px 6px; border-radius:4px; ${colorStyle}">${ind.category}</span>
        </div>
        ${ind.note ? `<div class="card-note">${hi(ind.note)}</div>` : ''}
      </div>
    `;
  }).join('');

  return `
    <div class="card" id="card-${f.id}" onclick="window.locateOnMap('${f.id}')">
      <div class="card-header" style="border-bottom:none; margin-bottom:0;">
        <span class="card-title" style="font-size:17px;">${hi(f.region)}</span>
        <span style="font-size:12px; color:#999;">共 ${f.industries.length} 个产业</span>
      </div>
      <div class="card-body">
        ${industriesHTML}
      </div>
    </div>
  `;
}