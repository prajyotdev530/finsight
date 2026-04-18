import { useEffect } from 'react';
import { useRouter } from 'next/router';

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to the Vite SPA frontend
    window.location.href = '/app/index.html';
  }, []);

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      height: '100vh',
      fontFamily: 'Inter, sans-serif',
      background: '#F0F4F0',
    }}>
      <div style={{ textAlign: 'center' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 800, color: '#0A0A0A', marginBottom: 8 }}>
          FinSight
        </h1>
        <p style={{ color: '#6B7280', fontSize: '0.9rem' }}>Redirecting to dashboard…</p>
      </div>
    </div>
  );
}
