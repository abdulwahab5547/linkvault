"use client"

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import MainPart from "../components/mainpart";
import Navbar from "../components/navbar/page";

function Main() {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
    }
  }, [router]);

  return (
    <div className="">
      <div className="max-w-[1450px] m-auto px-8 pb-5">
        <Navbar/>
        <MainPart/>
      </div>
    </div>
  );
}

export default Main;