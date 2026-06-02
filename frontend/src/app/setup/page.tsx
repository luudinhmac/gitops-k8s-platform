import { redirect } from 'next/navigation';
import SetupClientPage from './SetupClientPage';

export default async function SetupPage() {
  const apiUrl = process.env.INTERNAL_API_URL || process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
  let finalApiUrl = apiUrl;
  
  if (finalApiUrl.startsWith('http') && !finalApiUrl.includes('/api')) {
    finalApiUrl = finalApiUrl.replace(/\/$/, '') + '/api';
  }
  if (!finalApiUrl.includes('/v1')) {
    finalApiUrl = finalApiUrl.replace(/\/$/, '') + '/v1';
  }

  let isInitialized = false;

  try {
    const res = await fetch(`${finalApiUrl}/setup/status`, {
      cache: 'no-store',
      signal: AbortSignal.timeout(3000)
    });
    if (res.ok) {
      const data = await res.json();
      isInitialized = !!data.isInitialized;
    }
  } catch (err) {
    console.error('Failed to check setup status on server:', err);
  }

  if (isInitialized) {
    redirect('/');
  }

  return <SetupClientPage />;
}
