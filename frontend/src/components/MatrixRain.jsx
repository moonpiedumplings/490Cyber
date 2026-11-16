import { useEffect, useRef } from 'react'

const characters = 'アカサタナハマヤラワ0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ'

export default function MatrixRain() {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas?.getContext('2d')
    if (!ctx) return

    const fontSize = 17
    let drops = []
    let frame = 0
    let lastDraw = 0

    const resize = () => {
      const scale = Math.min(window.devicePixelRatio || 1, 2)
      canvas.width = canvas.clientWidth * scale
      canvas.height = canvas.clientHeight * scale
      ctx.setTransform(scale, 0, 0, scale, 0, 0)

      const columns = Math.ceil(canvas.clientWidth / fontSize)
      drops = Array.from({ length: columns }, () => Math.random() * -25)
    }

    const draw = (time) => {
      if (time - lastDraw > 55) {
        const width = canvas.clientWidth
        const height = canvas.clientHeight

        ctx.fillStyle = 'rgba(7, 11, 15, 0.13)'
        ctx.fillRect(0, 0, width, height)
        ctx.font = `${fontSize}px monospace`

        drops.forEach((drop, column) => {
          const char = characters[Math.floor(Math.random() * characters.length)]
          ctx.fillStyle =
            Math.random() > 0.985
              ? 'rgba(190, 255, 245, 0.8)'
              : 'rgba(80, 205, 185, 0.48)'

          ctx.fillText(char, column * fontSize, drop * fontSize)

          drops[column] =
            drop * fontSize > height && Math.random() > 0.975
              ? 0
              : drop + 0.45
        })

        lastDraw = time
      }

      frame = requestAnimationFrame(draw)
    }

    resize()
    window.addEventListener('resize', resize)

    const reduceMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches

    if (!reduceMotion) {
      frame = requestAnimationFrame(draw)
    }

    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener('resize', resize)
    }
  }, [])

  return <canvas className="matrix-rain" ref={canvasRef} aria-hidden="true" />
}