import RealtimeListener from '@/components/realtime-listener';
import Sidebar from '@/components/sidebar';
import AuthProvider from '@/providers/auth-provider';
import QueryProvider from '@/providers/query-provider';
import { ThemeProvider } from '@/providers/theme-provider';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { Toaster } from 'sonner';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Flashey',
  description: 'Realtime chat that feels like flash'
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${inter.className} text-black dark:bg-gray-900 dark:text-white`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          disableTransitionOnChange
        >
          <QueryProvider>
            <Toaster
              toastOptions={{ duration: 3000 }}
              theme="dark"
              richColors
              closeButton
            />
            <AuthProvider>
              <div className="flex">
                <Sidebar />
                <div className="flex-grow">{children}</div>
              </div>
              <RealtimeListener />
            </AuthProvider>
          </QueryProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
