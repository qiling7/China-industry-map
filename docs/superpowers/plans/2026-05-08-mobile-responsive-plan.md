# 移动端响应式适配 — 实施计划

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 为手机端（<768px）实现全屏地图 + 左侧抽屉面板的新布局，桌面端保持现有布局不变。

**Architecture:** 纯 CSS 媒体查询切换布局。新增 `drawer.js` 模块管理抽屉开关逻辑和触屏手势，与现有 `panel.js`/`render.js`/`markers.js` 通过已有接口协作。后端不改动。

**Tech Stack:** Vanilla JS (ES6 Modules), CSS3 Media Queries, Leaflet 1.9.4

---

### Task 1: HTML — 添加手机端抽屉 DOM 结构

**Files:**
- Modify: `frontend/index.html`

- [ ] **Step 1: 在 `#app` 内增加抽屉把手和面板的 HTML**

在 `<div id="app">` 内部、`<div id="map">` 之后，加入以下结构：

```html
<!-- 手机端：抽屉把手 -->
<div id="drawer-handle">
  <span class="handle-text">索引 &#9654;</span>
</div>

<!-- 手机端：左侧抽屉面板 -->
<nav id="drawer">
  <div class="drawer-header">
    <h3>产业集群索引</h3>
    <button id="drawer-close" aria-label="关闭面板">&times;</button>
  </div>
  <div class="drawer-search">
    <input id="drawer-q" type="search" placeholder="搜索：珍珠 / 深圳 / 袜子 ..." />
    <select id="drawer-cat">
      <option value="">全部分类</option>
      <option value="宝石矿产">宝石矿产</option>
      <option value="工艺雕刻">工艺雕刻</option>
      <option value="文体教娱">文体教娱</option>
      <option value="纺织服饰">纺织服饰</option>
      <option value="日用百货">日用百货</option>
      <option value="电子机电">电子机电</option>
      <option value="农食特产">农食特产</option>
    </select>
    <button id="drawer-clear">重置</button>
  </div>
  <div id="drawer-results"></div>
  <div id="drawer-stats" class="drawer-footer"></div>
</nav>

<!-- 手机端：面板遮罩（面板展开时点击地图区域关闭） -->
<div id="drawer-backdrop"></div>
```

- [ ] **Step 2: 验证 HTML 结构合法，在浏览器中打开确认无 DOM 解析错误**

在桌面端用浏览器打开 `frontend/index.html`，F12 控制台无 HTML 解析报错。新增元素在桌面端不可见（未添加 CSS）。

- [ ] **Step 3: Commit**

```bash
git add frontend/index.html
git commit -m "feat: add mobile drawer DOM structure"
```

---

### Task 2: CSS — 桌面端隐藏手机元素 + 手机端媒体查询布局

**Files:**
- Modify: `frontend/css/style.css`

- [ ] **Step 1: 桌面端默认隐藏手机元素**

在 `style.css` 现有 `#panel` 样式块之后追加：

```css
/* 手机端元素默认隐藏（桌面端） */
#drawer-handle,
#drawer,
#drawer-backdrop {
  display: none;
}
```

- [ ] **Step 2: 手机端媒体查询 — 容器与地图**

在 `style.css` 文件末尾追加媒体查询块：

```css
/* ===== 手机端布局 (< 768px) ===== */
@media (max-width: 767px) {

  /* 容器改为单列 + 相对定位 */
  #app {
    grid-template-columns: 1fr;
    position: relative;
  }

  /* 地图满屏 */
  #map {
    position: absolute;
    inset: 0;
    z-index: 1;
  }

  /* 隐藏桌面侧边栏 */
  #panel {
    display: none;
  }

  /* --- 抽屉把手 --- */
  #drawer-handle {
    display: flex;
    align-items: center;
    justify-content: center;
    position: absolute;
    left: 0;
    top: 50%;
    transform: translateY(-50%);
    z-index: 100;
    width: 28px;
    min-height: 80px;
    background: #2d3748;
    color: #fff;
    border-radius: 0 6px 6px 0;
    cursor: pointer;
    box-shadow: 2px 0 8px rgba(0,0,0,0.15);
    user-select: none;
    -webkit-tap-highlight-color: transparent;
  }

  #drawer-handle .handle-text {
    writing-mode: vertical-rl;
    font-size: 13px;
    letter-spacing: 2px;
    padding: 8px 0;
  }

  /* --- 抽屉面板 --- */
  #drawer {
    display: flex;
    flex-direction: column;
    position: absolute;
    left: 0;
    top: 0;
    bottom: 0;
    width: 75vw;
    max-width: 320px;
    z-index: 200;
    background: rgba(255, 255, 255, 0.95);
    backdrop-filter: blur(15px);
    box-shadow: 4px 0 20px rgba(0, 0, 0, 0.15);
    transform: translateX(-100%);
    transition: transform 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
  }

  #drawer.open {
    transform: translateX(0);
  }

  /* 抽屉顶部 */
  .drawer-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 16px;
    border-bottom: 1px solid rgba(0,0,0,0.08);
    flex-shrink: 0;
  }

  .drawer-header h3 {
    margin: 0;
    font-size: 16px;
    color: #2d3748;
  }

  #drawer-close {
    background: none;
    border: none;
    font-size: 24px;
    color: #718096;
    cursor: pointer;
    padding: 4px 8px;
    line-height: 1;
  }

  /* 抽屉搜索区 */
  .drawer-search {
    display: flex;
    gap: 6px;
    padding: 12px 16px;
    border-bottom: 1px solid rgba(0,0,0,0.05);
    flex-shrink: 0;
  }

  .drawer-search input {
    flex: 2;
    padding: 8px 10px;
    border: 1px solid #e2e8f0;
    border-radius: 8px;
    font-size: 16px; /* 防止 iOS 自动缩放 */
    color: #4a5568;
    outline: none;
    min-width: 0;
  }

  .drawer-search select {
    flex: 1;
    padding: 8px 6px;
    border: 1px solid #e2e8f0;
    border-radius: 8px;
    font-size: 13px;
    color: #4a5568;
    outline: none;
    background: #fff;
  }

  .drawer-search button {
    padding: 6px 10px;
    border: 1px solid #e2e8f0;
    background: #f7fafc;
    border-radius: 8px;
    cursor: pointer;
    color: #4a5568;
    font-size: 13px;
    white-space: nowrap;
  }

  /* 抽屉结果列表 */
  #drawer-results {
    flex: 1;
    overflow-y: auto;
    padding: 12px 16px;
    min-height: 0;
  }

  /* 抽屉底部统计 */
  .drawer-footer {
    flex-shrink: 0;
    padding: 10px 16px;
    border-top: 1px solid rgba(0,0,0,0.05);
    font-size: 12px;
    color: #718096;
    text-align: center;
    background: rgba(255,255,255,0.5);
  }

  /* --- 遮罩层（面板展开时点击关闭） --- */
  #drawer-backdrop {
    display: none;
    position: absolute;
    inset: 0;
    z-index: 150;
    background: rgba(0, 0, 0, 0.2);
  }

  #drawer-backdrop.active {
    display: block;
  }

  /* --- 手机端卡片加大触控区域 --- */
  #drawer-results .card {
    padding: 14px;
    margin-bottom: 10px;
  }

  /* --- 面板展开时把手滑出跟随 --- */
  #drawer.open ~ #drawer-handle {
    left: 75vw;
    transition: left 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
  }
}
```

- [ ] **Step 2: 在浏览器中打开，拖窄窗口到 < 768px 验证**

预期：桌面侧边栏消失，抽屉把手可见在左侧边缘，点击把手面板不展开（JS 尚未实现）。

- [ ] **Step 3: Commit**

```bash
git add frontend/css/style.css
git commit -m "feat: add mobile responsive CSS layout"
```

---

### Task 3: JS — 抽屉模块 `drawer.js`

**Files:**
- Create: `frontend/js/ui/drawer.js`

- [ ] **Step 1: 创建 `drawer.js` 模块**

```js
import { map } from '../map/map.js';

const drawerEl = document.getElementById('drawer');
const handleEl = document.getElementById('drawer-handle');
const backdropEl = document.getElementById('drawer-backdrop');
const closeEl = document.getElementById('drawer-close');

let isOpen = false;

function open() {
  drawerEl.classList.add('open');
  backdropEl.classList.add('active');
  handleEl.style.display = 'none';
  isOpen = true;
  map.invalidateSize();
}

function close() {
  drawerEl.classList.remove('open');
  backdropEl.classList.remove('active');
  handleEl.style.display = '';
  isOpen = false;
  map.invalidateSize();
}

function toggle() {
  isOpen ? close() : open();
}

export function initDrawer() {
  handleEl.addEventListener('click', open);
  closeEl.addEventListener('click', close);
  backdropEl.addEventListener('click', close);
}

export { open as openDrawer, close as closeDrawer, toggle as toggleDrawer };

// 暴露到 window 供 panel.js / markers.js 调用（避免循环依赖）
window.closeDrawer = close;
window.openDrawer = open;
```

- [ ] **Step 2: 检查模块语法，确保可以被 ES6 import 正确加载**

用浏览器打开 `frontend/index.html`，F12 控制台确认无模块加载错误（虽然还没被引用）。

- [ ] **Step 3: Commit**

```bash
git add frontend/js/ui/drawer.js
git commit -m "feat: add drawer toggle module"
```

---

### Task 4: JS — 接入抽屉到应用入口

**Files:**
- Modify: `frontend/js/main.js`

- [ ] **Step 1: 修改 `main.js`，引入抽屉并桥接搜索和渲染**

将 `main.js` 内容替换为：

```js
import { initRender } from './filter/render.js';
import { bindPanel } from './ui/panel.js';
import { initDrawer } from './ui/drawer.js';
import { bindDrawerSearch } from './ui/panel.js';

async function fetchBackendData() {
    const baseUrl = (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')
        ? 'http://127.0.0.1:5000'
        : '';

    const response = await fetch(`${baseUrl}/api/industries`);
    const rawData = await response.json();

    const regionMap = new Map();

    for (const raw of rawData) {
        const r = raw.region;
        if (!regionMap.has(r)) {
            regionMap.set(r, {
                id: r,
                region: r,
                lng: raw.lng,
                lat: raw.lat,
                industries: new Array()
            });
        }

        const record = regionMap.get(r);
        record.industries.push({
            name: raw.industry_name,
            category: raw.category,
            note: raw.note
        });
    }

    return Array.from(regionMap.values());
}

async function app() {
    const features = await fetchBackendData();
    initRender(features);
    bindPanel();
    initDrawer();
    bindDrawerSearch();
}

app();
```

- [ ] **Step 2: 浏览器中验证，F12 无模块加载错误**

- [ ] **Step 3: Commit**

```bash
git add frontend/js/main.js
git commit -m "feat: wire drawer into app entry point"
```

---

### Task 5: JS — `panel.js` 增加抽屉搜索绑定

**Files:**
- Modify: `frontend/js/ui/panel.js`

- [ ] **Step 1: 在 `panel.js` 中添加 `bindDrawerSearch` 导出**

在 `panel.js` 现有 `bindPanel` 函数之后追加：

```js
export function bindDrawerSearch() {
  const drawerQ = document.getElementById('drawer-q');
  const drawerCat = document.getElementById('drawer-cat');
  const drawerClear = document.getElementById('drawer-clear');
  const drawerResults = document.getElementById('drawer-results');
  const drawerStats = document.getElementById('drawer-stats');

  const doSearch = () => {
    const q = drawerQ.value.trim();
    const cat = drawerCat.value;
    render({ q, cat });

    // 同步桌面端搜索控件状态
    document.getElementById('q').value = q;
    document.getElementById('cat').value = cat;

    // 将渲染输出重定向到抽屉
    const deskResults = document.getElementById('results');
    const deskStats = document.getElementById('stats');
    if (drawerResults && deskResults) {
      drawerResults.innerHTML = deskResults.innerHTML;
    }
    if (drawerStats && deskStats) {
      drawerStats.textContent = deskStats.textContent;
    }
  };

  drawerQ.addEventListener('input', doSearch);
  drawerCat.addEventListener('change', doSearch);
  drawerClear.addEventListener('click', () => {
    drawerQ.value = '';
    drawerCat.value = '';
    doSearch();
  });
}
```

- [ ] **Step 2: 验证在浏览器拖窄到 < 768px 后，点击把手展开面板，搜索框输入能过滤卡片**

- [ ] **Step 3: Commit**

```bash
git add frontend/js/ui/panel.js
git commit -m "feat: add drawer search binding"
```

---

### Task 6: 修复 `locateOnMap` 联动 — 手机端面板行为

**Files:**
- Modify: `frontend/js/ui/panel.js`

- [ ] **Step 1: 修改 `locateOnMap` 函数以适配手机端**

将 `window.locateOnMap` 替换为：

```js
window.locateOnMap = function(id, isFromMap = false) {
  const latlng = getMarkerLatLng(id);

  // 1. 地图飞行
  if (latlng && !isFromMap) {
    const currentZoom = map.getZoom();
    const targetZoom = currentZoom >= FOCUS_ZOOM ? currentZoom : FOCUS_ZOOM;

    map.flyTo(latlng, targetZoom, {
      animate: true,
      duration: 1.2,
      easeLinearity: 0.25
    });
  }

  // 2. 点位呼吸灯
  highlightMarker(id);

  // 3. 卡片高亮
  document.querySelectorAll('.card.active-card').forEach(el => el.classList.remove('active-card'));

  const card = document.getElementById(`card-${id}`);
  if (card) {
    card.classList.add('active-card');

    if (isFromMap) {
      card.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }

  // 4. 手机端：卡片点击后关闭抽屉
  if (!isFromMap && window.closeDrawer) {
    window.closeDrawer();
  }
};
```

- [ ] **Step 2: 验证手机端点击卡片后抽屉自动关闭、地图飞行到目标点位**

- [ ] **Step 3: Commit**

```bash
git add frontend/js/ui/panel.js
git commit -m "fix: close drawer on card click in mobile"
```

---

### Task 7: 地图标记联动 — 手机端点击标记自动展开面板

**Files:**
- Modify: `frontend/js/map/markers.js`

- [ ] **Step 1: 修改 `initMarkers` 中的 marker click 事件**

在 `initMarkers` 函数内，找到 marker `click` 事件处理（约 79-87 行），替换为：

```js
m.on('click', () => {
  highlightMarker(f.id);
  const card = document.getElementById(`card-${f.id}`);
  if (card) {
    card.scrollIntoView({ behavior: 'smooth', block: 'center' });
    document.querySelectorAll('.card.active-card').forEach(el => el.classList.remove('active-card'));
    card.classList.add('active-card');
  }
  // 手机端：标记点击后展开抽屉
  if (window.openDrawer) {
    window.openDrawer();
  }
});
```

- [ ] **Step 2: 验证手机端点击地图标记后抽屉自动展开并定位到对应卡片**

- [ ] **Step 3: Commit**

```bash
git add frontend/js/map/markers.js
git commit -m "feat: expand drawer when marker clicked on mobile"
```

---

### Task 8: 集成测试 — 全流程验证

- [ ] **Step 1: 桌面端回归测试**

浏览器宽度 > 1024px，验证：
- 现有布局正常（地图左侧 + 侧边栏右侧）
- 搜索框输入过滤正常
- 点击卡片 → 地图飞行 + 高亮正常
- 点击标记 → 侧边栏滚动定位正常
- 分类下拉和重置按钮正常
- F12 控制台无 JS 错误

- [ ] **Step 2: 平板端测试 (768px ~ 1024px)**

拖窄浏览器到 800px，验证布局正常，侧边栏可见。

- [ ] **Step 3: 手机端测试 (< 768px)**

拖窄浏览器到 < 768px（或在 Chrome DevTools 中切换到移动端模拟），验证：
- 地图全屏显示
- 桌面侧边栏隐藏
- 左侧"索引"把手可见
- 点击把手 → 面板从左侧滑出
- 面板内搜索框可输入并过滤结果
- 点击卡片 → 面板收起 + 地图飞行
- 点击地图标记 → 面板展开 + 卡片定位
- 点击遮罩层 → 面板收起
- 点击 × 关闭按钮 → 面板收起
- 无 JS 错误

- [ ] **Step 4: 真机测试（推荐）**

在手机上访问本地开发服务器（确保手机和电脑在同一网络，访问 `http://电脑IP:8080`），验证触控体验和交互。

- [ ] **Step 5: Commit 如有修复**

```bash
git add -A
git commit -m "fix: mobile responsive integration fixes"
```

---

### Task 9: 清理和收尾

- [ ] **Step 1: 确认 `.gitignore` 包含 `.superpowers/`**

```bash
grep -q ".superpowers" .gitignore || echo ".superpowers/" >> .gitignore
```

- [ ] **Step 2: 最终 commit**

```bash
git add .gitignore
git commit -m "chore: ignore .superpowers directory"
```
