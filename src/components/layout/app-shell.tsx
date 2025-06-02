
'use client';

import type { ReactNode } from 'react';
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarProvider,
  SidebarTrigger,
  useSidebar,
} from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import { SidebarNavItems } from './sidebar-nav-items';
import { ScrollArea } from "@/components/ui/scroll-area";
import { Landmark, PanelLeft } from 'lucide-react'; // Using Landmark for FinTrack logo, PanelLeft for trigger

export function AppShell({ children }: { children: ReactNode }) {
  const { open, setOpen, isMobile, openMobile, setOpenMobile } = useSidebar();

  // Use a different variant for desktop and mobile for the sidebar itself.
  // The `collapsible` prop is for desktop only.
  const sidebarVariant = isMobile ? "sidebar" : "sidebar";
  const sidebarCollapsible = isMobile ? "offcanvas" : "icon";

  return (
    <div className="flex min-h-screen w-full">
      <Sidebar
        variant={sidebarVariant}
        collapsible={sidebarCollapsible}
        className="border-r bg-sidebar text-sidebar-foreground"
      >
        <SidebarHeader className="p-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Landmark className="w-7 h-7 text-primary" />
            <h1 className="text-xl font-semibold text-sidebar-foreground group-data-[collapsible=icon]:hidden">
              FinTrack
            </h1>
          </div>
          {isMobile && (
             <Button variant="ghost" size="icon" onClick={() => setOpenMobile(false)} className="text-sidebar-foreground">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
            </Button>
          )}
        </SidebarHeader>
        <ScrollArea className="flex-1">
          <SidebarContent className="p-2">
            <SidebarMenu>
              <SidebarNavItems />
            </SidebarMenu>
          </SidebarContent>
        </ScrollArea>
      </Sidebar>
      <SidebarInset className="flex-1 flex flex-col bg-background">
        <header className="sticky top-0 z-40 flex h-14 items-center gap-4 border-b bg-background/80 backdrop-blur-sm px-4 lg:h-[60px] lg:px-6">
            {/* 
              The desktop trigger block was removed as it was effectively hidden due to `!isMobile && className="md:hidden"`.
              If a desktop header trigger is needed, <SidebarTrigger /> can be used directly here with appropriate desktop visibility classes.
              Currently, sidebar toggling on desktop is often handled by SidebarRail or persistence.
            */}
            {isMobile && (
              // Use Button directly with PanelLeft icon to avoid nesting and control onClick precisely for opening.
              // The mobile sidebar (sheet) has its own close button.
              <Button variant="ghost" size="icon" onClick={() => setOpenMobile(true)} className="h-7 w-7 md:hidden">
                <PanelLeft />
                <span className="sr-only">Open sidebar</span>
              </Button>
            )}
           <div className="flex-1">
             {/* Potentially add breadcrumbs or page title here */}
           </div>
           {/* User profile dropdown or settings can go here */}
        </header>
        <main className="flex-1 p-4 sm:p-6 overflow-auto">
          {children}
        </main>
      </SidebarInset>
    </div>
  );
}
