import { useEffect, useState, useRef } from 'react'
import { settingsService } from '../../services/settings.service'
import type { CountdownConfig } from '../../config/countdown'
import { DEFAULT_COUNTDOWN_CONFIG } from '../../config/countdown'
import { useSpotlight } from '../../hooks/useSpotlight'

interface TimeLeft {
  days: number
  hours: number
  minutes: number
  seconds: number
  isExpired: boolean
}

function calculateTimeLeft(targetDateStr: string): TimeLeft {
  const difference = +new Date(targetDateStr) - +new Date()
  if (difference <= 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0, isExpired: true }
  }

  return {
    days: Math.floor(difference / (1000 * 60 * 60 * 24)),
    hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((difference / 1000 / 60) % 60),
    seconds: Math.floor((difference / 1000) % 60),
    isExpired: false,
  }
}

function formatIndonesianDate(dateStr: string): string {
  try {
    const d = new Date(dateStr)
    return d.toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    })
  } catch {
    return dateStr
  }
}

export default function CountdownWidget() {
  const containerRef = useRef<HTMLDivElement>(null)
  useSpotlight(containerRef)

  const [config, setConfig] = useState<CountdownConfig>(DEFAULT_COUNTDOWN_CONFIG)
  const [isMinimized, setIsMinimized] = useState(() => {
    return localStorage.getItem('bank_materi_countdown_minimized') === 'true'
  })

  const [tkaTime, setTkaTime] = useState<TimeLeft>(() =>
    calculateTimeLeft(DEFAULT_COUNTDOWN_CONFIG.tkaDate)
  )
  const [utbkTime, setUtbkTime] = useState<TimeLeft>(() =>
    calculateTimeLeft(DEFAULT_COUNTDOWN_CONFIG.utbkDate)
  )

  useEffect(() => {
    let isMounted = true
    settingsService.getCountdownConfig().then((cfg) => {
      if (isMounted) {
        setConfig(cfg)
        setTkaTime(calculateTimeLeft(cfg.tkaDate))
        setUtbkTime(calculateTimeLeft(cfg.utbkDate))
      }
    })
    return () => {
      isMounted = false
    }
  }, [])

  useEffect(() => {
    const timer = setInterval(() => {
      setTkaTime(calculateTimeLeft(config.tkaDate))
      setUtbkTime(calculateTimeLeft(config.utbkDate))
    }, 1000)
    return () => clearInterval(timer)
  }, [config])

  const toggleMinimize = () => {
    setIsMinimized((prev) => {
      const next = !prev
      localStorage.setItem('bank_materi_countdown_minimized', String(next))
      return next
    })
  }

  return (
    <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
      <div
        ref={containerRef}
        className="spotlight-interactive relative rounded-3xl p-5 sm:p-7 overflow-hidden bg-slate-900/90 dark:bg-slate-950/90 border border-slate-800/80 shadow-2xl backdrop-blur-xl transition-all duration-300"
      >
        {/* Lampu Sorot Ambient Glow */}
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none animate-pulse-glow" />
        <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none animate-pulse-glow" />

        {/* Baris Header Jam Digital */}
        <div className="flex items-center justify-between gap-3 relative z-10">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-blue-500/10 border border-blue-400/20 flex items-center justify-center text-blue-400 shadow-inner">
              <span className="text-base">⏳</span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-emerald-400 animate-ping" />
                <h3 className="text-xs sm:text-sm font-black tracking-wider uppercase text-slate-300">
                  Target Waktu Ujian Seleksi PTN
                </h3>
              </div>
              <p className="text-2xs text-slate-500 hidden sm:block">
                Sinkronisasi hitung mundur resmi persiapan TKA dan UTBK-SNBT
              </p>
            </div>
          </div>

          <button
            onClick={toggleMinimize}
            type="button"
            className="text-xs font-semibold px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 border border-white/10 transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <span>{isMinimized ? 'Buka Jam' : 'Sembunyikan'}</span>
            <span className="text-2xs">{isMinimized ? '▼' : '▲'}</span>
          </button>
        </div>

        {/* Plat Jam Digital (Dual Section: TKA & UTBK) */}
        {!isMinimized && (
          <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-5 relative z-10 pt-4 border-t border-slate-800/80">
            {/* PLAT 1: TKA */}
            <div className="bg-slate-950/60 border border-white/10 rounded-2xl p-4 sm:p-5 flex flex-col justify-between space-y-4 shadow-inner">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <span className="px-2.5 py-0.5 rounded-md bg-blue-500/20 text-blue-400 text-2xs font-extrabold uppercase tracking-wider border border-blue-400/30">
                    Jalur TKA
                  </span>
                  <span className="text-sm font-bold text-white tracking-tight">
                    {config.tkaLabel || 'TKA 2026'}
                  </span>
                </div>
                <span className="text-xs font-mono text-slate-400">
                  {formatIndonesianDate(config.tkaDate)}
                </span>
              </div>

              {tkaTime.isExpired ? (
                <div className="py-4 text-center text-sm font-bold text-emerald-400 bg-emerald-950/20 border border-emerald-800/30 rounded-xl">
                  🎉 Ujian TKA Sedang / Telah Berlangsung!
                </div>
              ) : (
                <div className="grid grid-cols-4 gap-2 sm:gap-3 text-center">
                  {/* Hari */}
                  <div className="digital-clock-plate rounded-xl py-3 px-1 flex flex-col items-center justify-center">
                    <span className="text-2xl sm:text-3xl font-black font-mono text-cyan-300 tracking-tight leading-none">
                      {tkaTime.days}
                    </span>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1.5">
                      Hari
                    </span>
                  </div>

                  {/* Jam */}
                  <div className="digital-clock-plate rounded-xl py-3 px-1 flex flex-col items-center justify-center">
                    <span className="text-2xl sm:text-3xl font-black font-mono text-slate-100 tracking-tight leading-none">
                      {String(tkaTime.hours).padStart(2, '0')}
                    </span>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1.5">
                      Jam
                    </span>
                  </div>

                  {/* Menit */}
                  <div className="digital-clock-plate rounded-xl py-3 px-1 flex flex-col items-center justify-center">
                    <span className="text-2xl sm:text-3xl font-black font-mono text-slate-100 tracking-tight leading-none">
                      {String(tkaTime.minutes).padStart(2, '0')}
                    </span>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1.5">
                      Menit
                    </span>
                  </div>

                  {/* Detik */}
                  <div className="digital-clock-plate rounded-xl py-3 px-1 flex flex-col items-center justify-center border-blue-500/30">
                    <span className="text-2xl sm:text-3xl font-black font-mono text-amber-400 tracking-tight leading-none animate-pulse">
                      {String(tkaTime.seconds).padStart(2, '0')}
                    </span>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1.5">
                      Detik
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* PLAT 2: UTBK-SNBT */}
            <div className="bg-slate-950/60 border border-white/10 rounded-2xl p-4 sm:p-5 flex flex-col justify-between space-y-4 shadow-inner">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <span className="px-2.5 py-0.5 rounded-md bg-indigo-500/20 text-indigo-400 text-2xs font-extrabold uppercase tracking-wider border border-indigo-400/30">
                    Jalur SNBT
                  </span>
                  <span className="text-sm font-bold text-white tracking-tight">
                    {config.utbkLabel || 'UTBK-SNBT 2027'}
                  </span>
                </div>
                <span className="text-xs font-mono text-slate-400">
                  {formatIndonesianDate(config.utbkDate)}
                </span>
              </div>

              {utbkTime.isExpired ? (
                <div className="py-4 text-center text-sm font-bold text-emerald-400 bg-emerald-950/20 border border-emerald-800/30 rounded-xl">
                  🎉 UTBK-SNBT Sedang / Telah Berlangsung!
                </div>
              ) : (
                <div className="grid grid-cols-4 gap-2 sm:gap-3 text-center">
                  {/* Hari */}
                  <div className="digital-clock-plate rounded-xl py-3 px-1 flex flex-col items-center justify-center">
                    <span className="text-2xl sm:text-3xl font-black font-mono text-indigo-300 tracking-tight leading-none">
                      {utbkTime.days}
                    </span>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1.5">
                      Hari
                    </span>
                  </div>

                  {/* Jam */}
                  <div className="digital-clock-plate rounded-xl py-3 px-1 flex flex-col items-center justify-center">
                    <span className="text-2xl sm:text-3xl font-black font-mono text-slate-100 tracking-tight leading-none">
                      {String(utbkTime.hours).padStart(2, '0')}
                    </span>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1.5">
                      Jam
                    </span>
                  </div>

                  {/* Menit */}
                  <div className="digital-clock-plate rounded-xl py-3 px-1 flex flex-col items-center justify-center">
                    <span className="text-2xl sm:text-3xl font-black font-mono text-slate-100 tracking-tight leading-none">
                      {String(utbkTime.minutes).padStart(2, '0')}
                    </span>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1.5">
                      Menit
                    </span>
                  </div>

                  {/* Detik */}
                  <div className="digital-clock-plate rounded-xl py-3 px-1 flex flex-col items-center justify-center border-indigo-500/30">
                    <span className="text-2xl sm:text-3xl font-black font-mono text-amber-400 tracking-tight leading-none animate-pulse">
                      {String(utbkTime.seconds).padStart(2, '0')}
                    </span>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1.5">
                      Detik
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
