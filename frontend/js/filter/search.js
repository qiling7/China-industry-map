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