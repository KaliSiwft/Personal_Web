# 个人名片网页 · 技术方案（MVP）

> 对应设计文档：[DESIGN.md](../DESIGN.md)

## 1. 技术选型

| 项 | 选择 | 说明 |
|------|------|------|
| 页面结构 | 单个 `index.html` | 单页名片，无需路由 |
| 样式 | 单个 `styles.css`，原生 CSS | 使用 CSS 变量管理配色，Flexbox/Grid 布局 |
| 交互 | 单个 `main.js`，原生 JS | 仅用于「点击复制邮箱」等少量交互 |
| 构建工具 | 无 | 静态文件直接部署，`npm run dev` 用任意静态服务器即可 |
| 测试 | Playwright（端到端） | 验证验收标准中的可自动化项 |
| 部署 | GitHub Pages（首选）或 Vercel | 推送 `master` 即发布 |

不引入框架（React/Vue 等）和包管理依赖链，保持零构建、易维护。

## 2. 目录结构

```
Personal_Web/
├── index.html          # 页面唯一入口
├── styles.css          # 全部样式
├── main.js             # 复制邮箱等交互
├── assets/
│   ├── avatar.jpg      # 头像
│   └── favicon.ico     # 站点图标
├── docs/
│   └── TECH_DESIGN.md  # 本文档
├── DESIGN.md           # 设计文档
└── AGENTS.md           # 协作注意事项
```

## 3. 页面结构

`index.html` 从上到下依次为四个区块，全部在首屏或近首屏：

1. **Hero 区**：头像（圆形）、姓名、一句话定位（`<h1>`）、2-3 句介绍。
2. **联系方式区**：邮箱按钮（点击复制 + tooltip 提示「已复制」）、社交图标链接（GitHub、微信、LinkedIn），`<a>` 带 `rel="noopener"`。
3. **页脚**：版权信息与备案/年份，极简一行。

SEO 相关：`<html lang="zh-CN">`、`<title>`、`<meta name="description">`、Open Graph 标签（`og:title` / `og:description` / `og:image`）、favicon。

## 4. 关键实现要点

- **响应式**：移动端优先；断点仅设一个（`min-width: 640px`），桌面端内容列最大宽度约 640px 居中。
- **配色**：CSS 变量定义（`--bg`、`--text`、`--accent`），中性色背景 + 单一强调色，便于后续扩展深色模式。
- **复制邮箱**：`navigator.clipboard.writeText()`，失败时降级为 `document.execCommand('copy')`；成功后按钮文案短暂切换为「已复制 ✓」。
- **无障碍**：图标链接提供 `aria-label`；头像 `alt` 文案为姓名；对比度满足 WCAG AA。
- **性能**：头像图片压缩至 200KB 以内并指定宽高避免布局抖动；除图片外无额外资源请求。

## 5. 测试方案

使用 Playwright 做端到端验证，覆盖设计文档中的验收标准：

1. 页面在 375px（手机）与 1280px（桌面）视口下无横向滚动。
2. 首屏包含姓名、定位文案、邮箱入口。
3. 点击邮箱按钮后剪贴板内容为邮箱地址，且出现「已复制」提示。
4. 各社交链接 `href` 正确且在新标签页打开。
5. `<title>`、`<meta description>`、favicon 存在且非空。

运行方式：`npx playwright test`。

## 6. 部署流程

1. 代码推送至 GitHub 仓库。
2. 仓库设置中开启 GitHub Pages（来源：`master` 分支根目录）。
3. 后续每次合并到 `master` 即自动发布；页面地址形如 `https://<user>.github.io/Personal_Web/`。
