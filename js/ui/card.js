export function makeCard(f, term) {
  const esc = s => s ? s.replace(/[&<>]/g, t => ({'&':'&amp;','<':'&lt;','>':'&gt;'}[t])) : '';
  
  const hi = s => {
    const txt = esc(s);
    if (!term) return txt;
    const re = new RegExp(`(${term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
    return txt.replace(re, '<mark class="hit">$1</mark>');
  };

  return `
    <div class="card" id="card-${f.id}" onclick="window.locateOnMap('${f.id}')">
      <div class="card-header">
        <span class="card-title">${hi(f.region)}</span>
        <span class="card-pill">${f.category}</span>
      </div>
      <div class="card-body">
        <div><strong>产业：</strong>${hi(f.industry)}</div>
        ${f.note ? `<div class="card-note">${hi(f.note)}</div>` : ''}
      </div>
    </div>
  `;
}