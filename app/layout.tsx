import type { Metadata } from "next";
import { Lora } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers"
import Navbar from "./components/Navbar";
import { GetServerSideProps } from "next";

const lora = Lora({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Data Diary",
  description: "Casual explanations of data science principles with interactive visualizations.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={lora.className} suppressHydrationWarning>
      <head />
      <body>
        <Providers>
          <Navbar />
          {children}
        </Providers>
      </body>
    </html>
  );
}
