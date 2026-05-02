import { InvariantViolation } from './DomainError.js';

const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export abstract class Id<TBrand extends string> {
  readonly value: string;
  readonly #brand: TBrand;

  protected constructor(value: string, brand: TBrand) {
    if (typeof value !== 'string' || !UUID_PATTERN.test(value)) {
      throw new InvariantViolation(`${brand} must be a UUID v4 string`);
    }
    this.value = value.toLowerCase();
    this.#brand = brand;
  }

  equals(other: Id<TBrand>): boolean {
    return this.#brand === other.#brand && this.value === other.value;
  }

  toString(): string {
    return this.value;
  }
}
