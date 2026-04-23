# Supabase Migrations

按时间顺序命名的 SQL 迁移文件。首次迁移将在 S2 创建（`0001_init.sql`），包含：

- `contents` 表（Article + MediaEmbed 共用，type 字段区分）
- `categories` / `tags` / `content_tags` 表
- `podcast_shows` 表（订阅墙数据源）
- `profiles` 表（singleton，id=1）
- 基础 RLS 策略
