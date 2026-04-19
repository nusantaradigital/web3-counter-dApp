import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "react-hot-toast";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Web3 Dashboard",
  description: "My first dApp",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">

        {children}

        {/* 🔥 TOAST GLOBAL */}
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              background: "#111827",
              color: "#fff",
              border: "1px solid #333",
            },
          }}
        />

      </body>
    </html>
  );
}