# KaiBlog

> 一点都不好玩的博客 · 博客 + 外部播客聚合 · 采用 DDD 三层架构

极简风格的个人博客与播客聚合站。博客主线 + 聚合外部播客节目（小宇宙 / YouTube / B 站）+ 关于我一屏。

## 技术栈

- Node.js ≥ 20 + Express + TypeScript (strict)
- Nunjucks（服务端模板引擎，SEO 友好）
- Supabase（PostgreSQL + Storage + Auth + RLS）
- DDD 三层架构（domain / application / infrastructure）
- Zod（输入校验） · Helmet + rate-limit（安全）
- Vitest · ESLint · Prettier · pnpm

## 快速开始

```bash
pnpm install
cp .env.example .env
# 填入 Supabase / GLM 等密钥（密钥仅服务端使用，不暴露到前端）
pnpm dev
```

## 目录结构

```
src/
  domain/           # 纯领域层（无任何框架依赖）
  application/      # 用例编排层
  infrastructure/   # 技术实现层（Supabase / LLM / 嵌入解析）
  presentation/     # Express 路由 + Nunjucks 模板
  server.ts         # 应用入口
docs/
  intent.md         # 产品意图文档
supabase/
  migrations/       # 数据库迁移
scripts/
  domain-purity-check.sh  # 领域纯净性检查
```

## 协作契约

**所有贡献者（人类与 AI）必须先阅读 [`CLAUDE.md`](./CLAUDE.md)**——包含 Git 开发秩序、Commit 规范、PR 流程、架构铁律。

## 常用脚本

```bash
pnpm dev          # 本地开发（tsx watch 热重载）
pnpm build        # TypeScript 编译
pnpm start        # 运行编译后的生产版本
pnpm lint         # ESLint
pnpm typecheck    # TypeScript 类型检查
pnpm test         # 单元测试
pnpm format       # Prettier 格式化
pnpm domain:check # 领域纯净性检查
```

## 版本里程碑

- `v0.1.0` — DDD 骨架 + Content + Taxonomy
- `v0.2.0` — 编辑器 + 播客双入口 + 订阅同步
- `v0.3.0` — 关于我 + AI 后置自动化
- `v1.0.0` — 首个生产版本

## 许可

MIT
