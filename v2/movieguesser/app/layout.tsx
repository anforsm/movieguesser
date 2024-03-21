import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "./components/navbar";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Movieguesser",
  description: "Guess the movie",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="relative h-full max-h-screen min-h-screen w-screen overflow-y-auto overflow-x-hidden bg-primary-900 text-text-col">
          <Navbar/>

          <div className="flex-center z-10 flex-col">
            {children}
          </div>
        </div>
      </body>
    </html>
  );
}
