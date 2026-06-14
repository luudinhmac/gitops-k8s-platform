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
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://blog.luumac.io.vn';
  let siteTitle = 'LƯU ĐÌNH MÁC | System Engineer';
  let siteDesc = 'Portfolio giới thiệu các dự án và kỹ năng chuyên môn về System Engineering và Web Development.';
  
  try {
    const apiUrl = process.env.INTERNAL_API_URL || process.env.NEXT_PUBLIC_API_URL || '/api';
    let finalApiUrl = apiUrl;
    if (finalApiUrl.startsWith('http') && !finalApiUrl.includes('/api')) {
      finalApiUrl = finalApiUrl.replace(/\/$/, '') + '/api';
    }
    if (!finalApiUrl.includes('/v1')) {
      finalApiUrl = finalApiUrl.replace(/\/$/, '') + '/v1';
    }
    
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
  const nonce = headerList.get('x-nonce') || '';

  return (
    <html lang="vi" className="h-full scroll-smooth" data-scroll-behavior="smooth" suppressHydrationWarning>
      <head>
        <script
          nonce={nonce}
          suppressHydrationWarning
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                const observer = new MutationObserver((mutations) => {
                  for (const mutation of mutations) {
                    for (const node of mutation.addedNodes) {
                      if (node.nodeType === 1) {
                        if (node.hasAttribute('bis_skin_checked')) {
                          node.removeAttribute('bis_skin_checked');
                        }
                        const children = node.getElementsByTagName('*');
                        for (let i = 0; i < children.length; i++) {
                          if (children[i].hasAttribute('bis_skin_checked')) {
                            children[i].removeAttribute('bis_skin_checked');
                          }
                        }
                      }
                    }
                    if (mutation.type === 'attributes' && mutation.attributeName === 'bis_skin_checked') {
                      if (mutation.target.nodeType === 1 && mutation.target.hasAttribute('bis_skin_checked')) {
                        mutation.target.removeAttribute('bis_skin_checked');
                      }
                    }
                  }
                });
                observer.observe(document.documentElement, {
                  childList: true,
                  subtree: true,
                  attributes: true,
                  attributeFilter: ['bis_skin_checked']
                });
              })();
            `
          }}
        />
      </head>
      <body suppressHydrationWarning className={`${inter.variable} ${outfit.variable} font-sans antialiased min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-300`}>
        <ThemeProvider nonce={nonce} attribute="class" defaultTheme="system" enableSystem enableColorScheme>
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

