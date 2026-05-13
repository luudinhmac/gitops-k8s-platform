'use client';

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || '/api';
const FINAL_API_URL = API_URL.endsWith('/v1') ? API_URL : `${API_URL}/v1`;

export function SetupRedirectCheck() {
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // Don't check if already on the setup page
    if (pathname === '/setup') return;

    const checkStatus = async () => {
      try {
        const res = await axios.get(`${FINAL_API_URL}/setup/status`);
        if (res.data && res.data.isInitialized === false) {
          router.push('/setup');
        }
      } catch (err) {
        // Silently fail if API is not reachable yet
        console.error('Setup status check failed:', err);
      }
    };

    checkStatus();
  }, [pathname, router]);

  return null;
}
