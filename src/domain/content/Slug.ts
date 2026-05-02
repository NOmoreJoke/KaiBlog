import { InvariantViolation } from '../shared/DomainError.js';

const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const MIN_LENGTH = 3;
const MAX_LENGTH = 100;

export class Slug {
  readonly value: string;

  private constructor(value: string) {
    this.value = value;
  }

  static of(raw: string): Slug {
    if (typeof raw !== 'string') {
      throw new InvariantViolation('slug must be a string');
    }
    const trimmed = raw.trim();
    if (trimmed.length < MIN_LENGTH || trimmed.length > MAX_LENGTH) {
      throw new InvariantViolation(
        `slug length must be between ${MIN_LENGTH} and ${MAX_LENGTH} characters`,
      );
    }
    if (!SLUG_PATTERN.test(trimmed)) {
      throw new InvariantViolation(
        'slug must contain only lowercase letters, digits, and single hyphens',
      );
    }
    return new Slug(trimmed);
  }

  equals(other: Slug): boolean {
    return this.value === other.value;
  }

  toString(): string {
    return this.value;
  }
}
