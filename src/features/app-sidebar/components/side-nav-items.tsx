'use client';

import { Icons } from '@/components/icons';
import { Badge } from '@/components/ui/badge';
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem
} from '@/components/ui/sidebar';
import { usePermissions } from '@/hooks/workspace/use-workspace-has-permission';
import { NavItem } from '@/types';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface NavItems {
  label: string;
  items: NavItem[];
}

interface SideNavItemsProps {
  workspaceSlug: string;
  navType: string;
  userPermission?: boolean;
  navItems: NavItems[];
  pinnedItems?: NavItem[];
}

export const SideNavItems = ({
  navType,
  workspaceSlug,
  userPermission = false,
  navItems = [],
  pinnedItems = []
}: SideNavItemsProps) => {
  const pathname = usePathname();
  const { hasPermission } = usePermissions();

  // Workspace permission
  const canBillingRead = hasPermission('billing', 'read');

  return (
    <motion.div
      key={navType}
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.2 }}
    >
      {/* Pinned items — no section label */}
      {pinnedItems.length > 0 && (
        <SidebarGroup>
          <SidebarMenu>
            {pinnedItems.map((item) => {
              const Icon = item.icon ? Icons[item.icon] : Icons.logo;
              return (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    tooltip={item.title}
                    isActive={pathname.endsWith(item.url)}
                  >
                    <Link
                      href={
                        workspaceSlug
                          ? `/${workspaceSlug}${item.url}`
                          : item.url
                      }
                    >
                      <Icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              );
            })}
          </SidebarMenu>
        </SidebarGroup>
      )}

      {navItems.map((accountNav) => {
        return (
          <SidebarGroup key={accountNav.label}>
            <SidebarGroupLabel>{accountNav.label}</SidebarGroupLabel>
            <SidebarMenu>
              {accountNav.items.map((item) => {
                const Icon = item.icon ? Icons[item.icon] : Icons.logo;
                if (!userPermission && item.isAdmin) {
                  return null;
                } else {
                  if (
                    item?.title?.toLocaleLowerCase() === 'billing' &&
                    !canBillingRead
                  )
                    return null;

                  return (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton
                        asChild
                        tooltip={item.title}
                        isActive={pathname.endsWith(item.url)}
                      >
                        <Link
                          href={
                            workspaceSlug
                              ? `/${workspaceSlug}${item.url}`
                              : item.url
                          }
                        >
                          <Icon />
                          <span>{item.title}</span>

                          {item.badge && (
                            <Badge
                              variant='outline'
                              className='gap-1.5 rounded-full px-3 py-1 text-[7px] tracking-wider uppercase'
                            >
                              {item.badge}
                            </Badge>
                          )}
                        </Link>
                        {}
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                }
              })}
            </SidebarMenu>
          </SidebarGroup>
        );
      })}
    </motion.div>
  );
};
