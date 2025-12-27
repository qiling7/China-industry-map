# 🗺️ 中国特色产地产业地图 (China Industry Map)

> 一个专注于展示中国特色产业集群分布的交互式 Web 地图应用。

[在线预览 Project Demo](https://qiling7.github.io/industry map/)

## 📖 项目简介

本项目旨在通过可视化手段，直观展示中国各地具有代表性的特色产业集群（如“诸暨袜子”、“丹阳眼镜”、“曹县棺材”等）。通过地图交互与数据检索，帮助用户快速了解中国庞大的制造业与特色农业版图。

项目采用原生 **ES6 Modules** 开发，轻量级、无打包工具依赖，主打**沉浸式交互**与**现代通透视觉**体验。

## ✨ 核心特性

* **🎨 现代视觉风格**：采用磨砂玻璃（Glassmorphism）UI 设计，配合高饱和度地图点位，界面通透且重点突出。
* **🔍 沉浸式搜索**：创新的搜索交互——输入关键词时，非相关点位自动变暗（Dimming）而非消失，保留地图上下文，目标点位高亮显示。
* **🔗 双向智能联动**：
    * **点击地图**：自动定位并滚动侧边栏至对应信息卡片。
    * **点击卡片**：地图平滑飞跃（FlyTo）至目标地，并触发呼吸灯闪烁效果。
* **📱 响应式布局**：侧边栏支持独立滚动，适配不同屏幕高度，底部统计信息常驻。
* **⚡ 轻量级架构**：基于 Leaflet.js，纯原生 JavaScript 实现，无需 Webpack/Vite 即可直接运行。

## 🛠️ 技术栈

* **核心库**：[Leaflet.js](https://leafletjs.com/) (地图渲染)
* **开发语言**：Vanilla JavaScript (ES6 Modules)
* **样式处理**：CSS3 (Flexbox, Grid, Backdrop-filter)
* **数据源**：OpenStreetMap (瓦片地图)

## 📂 目录结构

```text
China-industry-map/
├── css/
│   └── style.css       # 核心样式表（含磨砂玻璃与动画定义）
├── js/
│   ├── config.js       # 全局配置（配色、缩放级别、地图源）
│   ├── main.js         # 入口文件
│   ├── data/           # 数据层
│   │   ├── coords.js   # 地理坐标字典
│   │   └── industries.js # 产业详情数据
│   ├── map/            # 地图逻辑
│   │   ├── map.js      # Leaflet 实例初始化
│   │   └── markers.js  # 点位绘制、变暗逻辑、闪烁动画
│   ├── ui/             # 界面逻辑
│   │   ├── panel.js    # 侧边栏交互与联动
│   │   └── card.js     # 卡片组件生成
│   └── filter/         # 搜索算法
│       ├── render.js   # 渲染控制器
│       └── search.js   # 数据清洗与正则匹配
└── index.html          # 主页面
````

## 🚀 快速开始

本项目为静态网页，无需复杂的后端环境。

1.  **克隆项目**
    ```bash
    git clone [https://github.com/qiling7/China-industry-map.git](https://github.com/qiling7/China-industry-map.git)
    ```
2.  **运行**
      * 推荐使用 VS Code 的 `Live Server` 插件打开 `index.html`。
      * 或者使用 Python 快速启动服务：
        ```bash
        python -m http.server 8000
        ```
3.  **访问**
    打开浏览器访问 `http://localhost:8000`。

## ➕ 如何贡献数据

欢迎补充更多特色产业数据！请修改 `js/data/industries.js` 和 `js/data/coords.js`。

**数据格式示例：**

*industries.js*

```javascript
{ 
  region: "江苏连云港灌云县", 
  industry: "情趣内衣", 
  category: "轻工纺织", 
  note: "情趣内衣制造和电商销售新兴基地" 
}
```

*coords.js*

```javascript
"江苏连云港灌云县": [119.183, 34.093]
```

## 👤 作者

**文实 (Wen Shi)**

-----

*Project initiated in 2025. Powered by Coffee and Curiosity.*

```
