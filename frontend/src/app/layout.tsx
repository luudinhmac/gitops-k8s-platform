import type { Metadata } from 'next';
import { Inter, Outfit } from 'next/font/google';
import './globals.css';
import ConditionalLayout from '../components/layout/ConditionalLayout';
import { AuthProvider } from '../context/AuthContext';
import { ThemeProvider } from '../components/providers/ThemeProvider';
import { SetupRedirectCheck } from '@/components/layout/SetupRedirectCheck';
import { redirect } from 'next/navigation';
import { headers } from 'next/headers';

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
    const apiUrl = process.env.INTERNAL_API_URL || process.env.NEXT_PUBLIC_API_URL || '/api';
    const finalApiUrl = apiUrl.endsWith('/v1') ? apiUrl : `${apiUrl}/v1`;
    
    // Only fetch if we have an absolute URL (needed for SSR/Build time)
    if (finalApiUrl.startsWith('http')) {
      const res = await fetch(`${finalApiUrl}/settings/public`, { 
        next: { revalidate: 10 },
        signal: AbortSignal.timeout(5000)
      });
      if (res.ok) {
        const data = await res.json();
        if (data.site_title) siteTitle = data.site_title;
        if (data.site_tagline) siteDesc = data.site_tagline;
      }
    }
  } catch (err) {
    console.error('Failed to fetch settings for metadata:', err instanceof Error ? err.message : String(err));
  }

  // Check if system is initialized
  try {
    const apiUrl = process.env.INTERNAL_API_URL || process.env.NEXT_PUBLIC_API_URL;
    if (!apiUrl) throw new Error('INTERNAL_API_URL or NEXT_PUBLIC_API_URL is not defined');
    const finalApiUrl = apiUrl.endsWith('/v1') ? apiUrl : `${apiUrl}/v1`;
    
    // This runs on every page load (server-side)
    const setupRes = await fetch(`${finalApiUrl}/setup/status`, { 
      next: { revalidate: 60 }, // Cache for 1 minute
      signal: AbortSignal.timeout(3000)
    });
    
    if (setupRes.ok) {
      const setupData = await setupRes.json();
      // We can't redirect directly from here in a Server Component without 'next/navigation'
      // But we can pass this info to a client component if needed.
      // Actually, for better UX, we'll do the redirect in a small client component inside the body.
    }
  } catch (err) {
    console.error('Failed to check setup status:', err);
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



export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const headerList = await headers();
  const pathname = headerList.get('x-invoke-path') || ''; // Note: this might not work in all environments
  
  // Alternative: check in a client component or just do it here if possible
  // In Next.js 15+, we can use headers to get the URL
  
  try {
    const apiUrl = process.env.INTERNAL_API_URL || process.env.NEXT_PUBLIC_API_URL;
    if (!apiUrl) throw new Error('INTERNAL_API_URL or NEXT_PUBLIC_API_URL is not defined');
    const finalApiUrl = apiUrl.endsWith('/v1') ? apiUrl : `${apiUrl}/v1`;
    
    const setupRes = await fetch(`${finalApiUrl}/setup/status`, { 
      next: { revalidate: 60 },
      signal: AbortSignal.timeout(2000)
    });
    
    if (setupRes.ok) {
      const setupData = await setupRes.json();
      if (!setupData.isInitialized) {
        // We need to check if we are already on /setup to avoid infinite loop
        // Since we don't have easy access to pathname in Layout, we'll use a Client Component for the redirect
        // OR we can try to get it from headers if middleware is configured.
      }
    }
  } catch (err) {
    // Fail silently to avoid breaking the site if API is down
  }

  return (
    <html lang="vi" className="h-full scroll-smooth" data-scroll-behavior="smooth" suppressHydrationWarning>
      <body suppressHydrationWarning className={`${inter.variable} ${outfit.variable} font-sans antialiased min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-300`}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem enableColorScheme>
          <AuthProvider>
            <SetupRedirectCheck />
            <ConditionalLayout>
              {children}
            </ConditionalLayout>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}

// ... rest of the file stays same

