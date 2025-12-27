export const DEFAULT_VIEW = { center: [35, 105], zoom: 4 };
export const TILE_URL = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
export const ATTRIBUTION = '© OpenStreetMap Contributors';

export const FOCUS_ZOOM = 6;

export const CATEGORY_COLORS = {
  '宝石矿产': { fill: '#0ea5e9', border: '#0369a1' }, // 亮蓝
  '工艺雕刻': { fill: '#10b981', border: '#047857' }, // 翠绿
  '轻工纺织': { fill: '#f59e0b', border: '#b45309' }, // 亮橙
  '轻工制造': { fill: '#ef4444', border: '#b91c1c' }, // 大红
  '现代制造': { fill: '#8b5cf6', border: '#6d28d9' }, // 亮紫
  '农业花卉': { fill: '#22c55e', border: '#15803d' }  // 草绿
};

// 默认点位样式
export const MARKER_STYLE = {
  radius: 7,          
  weight: 2,          
  fillOpacity: 0.85,  
  opacity: 1          
};