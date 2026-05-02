import { describe, expect, it } from 'vitest';
import { InvariantViolation } from '../shared/DomainError.js';
import { Content } from './Content.js';
import { ContentId } from './ContentId.js';
import { MediaRef } from './MediaRef.js';
import { Slug } from './Slug.js';

const ID = ContentId.of('11111111-1111-4111-8111-111111111111');
const SLUG = Slug.of('hello-world');
const NOW = new Date('2026-05-02T00:00:00Z');
const LATER = new Date('2026-05-03T00:00:00Z');

const MEDIA_REF = MediaRef.of({
  provider: 'xiaoyuzhou',
  externalUrl: 'https://www.xiaoyuzhoufm.com/episode/abc',
  showName: 'Some Show',
});

describe('Content.draft', () => {
  it('creates an ARTICLE draft with body', () => {
    const c = Content.draft({
      id: ID,
      type: 'ARTICLE',
      slug: SLUG,
      title: '  Hello  ',
      body: 'a paragraph',
      now: NOW,
    });
    expect(c.status).toBe('DRAFT');
    expect(c.title).toBe('Hello');
    expect(c.publishedAt).toBeUndefined();
    expect(c.createdAt).toEqual(NOW);
    expect(c.updatedAt).toEqual(NOW);
  });

  it('rejects ARTICLE without body', () => {
    expect(() =>
      Content.draft({ id: ID, type: 'ARTICLE', slug: SLUG, title: 'x', now: NOW }),
    ).toThrow(InvariantViolation);
  });

  it('rejects ARTICLE with mediaRef at top level', () => {
    expect(() =>
      Content.draft({
        id: ID,
        type: 'ARTICLE',
        slug: SLUG,
        title: 'x',
        body: 'y',
        mediaRef: MEDIA_REF,
        now: NOW,
      }),
    ).toThrow(InvariantViolation);
  });

  it('rejects MEDIA_EMBED without mediaRef', () => {
    expect(() =>
      Content.draft({ id: ID, type: 'MEDIA_EMBED', slug: SLUG, title: 'x', now: NOW }),
    ).toThrow(InvariantViolation);
  });

  it('rejects empty title', () => {
    expect(() =>
      Content.draft({ id: ID, type: 'ARTICLE', slug: SLUG, title: '   ', body: 'y', now: NOW }),
    ).toThrow(InvariantViolation);
  });
});

describe('Content lifecycle', () => {
  function makeArticle(): Content {
    return Content.draft({
      id: ID,
      type: 'ARTICLE',
      slug: SLUG,
      title: 'Hello',
      body: 'body',
      now: NOW,
    });
  }

  it('publish transitions DRAFT -> PUBLIC and stamps publishedAt', () => {
    const c = makeArticle();
    c.publish(LATER);
    expect(c.status).toBe('PUBLIC');
    expect(c.publishedAt).toEqual(LATER);
    expect(c.updatedAt).toEqual(LATER);
  });

  it('moveToDraft preserves publishedAt history', () => {
    const c = makeArticle();
    c.publish(LATER);
    c.moveToDraft(LATER);
    expect(c.status).toBe('DRAFT');
    expect(c.publishedAt).toEqual(LATER);
  });

  it('changeBody is rejected on MEDIA_EMBED', () => {
    const c = Content.draft({
      id: ID,
      type: 'MEDIA_EMBED',
      slug: SLUG,
      title: 'episode',
      mediaRef: MEDIA_REF,
      now: NOW,
    });
    expect(() => c.changeBody('text', LATER)).toThrow(InvariantViolation);
  });

  it('changeMediaRef is rejected on ARTICLE', () => {
    const c = makeArticle();
    expect(() => c.changeMediaRef(MEDIA_REF, LATER)).toThrow(InvariantViolation);
  });
});

describe('Content.rehydrate', () => {
  it('rejects PUBLIC without publishedAt', () => {
    expect(() =>
      Content.rehydrate({
        id: ID,
        type: 'ARTICLE',
        slug: SLUG,
        title: 'x',
        summary: undefined,
        body: 'y',
        mediaRef: undefined,
        status: 'PUBLIC',
        publishedAt: undefined,
        createdAt: NOW,
        updatedAt: NOW,
      }),
    ).toThrow(InvariantViolation);
  });

  it('rejects updatedAt earlier than createdAt', () => {
    expect(() =>
      Content.rehydrate({
        id: ID,
        type: 'ARTICLE',
        slug: SLUG,
        title: 'x',
        summary: undefined,
        body: 'y',
        mediaRef: undefined,
        status: 'DRAFT',
        publishedAt: undefined,
        createdAt: LATER,
        updatedAt: NOW,
      }),
    ).toThrow(InvariantViolation);
  });
});
