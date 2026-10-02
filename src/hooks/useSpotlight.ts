import { useEffect } from 'react'

export function useSpotlight<T extends HTMLElement>(ref: React.RefObject<T | null>) {
  useEffect(() => {
    const element = ref.current
    if (!element) return

    // Hanya aktif jika perangkat memiliki mouse/pointer presisi (bukan layar sentuh HP)
    if (!window.matchMedia('(pointer: fine)').matches) return

    const handleMouseMove = (e: MouseEvent) => {
      const rect = element.getBoundingClientRect()
      const x = e.clientX - rect.left
      const y = e.clientY - rect.top

      element.style.setProperty('--mouse-x', `${x}px`)
      element.style.setProperty('--mouse-y', `${y}px`)
    }

    const handleMouseLeave = () => {
      element.style.setProperty('--mouse-x', '-999px')
      element.style.setProperty('--mouse-y', '-999px')
    }

    element.addEventListener('mousemove', handleMouseMove)
    element.addEventListener('mouseleave', handleMouseLeave)

    return () => {
      element.removeEventListener('mousemove', handleMouseMove)
      element.removeEventListener('mouseleave', handleMouseLeave)
    }
  }, [ref])
}
