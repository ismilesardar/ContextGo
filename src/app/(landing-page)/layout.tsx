import { ForceLightTheme } from '@/components/layout/ThemeToggle/force-light-theme';
import { APP_NAME } from '@/config/url.config';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: `${APP_NAME} – The Knowledge Layer for AI-Powered Teams`,
  description:
    'Organize, version, and publish your project knowledge so every AI tool your team uses — Claude, ChatGPT, Cursor, and more — works from the same approved standards.'
};

export default function LandingPageLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return <ForceLightTheme>{children}</ForceLightTheme>;
}
