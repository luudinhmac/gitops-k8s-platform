import type { Metadata } from 'next';
import { Inter, Outfit } from 'next/font/google';
import './globals.css';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import { AuthProvider } from '../context/AuthContext';
import { ThemeProvider } from '../components/providers/ThemeProvider';

const inter = Inter({ 
  subsets: ['latin', 'vietnamese'],
  variable: '--font-inter',
});

const outfit = Outfit({ 
  subsets: ['latin'],
  variable: '--font-outfit',
});

export async function generateMetadata(): Promise<Metadata> {
  let siteTitle = 'LƯU ĐÌNH MÁC | System Engineer';
  let siteDesc = 'Portfolio giới thiệu các dự án và kỹ năng chuyên môn về System Engineering và Web Development.';
  
  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';
    const res = await fetch(`${apiUrl}/settings/public`, { next: { revalidate: 10 } });
    if (res.ok) {
      const data = await res.json();
      if (data.site_title) siteTitle = data.site_title;
      if (data.site_tagline) siteDesc = data.site_tagline;
    }
  } catch (err) {
    console.error('Failed to fetch settings for metadata:', err instanceof Error ? err.message : String(err));
  }

  return {
    title: siteTitle,
    description: siteDesc,
    keywords: ['Portfolio', 'System Engineer', 'Web Developer', 'Next.js', 'NestJS'],
  };
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="vi" className="h-full scroll-smooth" data-scroll-behavior="smooth" suppressHydrationWarning>
      <body suppressHydrationWarning className={`${inter.variable} ${outfit.variable} font-sans antialiased min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-300`}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem enableColorScheme>
          <AuthProvider>
            <Navbar />
            <main className="flex-grow">
              {children}
            </main>
            <Footer />
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
