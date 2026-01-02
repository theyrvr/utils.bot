import type { Metadata } from 'next';
import '../styles/globals.css';
import Navigation from '@/components/Navigation';

export const metadata: Metadata = {
  title: 'Ticket Bot Dashboard',
  description: 'Complete Discord Ticket Bot Management Dashboard',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Navigation />
        <main className="container">
          {children}
        </main>
      </body>
    </html>
  );
}
