import { describe, expect, it } from 'vitest';
import { InvariantViolation } from '../shared/DomainError.js';
import { Slug } from './Slug.js';

describe('Slug', () => {
  it('accepts lowercase kebab strings within length bounds', () => {
    const slug = Slug.of('hello-world-2026');
    expect(slug.value).toBe('hello-world-2026');
  });

  it('trims surrounding whitespace before validation', () => {
    const slug = Slug.of('  ai-column  ');
    expect(slug.value).toBe('ai-column');
  });

  it.each([
    'AB',
    'ab',
    '-leading',
    'trailing-',
    'double--hyphen',
    'has space',
    'Mixed-Case',
    'unicode-中文',
    '!!!',
  ])('rejects invalid slug %s', (raw) => {
    expect(() => Slug.of(raw)).toThrow(InvariantViolation);
  });

  it('rejects slugs longer than 100 characters', () => {
    const long = 'a'.repeat(101);
    expect(() => Slug.of(long)).toThrow(InvariantViolation);
  });

  it('compares by value', () => {
    expect(Slug.of('foo-bar').equals(Slug.of('foo-bar'))).toBe(true);
    expect(Slug.of('foo-bar').equals(Slug.of('foo-baz'))).toBe(false);
  });
});
