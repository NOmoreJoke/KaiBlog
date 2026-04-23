# Presentation Layer

UI 层：React 组件、页面、hooks。

只能调用 application 层暴露的用例和查询，**不直接访问 infrastructure**。

子目录（S1 起逐步填充）：

- `pages/` — 路由页面（首页 4 Tab / 文章页 / 关于我 / admin）
- `components/` — 可复用组件
- `hooks/` — React hooks（封装对 application 层的调用）
