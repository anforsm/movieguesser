import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "./components/navbar";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Movieguesser V2",
  description: "Guess the movie",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="og">
      <body className={inter.className + " bg-primary-900"}>
        <div className="relative h-screen min-h-screen w-screen overflow-y-auto overflow-x-hidden bg-primary-900 text-text-col flex flex-col justify-center">
          <div className="h-[2rem]">
            <Navbar/>
          </div>

          <div className="flex items-center justify-center flex-col grow w-screen">
            {children}
          </div>
        </div>
      </body>
    </html>
  );
}
