"use client"
import { ArtStudio } from "@/components/art-studio"
import { ThemeProvider } from "@/components/theme-provider"

export default function Home() {
  return (
    <ThemeProvider defaultTheme="light" storageKey="art-studio-theme">
      <main className="min-h-screen bg-background">
        <ArtStudio />
      </main>
    </ThemeProvider>
  )
}
