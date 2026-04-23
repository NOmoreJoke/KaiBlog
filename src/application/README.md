# Application Layer

用例编排层：UseCase、Query（读模型）、ports（对外接口）。

可以 import `src/domain/`，不可以 import `src/infrastructure/` 或 `src/presentation/`。

子目录（S1 起逐步填充）：

- `content/` — 文章与单集卡片的用例
- `podcast/` — 订阅同步用例
- `profile/` — 关于我用例
- `taxonomy/` — 分类标签管理用例
- `ports/` — 对外端口接口（LlmPort / StoragePort 等）
