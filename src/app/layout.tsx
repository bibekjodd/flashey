import Sidebar from '@/components/sidebar';
import AuthProvider from '@/providers/auth-provider';
import QueryProvider from '@/providers/query-provider';
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
    <html lang="en">
      <body className={inter.className}>
        <QueryProvider>
          <Toaster
            toastOptions={{ duration: 3000 }}
            theme="dark"
            richColors
            closeButton
          />
          <AuthProvider>
            <div className="flex">
              <div>
                <Sidebar />
              </div>
              {children}
            </div>
          </AuthProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
