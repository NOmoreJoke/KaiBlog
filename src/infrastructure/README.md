# Infrastructure Layer

技术实现层：实现 domain 和 application 定义的接口。

此层可以 import 具体框架（@supabase/supabase-js, express, axios 等）。

子目录（S1 起逐步填充）：

- `persistence/supabase/` — Supabase Repository 实现
- `llm/` — LLM 适配器（GLM / OpenRouter），服务端调用，密钥不暴露
- `embed/` — 外部链接解析器（小宇宙 / YouTube / B 站 / Apple Podcast）
- `podcast-sync/` — 订阅同步适配器（MCP / OPML）
- `storage/` — 文件存储适配器
- `config/` — 环境变量加载与校验（dotenv + zod）
