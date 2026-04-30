# KaiBlog · 产品意图文档

> 本文件描述 KaiBlog 的产品目标、核心功能和设计约束。

## 1. 产品定位

极简风格的个人博客与播客聚合站。面向个人使用，不追求社交互动功能。

## 2. 核心功能

### 2.1 博客主线

- 富文本文章发布与管理
- 分类（Category）与标签（Tag）体系
- 文章列表与详情页（服务端渲染，SEO 友好）

### 2.2 播客聚合

- 聚合外部播客节目（小宇宙 / YouTube / B 站）
- 链接识别与嵌入卡片
- 订阅同步（MCP / OPML）

### 2.3 关于我

- 单页展示，singleton 模式
- 支持富文本编辑

### 2.4 后台管理

- Magic Link 登录（Supabase Auth）
- 文章 CRUD + 播客管理
- AI 辅助（标题建议、摘要生成、标签推荐）—— 后置、可选

## 3. 非功能需求

- **SEO**：服务端渲染，语义化 HTML，Open Graph 标签
- **安全**：所有密钥服务端持有，RLS 保护数据，Helmet + rate limit
- **性能**：首屏服务端渲染，静态资源缓存
- **可维护性**：DDD 分层，领域纯净

## 4. 技术约束

- Node.js + Express + TypeScript
- Nunjucks 服务端模板（SEO 优先）
- Supabase（PostgreSQL + Storage + Auth + RLS）
- 所有 AI/LLM API Key 仅在服务端使用

## 5. 目标用户

博客作者本人（单用户系统，读者为匿名访客）。
