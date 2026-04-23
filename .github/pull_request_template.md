## What
<!-- 一句话说明改了什么 -->

## Why
<!-- 解决什么问题 / 满足哪条需求。引用 docs/intent.md 的章节号或 Sprint 编号 -->

## How to test
<!-- 验证步骤，勾选框形式 -->
- [ ]
- [ ]

## Checklist
- [ ] 本地 `pnpm lint && pnpm typecheck && pnpm test && pnpm build` 全绿
- [ ] 领域层无框架 import（`grep` 自检已过）
- [ ] 新增依赖已说明理由（为什么需要 / 为什么选这个 / 体积与维护状态）
- [ ] 相关文档（README / CLAUDE.md / intent.md）已同步更新
- [ ] 无破坏性变更，或已在 commit body 标注 `BREAKING CHANGE:`
- [ ] Commit 信息遵循 Conventional Commits 规范

## Notes for reviewers
<!-- 任何需要 reviewer 特别关注的点，可选 -->
