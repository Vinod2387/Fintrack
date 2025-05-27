import type {Metadata} from 'next';
import {GeistSans} from 'geist/font/sans';
import {GeistMono} from 'geist/font/mono';
import './globals.css';
import {SidebarProvider} from '@/components/ui/sidebar';
import {AppShell} from '@/components/layout/app-shell';
import {Toaster} from '@/components/ui/toaster';
import {FinancialDataProvider} from '@/contexts/financial-data-context';

const geistSans = GeistSans;
const geistMono = GeistMono;

export const metadata: Metadata = {
  title: 'FinTrack',
  description: 'Budgeting and expense tracking app.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <FinancialDataProvider>
          <SidebarProvider defaultOpen={true}>
            <AppShell>{children}</AppShell>
          </SidebarProvider>
        </FinancialDataProvider>
        <Toaster />
      </body>
    </html>
  );
}
