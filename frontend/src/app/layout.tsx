import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from 'react-hot-toast';
import Icon from '../assets/linkvault-icon.svg';

export const metadata: Metadata = {
  title: "LinkVault",
  description: "LinkVault is a platform for storing and sharing links.",
  icons: [{ rel: 'icon', url: Icon.src }],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.6.0/css/all.min.css" integrity="sha512-Kc323vGBEqzTmouAECnVceyQqyqdsSiqLQISBL29aUW4U/M7pSPA/gEUZQqv1cwx4OnYxTxve5UMg5GT6L4JJg==" crossOrigin="anonymous" referrerPolicy="no-referrer" />
      </head>
      <body className="bg-lessLight dark:bg-lessDark dark:text-white min-h-screen">
        <Toaster position="top-center" reverseOrder={false} />
        {children}
      </body>
    </html>
  );
}