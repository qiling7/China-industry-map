import { DATA, COORDS } from '../data/index.js';

// 把原始 DATA 打散成“一条产业+一个地区=一条特征”
export function buildFeatures() {
  const features = [];
  DATA.forEach((raw, idx) => {
    const regions = raw.region.split(/[、，,\/]+/g).map(s => s.trim()).filter(Boolean);
    regions.forEach(r => {
      const coord = COORDS[r];
      if (!coord) return; // 坐标表里没有就跳过
      features.push({
        id: `${idx}-${r}`,
        region: r,
        industry: raw.industry,
        category: raw.category,
        note: raw.note || '',
        lng: coord[0],
        lat: coord[1]
      });
    });
  });
  return features;
}

// 过滤
export function filterFeatures(features, { q, cat }) {
  const term = (q || '').trim();
  const re = term ? new RegExp(term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i') : null;
  return features.filter(f => {
    if (cat && f.category !== cat) return false;
    if (!re) return true;
    return re.test(f.region) || re.test(f.industry) || re.test(f.note);
  });
}