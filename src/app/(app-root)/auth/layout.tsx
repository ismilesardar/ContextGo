import { ForceLightTheme } from '@/components/layout/ThemeToggle/force-light-theme';

export default function AuthLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return <ForceLightTheme>{children}</ForceLightTheme>;
}
