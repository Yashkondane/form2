import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { GradientBackground } from "@/components/ui/gradient-background"
import { SoundWaveAnimation } from "@/components/ui/sound-wave-animation"
import { AudioWaveIcon } from "@/components/ui/audio-wave-icon"
import { Camera, Figma, Upload, File, Plus, SlidersHorizontal, ArrowUp } from "lucide-react"

export default function Home() {
  return (
      <div className="flex min-h-screen flex-col">
        <GradientBackground />
        <header className="sticky top-0 z-40 w-full backdrop-blur-md bg-white/5 border-b border-white/10">
          <div className="container flex h-16 items-center space-x-4 sm:justify-between sm:space-x-0">
            <div className="flex gap-6 md:gap-10">
              <Link href="/" className="flex items-center space-x-2">
                <AudioWaveIcon className="h-6 w-6 text-primary" />
                <span className="inline-block font-bold">Wavelength</span>
              </Link>
            </div>
            <div className="flex flex-1 items-center justify-end space-x-4">
              <Button variant="outline" className="hidden sm:flex glass-button">
                Sign In
              </Button>
              <Button className="bg-primary/90 backdrop-blur-sm">Get Started</Button>
            </div>
          </div>
        </header>
        <main className="flex-1 flex items-center justify-center">
          <section className="relative w-full">
            <SoundWaveAnimation className="absolute top-1/2 left-0 w-full -translate-y-1/2" />
            <div className="container flex max-w-[64rem] flex-col items-center gap-4 text-center relative z-10">
              <div className="hero-glow">
                <h1 className="font-heading text-5xl font-bold mb-4 gradient-text">
                  What do you want to create?
                </h1>
              </div>
              <p className="text-lg text-muted-foreground sm:text-xl sm:leading-8">
                Start building with a single prompt. No coding needed.
              </p>
              <div className="w-full max-w-2xl mt-8">
                <div className="relative">
                  <Textarea
                      className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl w-full p-4 pr-12 text-lg focus:ring-2 focus:ring-primary/50 focus:border-transparent glass-effect"
                      placeholder="Ask to build..."
                      rows={4}
                  />
                  <div className="absolute bottom-4 left-4 flex items-center gap-2 text-muted-foreground">
                    <Plus className="h-6 w-6 cursor-pointer hover:text-primary" />
                    <SlidersHorizontal className="h-6 w-6 cursor-pointer hover:text-primary" />
                  </div>
                  <Button
                      variant="ghost"
                      size="icon"
                      className="absolute bottom-4 right-4 bg-white/20 hover:bg-white/30 rounded-lg"
                  >
                    <ArrowUp className="h-6 w-6" />
                  </Button>
                </div>
                <div className="flex items-center justify-center gap-4 mt-8">
                  <Button variant="outline" className="glass-button">
                    <Camera className="mr-2 h-4 w-4" />
                    Clone a Screenshot
                  </Button>
                  <Button variant="outline" className="glass-button">
                    <Figma className="mr-2 h-4 w-4" />
                    Import from Figma
                  </Button>
                  <Button variant="outline" className="glass-button">
                    <Upload className="mr-2 h-4 w-4" />
                    Upload a Project
                  </Button>
                  <Button variant="outline" className="glass-button">
                    <File className="mr-2 h-4 w-4" />
                    Landing Page
                  </Button>
                </div>
              </div>
            </div>
          </section>
        </main>
        <footer className="border-t border-white/10 py-6 md:py-0 backdrop-blur-md bg-white/5">
          <div className="container flex flex-col items-center justify-between gap-4 md:h-24 md:flex-row">
            <div className="flex flex-col items-center gap-4 px-8 md:flex-row md:gap-2 md:px-0">
              <AudioWaveIcon className="h-6 w-6 text-primary" />
              <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
                &copy; {new Date().getFullYear()} Wavelength. All rights reserved.
              </p>
            </div>
            <div className="flex gap-4">
              <Link href="#" className="text-sm text-muted-foreground underline underline-offset-4">
                Terms
              </Link>
              <Link href="#" className="text-sm text-muted-foreground underline underline-offset-4">
                Privacy
              </Link>
            </div>
          </div>
        </footer>
      </div>
  )
}