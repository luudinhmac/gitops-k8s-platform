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
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://luudinhmac.com';
  let siteTitle = 'LƯU ĐÌNH MÁC | System Engineer';
  let siteDesc = 'Portfolio giới thiệu các dự án và kỹ năng chuyên môn về System Engineering và Web Development.';
  
  try {
    const apiUrl = process.env.INTERNAL_API_URL || process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3002/api';
    const finalApiUrl = apiUrl.endsWith('/v1') ? apiUrl : `${apiUrl}/v1`;
    const res = await fetch(`${finalApiUrl}/settings/public`, { next: { revalidate: 10 } });
    if (res.ok) {
      const data = await res.json();
      if (data.site_title) siteTitle = data.site_title;
      if (data.site_tagline) siteDesc = data.site_tagline;
    }
  } catch (err) {
    console.error('Failed to fetch settings for metadata:', err instanceof Error ? err.message : String(err));
  }

  return {
    metadataBase: new URL(baseUrl),
    title: {
      default: siteTitle,
      template: `%s | ${siteTitle.split('|')[0].trim()}`,
    },
    description: siteDesc,
    keywords: ['Portfolio', 'System Engineer', 'Web Developer', 'Next.js', 'NestJS', 'DevOps', 'Cloud Computing', 'Automation'],
    authors: [{ name: 'Lưu Đình Mác' }],
    creator: 'Lưu Đình Mác',
    publisher: 'Lưu Đình Mác',
    formatDetection: {
      email: false,
      address: false,
      telephone: false,
    },
    icons: {
      icon: '/favicon.ico',
      shortcut: '/favicon.ico',
      apple: '/favicon.ico', // Placeholder, usually these are different
    },
    openGraph: {
      title: siteTitle,
      description: siteDesc,
      url: baseUrl,
      siteName: siteTitle,
      locale: 'vi_VN',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: siteTitle,
      description: siteDesc,
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
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

