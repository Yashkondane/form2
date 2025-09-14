"use client"

export function GradientBackground() {
  return (
      <div
          className="fixed top-0 left-0 w-full h-full -z-10 opacity-70 blur-3xl
                 bg-gradient-radial from-blue-400/30 via-purple-500/20 to-transparent"
          aria-hidden="true"
      />
  )
}
