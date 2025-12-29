# Cloudflare Pages 部署指南

## 部署方式对比

### 1. Cloudflare Pages（推荐）
- **适用场景**：静态网站 + Functions API
- **优点**：自动 HTTPS、全球 CDN、免费额度充足、支持 Git 自动部署
- **你的项目**：使用 Pages + Functions（`_worker.js`）

### 2. Cloudflare Workers（纯 API）
- **适用场景**：纯后端 API，无静态资源
- **优点**：边缘计算、低延迟
- **你的项目**：不适用（需要静态 HTML）

## 项目配置结构

```
whoisunder/
├── index.html          # 主页面
├── rules.html          # 规则页面
├── card.html           # 玩家卡片页面
├── worker.js           # Functions 逻辑（KV 操作）
├── _worker.js          # Pages Functions 入口（必需）
└── wrangler.toml       # 部署配置（可选，用于 CLI）
```

## 必需配置文件

### 1. `_worker.js`（Pages Functions 入口）
```javascript
import worker from './worker.js';
export default worker;
```
**作用**：告诉 Pages 使用 `worker.js` 处理 API 请求

### 2. `worker.js`（Functions 逻辑）
已存在，包含：
- POST `/games` - 创建游戏
- PUT `/games/:id` - 更新游戏
- GET `/games/:id` - 获取游戏
- GET `/games/recent` - 最近 24 小时记录

### 3. `wrangler.toml`（可选，用于 CLI 部署）
```toml
name = "whoisunder"
compatibility_date = "2025-12-12"

[[kv_namespaces]]
binding = "GAMES_KV"
id = "你的KV命名空间ID"
```

## 部署步骤

### 方式 A：Git 自动部署（推荐）

1. **准备仓库**
   - 确保代码已推送到 GitHub/GitLab/Bitbucket

2. **连接 Cloudflare Pages**
   - 登录 [Cloudflare Dashboard](https://dash.cloudflare.com)
   - 进入 **Pages** → **Create a project**
   - 选择 **Connect to Git**
   - 授权并选择你的仓库

3. **配置构建设置**
   - **Framework preset**: None（或 Static）
   - **Build command**: 留空（纯静态，无需构建）
   - **Build output directory**: `whoisunder`（或 `.` 如果仓库根目录就是项目）
   - **Root directory**: `/whoisunder`（如果项目在子目录）

4. **配置环境变量和绑定**
   - 在项目设置 → **Functions** → **KV Namespace Bindings**
   - 添加绑定：
     - **Variable name**: `GAMES_KV`
     - **KV namespace**: 选择你创建的命名空间

5. **部署**
   - 点击 **Save and Deploy**
   - 之后每次 push 到主分支会自动部署

### 方式 B：Wrangler CLI 手动部署

1. **安装 Wrangler**
   ```bash
   npm install -g wrangler
   # 或使用 npx（推荐）
   ```

2. **登录 Cloudflare**
   ```bash
   npx wrangler login
   ```

3. **创建 KV 命名空间**（如果还没有）
   ```bash
   npx wrangler kv:namespace create "GAMES_KV"
   # 复制返回的 ID，填入 wrangler.toml
   ```

4. **部署**
   ```bash
   cd whoisunder
   npx wrangler pages deploy . --project-name whoisunder
   ```

5. **绑定 KV**（如果部署时未自动绑定）
   - 在 Pages Dashboard → 项目 → **Settings** → **Functions** → **KV Namespace Bindings**
   - 添加 `GAMES_KV` 绑定

### 方式 C：Dashboard 直接上传

1. **打包项目**
   ```bash
   cd whoisunder
   zip -r ../whoisunder.zip .
   ```

2. **上传**
   - Pages → **Create a project** → **Upload assets**
   - 选择 zip 文件上传

3. **绑定 KV**
   - 项目设置 → **Functions** → **KV Namespace Bindings**
   - 添加 `GAMES_KV` 绑定

## 关键配置检查清单

- [ ] `_worker.js` 存在于输出目录根目录
- [ ] `worker.js` 与 `_worker.js` 在同一目录
- [ ] KV 命名空间已创建
- [ ] Pages 项目中已绑定 KV（变量名：`GAMES_KV`）
- [ ] `index.html` 中的 `WORKER_BASE` 为空字符串（使用相对路径）

## 验证部署

1. **检查 Functions 是否生效**
   ```javascript
   // 在浏览器控制台执行
   fetch('/games/recent?hostId=test')
     .then(r => r.json())
     .then(console.log)
   ```
   - ✅ 返回 JSON（数组或错误对象）→ Functions 正常
   - ❌ 返回 HTML → Functions 未生效

2. **测试创建游戏**
   - 打开网站
   - 设置游戏参数
   - 点击"分享到群聊进行发牌"
   - 复制链接，在无痕窗口打开
   - ✅ 应显示"加入游戏"模态框
   - ❌ 显示"游戏不存在" → KV 未绑定或 Functions 未生效

## 常见问题

### Q: 为什么返回 HTML 而不是 JSON？
**A**: `_worker.js` 未生效，可能原因：
- `_worker.js` 不在输出目录根目录
- Pages Functions 未启用
- 需要重新部署

### Q: 提示"游戏不存在或已过期"
**A**: KV 未绑定或 Functions 未执行，检查：
- Pages 项目设置 → Functions → KV Bindings
- 确认 `GAMES_KV` 已绑定

### Q: 如何查看部署日志？
**A**: Pages Dashboard → 项目 → **Deployments** → 点击部署查看日志

## 参考链接

- [Cloudflare Pages 文档](https://developers.cloudflare.com/pages/)
- [Pages Functions 文档](https://developers.cloudflare.com/pages/platform/functions/)
- [Wrangler CLI 文档](https://developers.cloudflare.com/workers/wrangler/)

