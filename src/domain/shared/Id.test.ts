import { describe, expect, it } from 'vitest';
import { InvariantViolation } from './DomainError.js';
import { Id } from './Id.js';

class TestId extends Id<'TestId'> {
  private constructor(value: string) {
    super(value, 'TestId');
  }
  static of(value: string): TestId {
    return new TestId(value);
  }
}

class OtherId extends Id<'OtherId'> {
  private constructor(value: string) {
    super(value, 'OtherId');
  }
  static of(value: string): OtherId {
    return new OtherId(value);
  }
}

const SAMPLE_UUID = '550e8400-e29b-41d4-a716-446655440000';

describe('Id', () => {
  it('accepts UUID v4 strings and lowercases them', () => {
    const id = TestId.of(SAMPLE_UUID.toUpperCase());
    expect(id.value).toBe(SAMPLE_UUID);
  });

  it('rejects non-UUID strings', () => {
    expect(() => TestId.of('not-a-uuid')).toThrow(InvariantViolation);
    expect(() => TestId.of('')).toThrow(InvariantViolation);
  });

  it('compares equal only for same brand and value', () => {
    const a = TestId.of(SAMPLE_UUID);
    const b = TestId.of(SAMPLE_UUID);
    const other = OtherId.of(SAMPLE_UUID);
    expect(a.equals(b)).toBe(true);
    expect(a.equals(other as unknown as TestId)).toBe(false);
  });
});
