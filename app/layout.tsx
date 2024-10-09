import type { Metadata } from "next"
import { Lora } from "next/font/google"
import "./globals.css"
import "katex/dist/katex.min.css"
import { Providers } from "./providers"
import Navbar from "./app_components/Navbar"

const lora = Lora({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Data Diary",
  description: "Data science explanations and experiments with dynamic visualizations.",
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={lora.className} suppressHydrationWarning>
      <body>
        <Providers>
          <Navbar />
          {children}
        </Providers>
      </body>
    </html>
  )
}
