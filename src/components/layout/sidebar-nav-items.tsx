
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  SidebarMenuItem,
  SidebarMenuButton,
} from '@/components/ui/sidebar';
import {
  LayoutDashboard,
  Landmark,
  CreditCard,
  Target,
  BarChart3,
  Lightbulb,
  DollarSign,
} from 'lucide-react'; // Added DollarSign
import type { LucideIcon } from 'lucide-react';

interface NavItem {
  href: string;
  label: string;
  icon: LucideIcon;
  tooltip: string;
}

const navItems: NavItem[] = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard, tooltip: 'Dashboard' },
  { href: '/salary', label: 'Salary', icon: DollarSign, tooltip: 'Manage Salary' },
  { href: '/expenses', label: 'Expenses', icon: CreditCard, tooltip: 'Track Expenses' },
  { href: '/budgets', label: 'Budgets', icon: Target, tooltip: 'Set Budgets' },
  { href: '/reports', label: 'Reports', icon: BarChart3, tooltip: 'View Reports' },
  { href: '/tips', label: 'Financial Tips', icon: Lightbulb, tooltip: 'Get Tips' },
];

export function SidebarNavItems() {
  const pathname = usePathname();

  return (
    <>
      {navItems.map((item) => (
        <SidebarMenuItem key={item.href}>
          <Link href={item.href} passHref legacyBehavior>
            <SidebarMenuButton
              asChild
              isActive={pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href))}
              tooltip={item.tooltip}
              className="text-sidebar-foreground transition-colors duration-150 ease-in-out hover:bg-sidebar-accent hover:text-sidebar-accent-foreground data-[active=true]:bg-sidebar-primary data-[active=true]:text-sidebar-primary-foreground data-[active=true]:font-medium"
            >
              <a>
                <item.icon className="w-5 h-5" />
                <span>{item.label}</span>
              </a>
            </SidebarMenuButton>
          </Link>
        </SidebarMenuItem>
      ))}
    </>
  );
}
