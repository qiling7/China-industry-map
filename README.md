# 🗺️ 中国特色产业地图 (China Industry Map)

[![Python](https://img.shields.io/badge/Python-3.8+-blue.svg)](https://www.python.org/)
[![Flask](https://img.shields.io/badge/Flask-3.0.0-lightgrey.svg)](https://flask.palletsprojects.com/)
[![JavaScript](https://img.shields.io/badge/JavaScript-ES6-F7DF1E.svg)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
[![Leaflet](https://img.shields.io/badge/Leaflet-1.9.4-199900.svg)](https://leafletjs.com/)
[![SQLite](https://img.shields.io/badge/SQLite-3-003B57.svg)](https://www.sqlite.org/)

> **在线预览 (Live Demo)**: [https://originmap.cn/](https://originmap.cn/)

## 📖 项目简介

中国特色产业地图是一个**前后端分离的全栈空间数据可视化 Web 应用**。旨在通过交互式 GIS（地理信息系统）技术，将中国各地区庞大且细分的产业集群数据进行直观映射与多维度检索。

本项目摒弃了臃肿的前端框架，采用 **原生 Vanilla JS (ES6 Modules)** 结合 **Leaflet.js** 构建高性能的前端渲染引擎；后端基于 **Python/Flask** 提供稳健的 RESTful API，并依靠 **SQLite** 进行轻量级数据持久化。展现了从底层数据迁移、接口设计到前端复杂状态同步的完整全栈工程能力。

## ✨ 核心技术亮点 (Key Features)

- **🚀 复杂地图交互与自定义渲染**
  - 基于 Leaflet 实现了深度的地图定制，针对“单地区多产业”的复杂数据场景，利用 CSS3 `conic-gradient` 和 `divIcon` 算法动态生成**响应式饼图聚合标记 (Pie-chart Markers)**。
  - 运用贝塞尔曲线 (`cubic-bezier`) 实现了平滑的视觉过渡与飞行动画 (FlyTo) 引擎。
- **🔄 双向数据状态同步机制**
  - 实现了侧边栏与地图标记的实时双向联动。
  - **正向触发**：点击侧边栏卡片，地图引擎自动计算最优缩放层级 (Zoom Level)，并平滑漫游至目标经纬度，同时触发目标节点的“呼吸灯”高亮动效。
  - **反向触发**：点击地图节点，侧边栏利用 `scrollIntoView` 算法自动滚动并定位至对应数据卡片，并更新 Active 状态。
- **⚡ 高性能实时检索与数据过滤**
  - 在客户端实现了基于正则表达式的**无延迟多维检索**（支持按地区、产业名称、分类、备注的模糊匹配）。
  - 数据过滤时，地图采用局部重绘与透明度渐变 (Opacity Transitions) 代替全局刷新，以保持用户宏观地理上下文的连贯性。
- **🏗️ 严谨的系统架构与数据流**
  - **扁平到嵌套的数据转换**：前端在获取后端一维扁平数据后，利用 `Map` 数据结构在内存中高效完成时间复杂度为 $O(N)$ 的区域数据聚合 (GroupBy Region)。
  - **数据库设计**：编写数据迁移脚本 (`database_migrations`)，使用联合唯一约束 (`UNIQUE(region, industry_name)`)，确保确保数据一致性。

## 🛠️ 技术栈 (Tech Stack)

### 前端 (Frontend)
- **核心语言**: HTML5, CSS3, JavaScript (ES6 Modules 模块化开发)
- **地图引擎**: Leaflet.js (v1.9.4)
- **UI/样式**: CSS Grid & Flexbox 响应式布局，高斯模糊毛玻璃效果 (Backdrop-filter)

### 后端 (Backend)
- **框架**: Python 3, Flask 3.0.0, Flask-CORS 4.0.0
- **数据库**: SQLite3 (内置 `sqlite3.Row` 工厂优化数据结构序列化)
- **脚本工具**: Python CSV 解析器，用于存量业务数据的自动化清洗与导入。

## 📂 项目架构设计 (Architecture)

```text
China-industry-map/
├── backend/                  # 后端微服务
│   ├── app.py                # Flask 核心路由与 REST API
│   ├── requirements.txt      # 依赖清单
│   └── industry.db           # SQLite 数据底座
├── frontend/                 # 前端静态工程
│   ├── css/style.css         # 全局与组件级样式
│   ├── js/
│   │   ├── config.js         # 全局常量、主题色及地图配置
│   │   ├── filter/           # 搜索过滤引擎与 DOM 渲染逻辑
│   │   ├── map/              # Leaflet 实例与高阶 Marker 管理
│   │   ├── ui/               # 交互组件 (卡片、侧边栏面板)
│   │   └── main.js           # 前端应用入口与网络请求调度
│   └── index.html
├── database_migrations/      # 数据库版本控制与结构演进脚本
│   ├── 000_initial_setup.py
│   └── 001_add_unique_constraint.py
└── scripts/
    └── import_data.py        # 离线数据清洗与入库脚本
```

## 🚀 快速启动 (Local Development)

### 1. 克隆项目
```bash
git clone https://github.com/qiling7/China-industry-map.git
cd China-industry-map
```

### 2. 启动后端服务
```bash
cd backend
# 建议使用虚拟环境
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate

# 安装依赖
pip install -r requirements.txt

# 初始化/迁移数据库 (若 db 不存在)
python ../database_migrations/000_initial_setup.py
python ../database_migrations/001_add_unique_constraint.py

# 启动 API 接口服务 (默认运行在 http://127.0.0.1:5000)
python app.py
```

### 3. 启动前端服务
```bash
cd ../frontend

# 使用 Python 内置的轻量级 HTTP 服务器
python -m http.server 8080
```
浏览器访问[http://localhost:8080](http://localhost:8080) 即可查看完整应用。

## 💡 接口文档 (API Reference)

### `GET /api/industries`
获取全量产业地标数据。
- **Response Format**: `application/json`
- **Example Response**:
```json[
  {
    "id": 1,
    "region": "江苏连云港东海",
    "industry_name": "水晶",
    "category": "宝石矿产",
    "note": "世界水晶之都，中国水晶市场的源头",
    "lat": 34.540,
    "lng": 118.750
  }
]
```

## ➕ 共同完善

中国的产业地图广袤无垠，个人的力量终究有限。如果你也知道家乡有哪些鲜为人知的“特色产业”，欢迎提交 PR 或 Issue 来丰富这份地图。

**我们需要这样的数据：**
- **地区**：精确到县或镇（如：江苏泰州泰兴黄桥镇）
- **产业**：具体的特色产品（如：小提琴）
- **备注**：一两句关于它的硬核事实（如：全球最大的提琴生产基地）

## 👨‍💻 关于作者 (Author)

**[Yang Xvyuan]**
- Github: [@qiling7](https://github.com/qiling7)
- Email: [wenshiyang66@gmail.com]

*如果您对本项目有任何问题，或有任何岗位机会，欢迎通过邮件与我联系！*