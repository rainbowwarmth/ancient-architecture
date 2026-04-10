import { useRef, useEffect } from 'react'

export default function InkWashBg() {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    let w, h

    const resize = () => {
      w = canvas.width = Math.round(window.innerWidth / 2)
      h = canvas.height = Math.round(window.innerHeight / 2)
    }
    resize()
    window.addEventListener('resize', resize)

    const blobs = Array.from({ length: 6 }, () => ({
      x: Math.random() * (w || 400),
      y: Math.random() * (h || 400),
      r: 100 + Math.random() * 150,
      vx: (Math.random() - 0.5) * 0.08,
      vy: (Math.random() - 0.5) * 0.08,
      opacity: 0.01 + Math.random() * 0.01,
    }))

    let raf
    let last = 0
    const draw = (now) => {
      raf = requestAnimationFrame(draw)
      if (now - last < 50) return
      last = now
      ctx.clearRect(0, 0, w, h)
      blobs.forEach((b) => {
        b.x += b.vx
        b.y += b.vy
        if (b.x < -b.r) b.x = w + b.r
        if (b.x > w + b.r) b.x = -b.r
        if (b.y < -b.r) b.y = h + b.r
        if (b.y > h + b.r) b.y = -b.r

        // 检查当前是否为深色模式
        const isDarkMode = document.documentElement.classList.contains('dark')
        // 根据主题设置不同的颜色
        const c1 = isDarkMode 
          ? (b.r % 3 === 0 ? 'rgba(230,57,70,' : (b.r % 2 === 0 ? 'rgba(74,111,165,' : 'rgba(255,215,0,'))
          : (b.r % 3 === 0 ? 'rgba(166,52,41,' : (b.r % 2 === 0 ? 'rgba(74,92,104,' : 'rgba(212,175,55,'))
        const grad = ctx.createRadialGradient(b.x, b.y, 0, b.x, b.y, b.r)
        grad.addColorStop(0, `${c1}${b.opacity * 2})`)
        grad.addColorStop(0.3, `${c1}${b.opacity * 0.8})`)
        grad.addColorStop(1, 'transparent')
        ctx.fillStyle = grad
        ctx.beginPath()
        ctx.arc(b.x, b.y, b.r, 0, Math.PI * 2)
        ctx.fill()
      })
    }
    raf = requestAnimationFrame(draw)

    return () => {
      window.removeEventListener('resize', resize)
      cancelAnimationFrame(raf)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 z-0 pointer-events-none"
      style={{ mixBlendMode: 'multiply', width: '100%', height: '100%' }}
    />
  )
}
