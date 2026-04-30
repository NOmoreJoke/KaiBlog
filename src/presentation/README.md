# Presentation Layer

Express 路由 + Nunjucks 服务端模板。

只能调用 application 层暴露的用例和查询，**不直接访问 infrastructure**。

子目录（S1 起逐步填充）：

- `routes/` — Express 路由（公开页面 + admin API）
- `templates/` — Nunjucks 模板（首页 / 文章页 / 关于我 / admin）
- `middleware/` — Express 中间件（auth / error handling）
- `static/` — 静态资源（CSS / JS / 图片）
