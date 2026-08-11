import { Analytics } from "@vercel/analytics/next"
import type { Metadata, Viewport } from "next"
import { Inter } from "next/font/google"
import { StoreProvider } from "@/components/store-provider"
import { AppShell } from "@/components/app-shell"
import { Toaster } from "@/components/ui/sonner"
import { ThemeProvider } from "next-themes"
import "./globals.css"

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
})

export const metadata: Metadata = {
  title: "S-interio — Internal Knowledge Base",
  description:
    "Internal troubleshooting knowledge base. Document problems and solutions by company area.",
}

export const viewport: Viewport = {
  themeColor: "#ffffff",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} bg-background`}
    >
      <body className="font-sans antialiased">
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
          <StoreProvider>
            <AppShell>{children}</AppShell>
          </StoreProvider>
          <Toaster position="bottom-right" />
        </ThemeProvider>
        {process.env.NODE_ENV === "production" && <Analytics />}
      </body>
    </html>
  )
}
