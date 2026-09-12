# Personal_Web · 个人名片网页

一个单页个人名片网站，目标：让访客在 10 秒内知道「我是谁、我做什么、怎么联系我」。

原生 HTML/CSS/JS 实现，零构建、无框架、无后端，可静态部署到任意托管平台。

> 设计文档见 [docs/DESIGN.md](docs/DESIGN.md)，技术方案见 [docs/TECH_DESIGN.md](docs/TECH_DESIGN.md)。

## 功能

- **身份信息**：头像、姓名、一句话定位、简短介绍，首屏直达
- **联系方式**：邮箱点击复制（带降级方案）、GitHub / LinkedIn 链接、微信号点击复制
- **响应式**：移动端优先，单断点适配桌面端，内容一屏呈现
- **基础 SEO**：`<title>`、`<meta description>`、Open Graph 标签、favicon

## 快速开始

无需安装依赖即可预览（`http-server` 由 npx 按需拉取）：

```bash
npm run dev        # 启动本地服务，访问 http://127.0.0.1:8181
```

## 测试

端到端测试基于 Playwright，覆盖设计文档的全部验收标准（多视口排版、首屏信息、复制交互、外链、SEO 配置）：

```bash
npm install        # 首次需安装开发依赖并执行 npx playwright install chromium
npm test
```

## 项目结构

```
Personal_Web/
├── index.html          # 页面唯一入口
├── styles.css          # 全部样式（CSS 变量管理配色）
├── main.js             # 复制邮箱/微信号等交互
├── assets/             # 头像与 favicon
├── tests/card.spec.js  # Playwright 端到端测试
└── docs/               # 设计文档与技术方案
```

## 自定义

个人信息集中在 [index.html](index.html) 中，替换姓名、定位、介绍、邮箱（`data-copy` 属性与按钮文案需同步修改）和社交链接即可；头像与 favicon 替换 `assets/` 下的对应文件。修改后运行 `npm test`，同步更新 `tests/card.spec.js` 中的断言。

## 部署

纯静态目录，推送 GitHub 后可开启 GitHub Pages（`master` 分支根目录），或直接接入 Vercel / Cloudflare Pages，无需任何构建配置。
