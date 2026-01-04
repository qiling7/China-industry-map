import { DATA, COORDS } from '../data/index.js';

// 把原始 DATA 打散并按【地区】聚合
export function buildFeatures() {
  const regionMap = new Map();

  DATA.forEach((raw) => {
    // 处理多个地区的情况 "新疆和田、新疆且末" -> ["新疆和田", "新疆且末"]
    const regions = raw.region.split(/[、，,\/]+/g).map(s => s.trim()).filter(Boolean);
    
    regions.forEach(r => {
      const coord = COORDS[r];
      if (!coord) return;

      if (!regionMap.has(r)) {
        regionMap.set(r, {
          id: r, // ID直接用地名，保证唯一
          region: r,
          lng: coord[0],
          lat: coord[1],
          industries: []
        });
      }

      const record = regionMap.get(r);
      record.industries.push({
        name: raw.industry,
        category: raw.category,
        note: raw.note || ''
      });
    });
  });

  return Array.from(regionMap.values());
}

export function filterFeatures(features, { q, cat }) {
  const term = (q || '').trim();
  const re = term ? new RegExp(term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i') : null;

  return features.filter(f => {
    //筛选出符合条件的产业子项
    const matchedIndustries = f.industries.filter(ind => {
      // 如果选了分类，匹配分类
      if (cat && ind.category !== cat) return false;
      // 如果没搜词，只看分类匹配
      if (!re) return true;
      // 如果搜了词，匹配 地区名 OR 产业名 OR 备注
      return re.test(f.region) || re.test(ind.name) || re.test(ind.note);
    });

    if (matchedIndustries.length > 0) {
      f._displayIndustries = matchedIndustries;
      return true;
    }
    return false;
  });
}