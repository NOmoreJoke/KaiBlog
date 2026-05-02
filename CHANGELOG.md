# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- S0 scaffold: DDD three-layer repo layout, CLAUDE.md collaboration contract,
  Conventional Commits setup, CI skeleton, PR template, `.editorconfig`,
  `.gitignore`, and placeholder READMEs for each layer.
- S1: shared kernel (`Id`, `DomainError`) and `content` domain — `Content`
  aggregate root with `Slug`, `ContentType`, `ContentStatus`, `MediaRef` value
  objects and `ContentRepository` port. Vitest specs cover invariants and
  lifecycle transitions.

### Changed
- `tsconfig.json` no longer excludes test files so ESLint and `tsc --noEmit`
  cover them; production build still strips them via `tsconfig.build.json`.

[Unreleased]: https://github.com/NOmoreJoke/KaiBlog/commits/main
