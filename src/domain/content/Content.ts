import { InvariantViolation } from '../shared/DomainError.js';
import { type ContentId } from './ContentId.js';
import { type ContentStatus } from './ContentStatus.js';
import { type ContentType } from './ContentType.js';
import { type MediaRef } from './MediaRef.js';
import { type Slug } from './Slug.js';

const TITLE_MIN = 1;
const TITLE_MAX = 200;
const SUMMARY_MAX = 500;

export interface ContentSnapshot {
  id: string;
  type: ContentType;
  slug: string;
  title: string;
  summary: string | undefined;
  body: string | undefined;
  mediaRef: MediaRef | undefined;
  status: ContentStatus;
  publishedAt: Date | undefined;
  createdAt: Date;
  updatedAt: Date;
}

interface CreateDraftInput {
  id: ContentId;
  type: ContentType;
  slug: Slug;
  title: string;
  summary?: string;
  body?: string;
  mediaRef?: MediaRef;
  now?: Date;
}

interface RehydrateInput {
  id: ContentId;
  type: ContentType;
  slug: Slug;
  title: string;
  summary: string | undefined;
  body: string | undefined;
  mediaRef: MediaRef | undefined;
  status: ContentStatus;
  publishedAt: Date | undefined;
  createdAt: Date;
  updatedAt: Date;
}

export class Content {
  readonly id: ContentId;
  readonly type: ContentType;
  readonly createdAt: Date;

  #slug: Slug;
  #title: string;
  #summary: string | undefined;
  #body: string | undefined;
  #mediaRef: MediaRef | undefined;
  #status: ContentStatus;
  #publishedAt: Date | undefined;
  #updatedAt: Date;

  private constructor(props: RehydrateInput) {
    this.id = props.id;
    this.type = props.type;
    this.createdAt = props.createdAt;
    this.#slug = props.slug;
    this.#title = props.title;
    this.#summary = props.summary;
    this.#body = props.body;
    this.#mediaRef = props.mediaRef;
    this.#status = props.status;
    this.#publishedAt = props.publishedAt;
    this.#updatedAt = props.updatedAt;
  }

  static draft(input: CreateDraftInput): Content {
    const now = input.now ?? new Date();
    assertTitle(input.title);
    assertSummary(input.summary);
    assertTypeShape(input.type, input.body, input.mediaRef);
    return new Content({
      id: input.id,
      type: input.type,
      slug: input.slug,
      title: input.title.trim(),
      summary: input.summary?.trim(),
      body: input.body,
      mediaRef: input.mediaRef,
      status: 'DRAFT',
      publishedAt: undefined,
      createdAt: now,
      updatedAt: now,
    });
  }

  static rehydrate(input: RehydrateInput): Content {
    assertTitle(input.title);
    assertSummary(input.summary);
    assertTypeShape(input.type, input.body, input.mediaRef);
    assertPublishedConsistency(input.status, input.publishedAt);
    if (input.updatedAt < input.createdAt) {
      throw new InvariantViolation('updatedAt must not be earlier than createdAt');
    }
    return new Content(input);
  }

  get slug(): Slug { return this.#slug; }
  get title(): string { return this.#title; }
  get summary(): string | undefined { return this.#summary; }
  get body(): string | undefined { return this.#body; }
  get mediaRef(): MediaRef | undefined { return this.#mediaRef; }
  get status(): ContentStatus { return this.#status; }
  get publishedAt(): Date | undefined { return this.#publishedAt; }
  get updatedAt(): Date { return this.#updatedAt; }

  isVisibleToPublic(): boolean {
    return this.#status === 'PUBLIC';
  }

  publish(now: Date = new Date()): void {
    this.#status = 'PUBLIC';
    if (!this.#publishedAt) {
      this.#publishedAt = now;
    }
    this.#updatedAt = now;
  }

  restrictToLink(now: Date = new Date()): void {
    this.#status = 'LINK_ONLY';
    if (!this.#publishedAt) {
      this.#publishedAt = now;
    }
    this.#updatedAt = now;
  }

  moveToDraft(now: Date = new Date()): void {
    this.#status = 'DRAFT';
    this.#updatedAt = now;
  }

  rename(title: string, now: Date = new Date()): void {
    assertTitle(title);
    this.#title = title.trim();
    this.#updatedAt = now;
  }

  changeSlug(slug: Slug, now: Date = new Date()): void {
    this.#slug = slug;
    this.#updatedAt = now;
  }

  changeSummary(summary: string | undefined, now: Date = new Date()): void {
    assertSummary(summary);
    this.#summary = summary?.trim();
    this.#updatedAt = now;
  }

  changeBody(body: string | undefined, now: Date = new Date()): void {
    if (this.type !== 'ARTICLE') {
      throw new InvariantViolation('only ARTICLE content can have a body');
    }
    if (body === undefined || body.trim().length === 0) {
      throw new InvariantViolation('ARTICLE body must be a non-empty string');
    }
    this.#body = body;
    this.#updatedAt = now;
  }

  changeMediaRef(ref: MediaRef, now: Date = new Date()): void {
    if (this.type !== 'MEDIA_EMBED') {
      throw new InvariantViolation('only MEDIA_EMBED content carries a mediaRef');
    }
    this.#mediaRef = ref;
    this.#updatedAt = now;
  }

  toSnapshot(): ContentSnapshot {
    return {
      id: this.id.value,
      type: this.type,
      slug: this.#slug.value,
      title: this.#title,
      summary: this.#summary,
      body: this.#body,
      mediaRef: this.#mediaRef,
      status: this.#status,
      publishedAt: this.#publishedAt,
      createdAt: this.createdAt,
      updatedAt: this.#updatedAt,
    };
  }
}

function assertTitle(title: string): void {
  if (typeof title !== 'string') {
    throw new InvariantViolation('title must be a string');
  }
  const trimmed = title.trim();
  if (trimmed.length < TITLE_MIN || trimmed.length > TITLE_MAX) {
    throw new InvariantViolation(`title length must be between ${TITLE_MIN} and ${TITLE_MAX}`);
  }
}

function assertSummary(summary: string | undefined): void {
  if (summary === undefined) return;
  if (typeof summary !== 'string') {
    throw new InvariantViolation('summary must be a string when provided');
  }
  if (summary.length > SUMMARY_MAX) {
    throw new InvariantViolation(`summary must be at most ${SUMMARY_MAX} characters`);
  }
}

function assertTypeShape(
  type: ContentType,
  body: string | undefined,
  mediaRef: MediaRef | undefined,
): void {
  if (type === 'ARTICLE') {
    if (body === undefined || body.trim().length === 0) {
      throw new InvariantViolation('ARTICLE requires a non-empty body');
    }
    if (mediaRef !== undefined) {
      throw new InvariantViolation('ARTICLE must not carry a top-level mediaRef');
    }
    return;
  }
  if (type === 'MEDIA_EMBED') {
    if (mediaRef === undefined) {
      throw new InvariantViolation('MEDIA_EMBED requires a mediaRef');
    }
  }
}

function assertPublishedConsistency(status: ContentStatus, publishedAt: Date | undefined): void {
  if ((status === 'PUBLIC' || status === 'LINK_ONLY') && !publishedAt) {
    throw new InvariantViolation(`status ${status} requires a publishedAt timestamp`);
  }
}
