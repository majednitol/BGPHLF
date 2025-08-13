'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { jwtDecode } from 'jwt-decode';
import { ClipLoader } from 'react-spinners';

export default function HomePage() {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (!token) {
      router.replace('/user/login-user');
      return;
    }

    try {
      const decoded = jwtDecode(token);
      const role = decoded?.role;

      if (role) {
        router.replace('/dashboard');
      } else {
        localStorage.removeItem('authToken');
        router.replace('/user/login-user');
      }
    } catch {
      localStorage.removeItem('authToken');
      router.replace('/user/login-user');
    }
  }, [router]);

  return (
    <div style={{ height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <ClipLoader size={50} color="#3498db" />
    </div>
  );
}
