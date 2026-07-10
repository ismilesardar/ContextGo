import { ForceLightTheme } from '@/components/layout/ThemeToggle/force-light-theme';

export default function LegalLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return <ForceLightTheme>{children}</ForceLightTheme>;
}
