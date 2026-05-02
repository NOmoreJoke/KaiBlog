export const CONTENT_STATUSES = ['DRAFT', 'PUBLIC', 'LINK_ONLY'] as const;

export type ContentStatus = (typeof CONTENT_STATUSES)[number];

export function isContentStatus(value: unknown): value is ContentStatus {
  return typeof value === 'string' && (CONTENT_STATUSES as readonly string[]).includes(value);
}
