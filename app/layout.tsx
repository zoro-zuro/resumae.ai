import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import ConvexClientProvider from "@/components/ConvexClientProvider";
import { ClerkProvider } from "@clerk/nextjs";
import Header from "@/components/Header";
import Footer from "@/components/footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Resumae.ai",
  description:
    "Resumae.ai will help you create and manage your resume effortlessly.",
  icons: {
    icon: "/logo.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="min-h-screen">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased flex flex-col min-h-screen bg-background text-foreground`}
      >
        <ClerkProvider dynamic>
          <ConvexClientProvider>
            <Header />
            {/* Background with gradient and dot grid matching the purple theme */}
            <div className="fixed inset-0 -z-10">
              <div className="absolute inset-0 bg-gradient-to-b from-background via-background/95 to-background"></div>
              <div
                className="absolute inset-0 bg-[radial-gradient(circle,#63577D50_1px,transparent_1px)] 
                bg-[size:13px_13px]"
              />
            </div>
            {/* The main content area that expands to fill the space */}
            <main className="flex-grow w-full max-w-[1600px] mx-auto overflow-x-hidden">
              {children}
            </main>
            <Footer />
          </ConvexClientProvider>
        </ClerkProvider>
      </body>
    </html>
  );
}
