# KaiBlog · 协作契约（Collaboration Contract）

> 本文件是 **人类开发者和 AI 助手（Claude Code、Codex、Cursor 等）共同遵守的协作宪法**。
> 任何参与本项目的代理在开始工作前，必须先读完本文件。
> 违反本契约的提交、PR、推送应被 **reject**，无论由谁发起。

**远程仓库**：https://github.com/NOmoreJoke/KaiBlog
**主分支**：`main`
**版本基线**：v3.0（2026-04-23 · DDD 重构启动）

---

## 0. 阅读顺序（新 agent 上岗）

1. 本文件（`CLAUDE.md`）—— 协作契约
2. `../docs/intent.md` —— 产品意图（外层仓）
3. `../C:\Users\kai18\.claude\plans\https-blog-qiaomu-ai-qiaomu-blog-opensou-mossy-sketch.md` —— 完整实施方案（若存在）
4. 当前 Sprint 的验收标准（在 GitHub Issues 或 plan 中）
5. `README.md` —— 快速开始

**不要跳过上述任何一项就开始写代码。**

---

## 1. 架构铁律（Domain Integrity）

本项目采用 **DDD 三层 + 端口-适配器** 架构。以下规则不可商量：

### 1.1 分层依赖方向

```
presentation ──► application ──► domain
         │              │
         └── infrastructure ──► domain
                     ▲
          （infrastructure 实现 domain 的接口）
```

- `src/domain/` **只能 import 自己的其他 domain 代码**。禁止 import `react`, `@supabase/*`, `@tiptap/*`, `axios`, `fetch`, 任何 I/O 或 UI 框架。
- `src/application/` 可以 import `src/domain/`，不可以 import `src/infrastructure/` 或 `src/presentation/`。
- `src/infrastructure/` 实现 domain / application 定义的接口，可以 import 具体框架。
- `src/presentation/` 只调用 application 层暴露的用例/查询，**不直接访问 infrastructure**。

### 1.2 验证指令

提交前必过：

```bash
# 领域纯净性（应无输出）
grep -r -E "from ['\"](react|@supabase|@tiptap|axios)" src/domain/ && exit 1 || exit 0
```

CI 里用 ESLint import 约束做自动检查（`eslint-plugin-boundaries` 或 depcruise）。

### 1.3 代码优先级

**领域纯净 > 可测试性 > 开发体验 > 性能优化**

写代码做权衡时按上面顺序取舍。

---

## 2. 分支模型（GitHub Flow 变体）

| 分支 | 用途 | 约束 |
|---|---|---|
| `main` | 生产分支，永远可部署 | 只接受 Squash Merge PR，禁止直 push、禁止 force-push |
| `feature/<desc>` | 新功能 | 基于 main 拉出；完成后 PR 回 main |
| `fix/<desc>` | 缺陷修复 | 同上 |
| `docs/<desc>` | 纯文档变更 | 同上 |
| `chore/<desc>` | 构建/依赖/配置 | 同上 |
| `refactor/<desc>` | 重构（无行为变化） | 同上 |

**分支命名强约束**：

- kebab-case，全小写
- 动词开头，≤ 5 个单词
- 示例：✅ `feature/tiptap-xiaoyuzhou-embed`、✅ `fix/rls-public-read` ; ❌ `feat_AddNew`、❌ `john-branch`

---

## 3. Commit 规范（Conventional Commits）

### 3.1 格式

```
<type>(<scope>): <subject>

<body，可选，解释 why>

<footer，可选：BREAKING CHANGE / Closes #xx>
```

### 3.2 type 清单

| type | 何时用 | 示例 |
|---|---|---|
| `feat` | 新功能 | `feat(podcast): add XiaoyuzhouParser` |
| `fix` | 缺陷修复 | `fix(editor): handle empty paste event` |
| `refactor` | 重构，无行为变化 | `refactor(content): extract Slug value object` |
| `docs` | 文档 | `docs: update CLAUDE.md AI constraints` |
| `chore` | 依赖/配置/构建 | `chore: bump vite to 5.4` |
| `test` | 测试 | `test(content): add AutoEnrichUseCase specs` |
| `perf` | 性能 | `perf(list): index contents.published_at` |
| `style` | 格式化，无行为变化 | `style: prettier run` |
| `ci` | CI 配置 | `ci: add typecheck to workflow` |
| `build` | 构建系统 | `build: add docker image config` |

### 3.3 scope 清单（必须是下列之一或 `*`）

`content` / `taxonomy` / `media` / `podcast` / `profile` / `editor` / `infra` / `admin` / `web` / `db` / `ci` / `deps`

### 3.4 主题行规则

- 主题行 **≤ 72 字符**
- **祈使句**（"add" 而非 "added" / "adds"）
- 首字母小写
- 结尾不加句号

### 3.5 body 规则（有则遵守）

- 空一行后写
- 每行 ≤ 72 字符
- **解释 why，不解释 what**（代码本身就是 what）
- breaking change 格式：`BREAKING CHANGE: <详细描述>`

### 3.6 反模式（见到必 reject）

- ❌ `update` / `fix bug` / `wip` / `tmp`
- ❌ 主题行超过 72 字符
- ❌ 夹杂中英文但没语义（"feat: 新增 xxx feature"）
- ❌ 一个 commit 改动跨 5+ 个子域
- ❌ "一揽子"commit（`feat: lots of changes`）

---

## 4. Pull Request 流程

### 4.1 开 PR 前本地检查（全部通过才允许 push）

```bash
pnpm lint       # ESLint
pnpm typecheck  # tsc --noEmit
pnpm test       # Vitest
pnpm build      # 确认能构建
```

**pre-commit hook** 会自动跑前两项；`pnpm test`、`pnpm build` 由开发者自行执行或在 CI 中把关。

### 4.2 PR 标题

同样遵循 Conventional Commits 规范。Squash Merge 时这就是合入 main 的 commit message。

### 4.3 PR 描述模板

`.github/pull_request_template.md` 强制以下结构：

```markdown
## What
<改了什么，一句话>

## Why
<解决什么问题 / 满足哪条需求（引用 intent.md 第几节或 Sprint 编号）>

## How to test
- [ ] 步骤 1
- [ ] 步骤 2

## Checklist
- [ ] 本地 lint / typecheck / test / build 全绿
- [ ] 领域层无框架 import
- [ ] 新增依赖已说明理由（见下）
- [ ] 相关文档已同步更新
- [ ] 无破坏性变更，或已在 body 标注 BREAKING CHANGE
```

### 4.4 依赖新增规则

**新增任何 npm 依赖必须在 PR body 写清楚**：

1. **为什么需要**（不能"现有方案不够用"就加）
2. **为什么选这个**（对比了哪些替代）
3. **体积/维护状态**（bundle size、上次发布时间、周下载）

### 4.5 Review 与合并

- 至少 1 名 reviewer 批准（**独立开发者也必须走 PR，自审通过后再合**）
- CI 必须全绿
- 合并方式：**Squash & Merge**（保持 main 线性历史）
- 合并后删除远程和本地 feature 分支

### 4.6 禁止事项

- ❌ `git push --force origin main`
- ❌ `git commit --amend` 已 push 的提交
- ❌ `--no-verify` 跳过 hook
- ❌ 直接 push 到 main（会被保护规则拦截）
- ❌ 合并自己开的 PR 而无 CI 全绿

---

## 5. 版本与发布

### 5.1 语义化版本（SemVer 2.0）

`MAJOR.MINOR.PATCH`

- **MAJOR**：破坏性变更（数据库 schema 不向后兼容、API 删除）
- **MINOR**：新功能，向后兼容
- **PATCH**：缺陷修复，向后兼容

### 5.2 里程碑

| 版本 | 对应 Sprint | 含义 |
|---|---|---|
| `v0.1.0` | S0–S3 完成 | 骨架 + Content + Taxonomy |
| `v0.2.0` | S4–S6 完成 | 编辑器 + 播客双入口 + 订阅同步 |
| `v0.3.0` | S7–S8 完成 | 关于我 + AI 后置 |
| `v1.0.0` | 全部完成并部署 | 首个生产版 |

### 5.3 CHANGELOG

- 首期：手动维护 `CHANGELOG.md`，发版时从 PR 题目聚合
- 二期：切换到 release-please 自动生成
- 格式遵循 [Keep a Changelog](https://keepachangelog.com/)

### 5.4 Git Tag

```bash
git tag -a v0.1.0 -m "feat: DDD skeleton + content + taxonomy"
git push origin v0.1.0
```

---

## 6. GitHub 仓库保护规则

下列规则需在 GitHub Settings → Branches 配置（首次 push 后立即设置）：

- ✅ Require a pull request before merging
- ✅ Require approvals（至少 1）
- ✅ Dismiss stale PR approvals when new commits are pushed
- ✅ Require status checks to pass before merging
  - `CI / quality`
- ✅ Require branches to be up to date before merging
- ✅ Require linear history
- ✅ Do not allow bypassing the above settings
- ✅ Block force pushes
- ❌ Allow deletions（保持关）

敏感文件拦截（通过 `.gitignore` + 必要时加 pre-commit 扫描）：

- `.env` / `.env.*`（只允许 `.env.example`）
- `*.pem` / `*.key`
- `id_rsa*`
- Supabase Service Role Key 绝不能进仓库

---

## 7. AI 助手专属约束

### 7.1 开工前的必读（每轮对话都要做）

- [ ] 读本文件最新版
- [ ] 读 `../docs/intent.md`
- [ ] 明确当前 Sprint 编号与验收标准

### 7.2 Commit 前自检

```bash
pnpm lint && pnpm typecheck && pnpm test
# 领域纯净性
grep -rE "from ['\"](react|@supabase|@tiptap)" src/domain/ && echo "DOMAIN VIOLATION" && exit 1
```

任何一步失败 → 修根因，**不允许 `--no-verify` 绕过**。

### 7.3 不自作主张

- **不扩 scope**：被要求"修 bug A"时，不顺手重构模块 B
- **不加未请求的特性**：没被要求加 loading 状态就不加
- **不写多余注释**：代码自解释优先，注释只写 "why"，不写 "what"
- **不加多余错误处理**：只在系统边界（用户输入、外部 API）做 validation，内部代码信任框架保证
- **不建议向后兼容 shim**：需要改就改到底，不留 `_deprecated` 别名

### 7.4 破坏性操作需人类批准

以下动作必须在 PR 描述明确声明并等待人类 review：

- 删除或重命名已公开的 API / 数据库列
- 删除依赖（可能影响其他模块）
- 修改 CI / 保护规则 / 本文件
- `git rebase` 已推送的分支
- 清理 `.env.example` 条目

### 7.5 出错时的行动

遇到失败 → **先诊断根因再动手**。不要：

- ❌ 用 `--no-verify` 跳过 hook
- ❌ 用 `catch { }` 吞掉错误
- ❌ 把失败的测试标记 `.skip`
- ❌ 把报错文件删掉当没看见

---

## 8. 工具链（首期最小化）

| 角色 | 工具 |
|---|---|
| 包管理 | pnpm（锁文件版本一致性） |
| Lint | ESLint + @typescript-eslint |
| Format | Prettier（pre-commit 自动跑） |
| Test | Vitest + @testing-library/react |
| Type check | tsc --noEmit |
| Hooks | simple-git-hooks（比 husky 轻） |
| Commit lint | @commitlint/cli + @commitlint/config-conventional |
| CI | GitHub Actions |
| 依赖检查 | 新增时手动审，二期加 dependabot |

---

## 9. 目录结构契约

```
src/
  domain/           # 纯领域：实体/值对象/领域服务/仓储接口
  application/      # 用例编排：UseCase + Query + ports（对外接口）
  infrastructure/   # 技术实现：supabase/llm/embed/podcast-sync/storage
  presentation/     # UI：pages/components/hooks（React）
supabase/
  migrations/       # SQL 迁移，按时间排序文件名
.github/
  workflows/
  pull_request_template.md
docs/               # 项目内部技术文档（架构决策 ADR 等）
```

**禁止在 `src/` 以外创建业务代码目录**。

---

## 10. 常用命令速查

```bash
# 起一个新功能分支
git checkout main && git pull
git checkout -b feature/<desc>

# 提交（commitlint 会自动校验）
git add <files>
git commit -m "feat(scope): subject"

# 推送并开 PR
git push -u origin feature/<desc>
gh pr create --fill

# 合入后清理
git checkout main && git pull
git branch -D feature/<desc>

# 发版（只在 main 上）
git tag -a v0.X.Y -m "..."
git push origin v0.X.Y
```

---

## 11. 本文件变更规则

本文件修改必须走 **`docs/claude-md-update` 分支 + PR + 明确的 why**。不允许偷偷改，不允许 AI 自行"优化"。

修改后同步更新：

- 根 `README.md`（若引用了本文件某节）
- `.github/pull_request_template.md`（若改了 PR 流程）

---

*本契约初版：v1.0.0 · 2026-04-23 · 伴随 KaiBlog DDD 重构启动*
