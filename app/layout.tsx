import "./globals.css"
import { Inter } from "next/font/google"

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "Tints & Hints",
  description: "Multiplayer Color Guessing Game",
  openGraph: {
    title: "Tints & Hints",
    description: "Multiplayer Color Guessing Game",
    url: "https://tints-and-hints.vercel.app/",
    siteName: "Tints & Hints",
    images: [
      {
        url: "https://tints-and-hints.vercel.app/og-image.png",
        width: 800,
        height: 600,
      },
    ],
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={inter.className}>
      <body>{children}</body>
    </html>
  )
}
