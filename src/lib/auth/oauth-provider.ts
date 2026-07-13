import GitHubSvg from '@/components/svg/github-svg';
import GoogleSvg from '@/components/svg/google-svg';
import { ComponentProps, ElementType } from 'react';

export const SUPPORTED_OAUTH_PROVIDERS = ['google', 'github'] as const;
export type SupportedOAuthProvider = (typeof SUPPORTED_OAUTH_PROVIDERS)[number];

export const SUPPORTED_OAUTH_PROVIDER_DETAILS: Record<
  SupportedOAuthProvider,
  { name: string; Icon: ElementType<ComponentProps<'svg'>> }
> = {
  google: { name: 'Google', Icon: GoogleSvg },
  github: { name: 'GitHub', Icon: GitHubSvg }
};
