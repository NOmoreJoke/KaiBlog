import { type Content } from './Content.js';
import { type ContentId } from './ContentId.js';
import { type ContentStatus } from './ContentStatus.js';
import { type ContentType } from './ContentType.js';
import { type Slug } from './Slug.js';

export interface ContentListFilter {
  type?: ContentType;
  status?: ContentStatus;
  limit?: number;
  cursor?: string;
}

export interface ContentRepository {
  findById(id: ContentId): Promise<Content | null>;
  findBySlug(slug: Slug): Promise<Content | null>;
  listPublished(filter?: ContentListFilter): Promise<readonly Content[]>;
  save(content: Content): Promise<void>;
  delete(id: ContentId): Promise<void>;
}
