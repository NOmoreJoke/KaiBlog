import { Id } from '../shared/Id.js';

export class ContentId extends Id<'ContentId'> {
  private constructor(value: string) {
    super(value, 'ContentId');
  }

  static of(value: string): ContentId {
    return new ContentId(value);
  }
}
