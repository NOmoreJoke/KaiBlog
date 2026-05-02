# Domain Layer

纯领域层：实体、值对象、领域服务、仓储接口。

**铁律**：本目录下禁止 `import` 任何框架或 I/O 代码（express / @supabase / axios / fetch / node:fs / dotenv）。

子域（S1 起逐步填充）：

- `content/` — Content 聚合根（Article / MediaEmbed）
- `taxonomy/` — Category / Tag
- `media/` — MediaAsset / ExternalEmbed / EmbedParser
- `podcast/` — PodcastShow / SubscriptionSyncPort
- `profile/` — Profile（关于我 singleton）
- `shared/` — Id / DomainEvent 等基础值对象
