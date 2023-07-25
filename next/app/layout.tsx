"use client"
import AppBar from "../components/AppBar"
import { ThemeProvider } from "@/components/theme-provider"

import "./globals.css"

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head />
      <body>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>

          <div className="flex w-full h-screen overflow-auto">
            <AppBar />
            <div className="container">{children}</div>
          </div>
        </ThemeProvider>
      </body>
    </html>
  )
}
