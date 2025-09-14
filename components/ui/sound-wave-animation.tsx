"use client"

import { useEffect, useRef } from "react"

interface SoundWaveAnimationProps {
  className?: string
}

export function SoundWaveAnimation({ className }: SoundWaveAnimationProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    let animationFrameId: number;

    const setCanvasDimensions = () => {
      const dpr = window.devicePixelRatio || 1;
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      ctx.scale(dpr, dpr);
    }

    setCanvasDimensions();
    window.addEventListener("resize", setCanvasDimensions);

    const waves = Array(5).fill(null).map(() => ({
      amplitude: Math.random() * 80 + 20, // Taller waves
      frequency: Math.random() * 0.005 + 0.001, // Slower, wider waves
      speed: Math.random() * 0.01 + 0.005,
      color: `rgba(${50 + Math.random() * 50}, ${100 + Math.random() * 50}, ${200 + Math.random() * 55}, ${Math.random() * 0.2 + 0.2})`, // Increased opacity
      offset: Math.random() * 1000,
      width: Math.random() * 1.5 + 1.5, // Thicker lines
    }));

    let time = 0

    const animate = () => {
      const rect = canvas.getBoundingClientRect();
      ctx.clearRect(0, 0, rect.width, rect.height);

      waves.forEach((wave) => {
        drawWave(ctx, wave, time, rect.width, rect.height);
      });

      time += 0.02;
      animationFrameId = requestAnimationFrame(animate);
    }

    const drawWave = (
        ctx: CanvasRenderingContext2D,
        wave: any,
        time: number,
        width: number,
        height: number,
    ) => {
      const { amplitude, frequency, speed, color, offset, width: waveWidth } = wave;
      const y = height / 2;

      ctx.beginPath();

      for (let x = 0; x < width; x++) {
        const angle = x * frequency + time * speed + offset;
        // Combine multiple sin/cos for more organic movement
        const yOffset = Math.sin(angle) * 0.6 + Math.cos(angle * 0.5) * 0.4;
        const dy = yOffset * amplitude;

        if (x === 0) {
          ctx.moveTo(x, y + dy);
        } else {
          ctx.lineTo(x, y + dy);
        }
      }

      ctx.strokeStyle = color;
      ctx.lineWidth = waveWidth;
      ctx.stroke();
    }

    animate();

    return () => {
      window.removeEventListener("resize", setCanvasDimensions);
      cancelAnimationFrame(animationFrameId);
    }
  }, [])

  return (
      <canvas
          ref={canvasRef}
          className={`fixed top-0 left-0 w-full h-full -z-20 ${className}`}
          aria-hidden="true"
      />
  )
}

