# KaiBlog

> 一点都不好玩的博客 · 博客 + 外部播客聚合 · 采用 DDD 三层架构

极简风格的个人博客与播客聚合站。博客主线 + 聚合外部播客节目（小宇宙 / YouTube / B 站）+ 关于我一屏。

## 技术栈

- TypeScript + React 18 + Vite 5
- Tiptap（富文本编辑器，含小宇宙链接识别扩展）
- Supabase（PostgreSQL + Storage + RLS）
- DDD 三层架构（domain / application / infrastructure）
- Vitest · ESLint · Prettier · pnpm

## 快速开始

```bash
pnpm install
cp .env.example .env
# 填入 Supabase / GLM / 小宇宙 MCP 等密钥
pnpm dev
```

## 目录结构

```
src/
  domain/           # 纯领域层（无任何框架依赖）
  application/      # 用例编排层
  infrastructure/   # 技术实现层（Supabase / Tiptap / AI / 嵌入解析）
  presentation/     # UI 层（React）
supabase/
  migrations/       # 数据库迁移
```

## 协作契约

**所有贡献者（人类与 AI）必须先阅读 [`CLAUDE.md`](./CLAUDE.md)**——包含 Git 开发秩序、Commit 规范、PR 流程、架构铁律。

## 常用脚本

```bash
pnpm dev          # 本地开发
pnpm build        # 生产构建
pnpm lint         # ESLint
pnpm typecheck    # TypeScript 类型检查
pnpm test         # 单元测试
pnpm format       # Prettier 格式化
```

## 版本里程碑

- `v0.1.0` — DDD 骨架 + Content + Taxonomy
- `v0.2.0` — Tiptap 编辑器 + 播客双入口 + 订阅同步
- `v0.3.0` — 关于我 + AI 后置自动化
- `v1.0.0` — 首个生产版本

## 许可

MIT
