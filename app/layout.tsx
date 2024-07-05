import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ClerkProvider} from '@clerk/nextjs'
const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider
    appearance={{
      layout: {
        socialButtonsVariant: 'iconButton'
      },
      variables:{
        colorText: 'black',
        colorPrimary: '#0E78F9',
        colorInputBackground: '#252a41',
        colorInputText: '#fff'
      }
    }}>
    <html lang="en">
      <body className={`${inter.className} bg-dark-2`}>{children}</body>
    </html>
    </ClerkProvider>
  );
}
