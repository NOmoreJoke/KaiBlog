import { InvariantViolation } from '../shared/DomainError.js';

export const MEDIA_PROVIDERS = [
  'xiaoyuzhou',
  'youtube',
  'bilibili',
  'apple_podcast',
] as const;

export type MediaProvider = (typeof MEDIA_PROVIDERS)[number];

export interface MediaRefProps {
  provider: MediaProvider;
  externalUrl: string;
  coverUrl?: string;
  durationSec?: number;
  showName?: string;
  episodeTitle?: string;
}

export class MediaRef {
  readonly provider: MediaProvider;
  readonly externalUrl: string;
  readonly coverUrl?: string;
  readonly durationSec?: number;
  readonly showName?: string;
  readonly episodeTitle?: string;

  private constructor(props: MediaRefProps) {
    this.provider = props.provider;
    this.externalUrl = props.externalUrl;
    this.coverUrl = props.coverUrl;
    this.durationSec = props.durationSec;
    this.showName = props.showName;
    this.episodeTitle = props.episodeTitle;
  }

  static of(props: MediaRefProps): MediaRef {
    if (!(MEDIA_PROVIDERS as readonly string[]).includes(props.provider)) {
      throw new InvariantViolation(`unsupported media provider: ${String(props.provider)}`);
    }
    if (!isHttpUrl(props.externalUrl)) {
      throw new InvariantViolation('externalUrl must be an http(s) URL');
    }
    if (props.coverUrl !== undefined && !isHttpUrl(props.coverUrl)) {
      throw new InvariantViolation('coverUrl must be an http(s) URL when provided');
    }
    if (
      props.durationSec !== undefined &&
      (!Number.isInteger(props.durationSec) || props.durationSec < 0)
    ) {
      throw new InvariantViolation('durationSec must be a non-negative integer');
    }
    return new MediaRef(props);
  }
}

function isHttpUrl(value: string): boolean {
  if (typeof value !== 'string') return false;
  try {
    const url = new URL(value);
    return url.protocol === 'http:' || url.protocol === 'https:';
  } catch {
    return false;
  }
}
