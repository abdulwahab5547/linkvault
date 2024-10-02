"use client"

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Start from './start/page';

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      router.push('/main');
    }
  }, [router]);

  return <Start />;
}
