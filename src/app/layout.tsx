import Sidebar from '@/components/sidebar';
import AuthProvider from '@/providers/auth-provider';
import QueryProvider from '@/providers/query-provider';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { Toaster } from 'sonner';
import './globals.css';
import RealtimeListener from '@/components/realtime-listener';

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
    <html lang="en">
      <body
        className={`${inter.className} h-screen min-h-screen overflow-y-auto`}
      >
        <QueryProvider>
          <Toaster
            toastOptions={{ duration: 3000 }}
            theme="dark"
            richColors
            closeButton
          />
          <RealtimeListener />
          <AuthProvider>
            <div className="flex h-full">
              <Sidebar />
              <div className="flex-grow">{children}</div>
            </div>
          </AuthProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
