import { useEffect, useState } from 'react'
import { settingsService } from '../../services/settings.service'
import type { CountdownConfig } from '../../config/countdown'
import { DEFAULT_COUNTDOWN_CONFIG } from '../../config/countdown'

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
    <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2">
      <div className="card-obsidian rounded-2xl p-5 sm:p-6 overflow-hidden">
        {/* Baris Header Jam Digital */}
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-neutral-900 border border-neutral-800 flex items-center justify-center text-neutral-300 text-sm">
              ⏳
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-neutral-300 animate-subtle-pulse" />
                <h3 className="text-xs sm:text-sm font-bold tracking-tight text-white uppercase">
                  Target Waktu Ujian Seleksi PTN
                </h3>
              </div>
              <p className="text-2xs text-neutral-400 font-mono hidden sm:block">
                Sinkronisasi hitung mundur persiapan TKA dan UTBK-SNBT
              </p>
            </div>
          </div>

          <button
            onClick={toggleMinimize}
            type="button"
            className="text-2xs sm:text-xs font-mono px-3 py-1.5 rounded-lg bg-neutral-900 hover:bg-neutral-800 text-neutral-300 border border-neutral-800 transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <span>{isMinimized ? 'Buka Jam' : 'Sembunyikan'}</span>
            <span className="text-[10px]">{isMinimized ? '▼' : '▲'}</span>
          </button>
        </div>

        {/* Plat Jam Digital (Dual Section: TKA & UTBK) */}
        {!isMinimized && (
          <div className="mt-5 grid grid-cols-1 lg:grid-cols-2 gap-4 pt-4 border-t border-neutral-900">
            {/* PLAT 1: TKA */}
            <div className="bg-[#0a0a0c] border border-neutral-800/80 rounded-xl p-4 sm:p-5 flex flex-col justify-between space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <span className="px-2 py-0.5 rounded-md bg-neutral-900 text-neutral-300 text-2xs font-mono uppercase tracking-wider border border-neutral-800">
                    Jalur TKA
                  </span>
                  <span className="text-sm font-bold text-white tracking-tight">
                    {config.tkaLabel || 'TKA 2026'}
                  </span>
                </div>
                <span className="text-2xs font-mono text-neutral-400">
                  {formatIndonesianDate(config.tkaDate)}
                </span>
              </div>

              {tkaTime.isExpired ? (
                <div className="py-4 text-center text-xs font-bold text-neutral-300 bg-neutral-900 border border-neutral-800 rounded-xl">
                  🎉 Ujian TKA Sedang / Telah Berlangsung!
                </div>
              ) : (
                <div className="grid grid-cols-4 gap-2 sm:gap-3 text-center">
                  {/* Hari */}
                  <div className="digital-clock-plate rounded-lg py-2.5 px-1 flex flex-col items-center justify-center">
                    <span className="text-2xl sm:text-3xl font-bold font-mono text-white tracking-tight leading-none">
                      {tkaTime.days}
                    </span>
                    <span className="text-[10px] font-mono font-medium text-neutral-400 uppercase tracking-widest mt-1">
                      Hari
                    </span>
                  </div>

                  {/* Jam */}
                  <div className="digital-clock-plate rounded-lg py-2.5 px-1 flex flex-col items-center justify-center">
                    <span className="text-2xl sm:text-3xl font-bold font-mono text-neutral-200 tracking-tight leading-none">
                      {String(tkaTime.hours).padStart(2, '0')}
                    </span>
                    <span className="text-[10px] font-mono font-medium text-neutral-400 uppercase tracking-widest mt-1">
                      Jam
                    </span>
                  </div>

                  {/* Menit */}
                  <div className="digital-clock-plate rounded-lg py-2.5 px-1 flex flex-col items-center justify-center">
                    <span className="text-2xl sm:text-3xl font-bold font-mono text-neutral-200 tracking-tight leading-none">
                      {String(tkaTime.minutes).padStart(2, '0')}
                    </span>
                    <span className="text-[10px] font-mono font-medium text-neutral-400 uppercase tracking-widest mt-1">
                      Menit
                    </span>
                  </div>

                  {/* Detik */}
                  <div className="digital-clock-plate rounded-lg py-2.5 px-1 flex flex-col items-center justify-center">
                    <span className="text-2xl sm:text-3xl font-bold font-mono text-neutral-400 tracking-tight leading-none">
                      {String(tkaTime.seconds).padStart(2, '0')}
                    </span>
                    <span className="text-[10px] font-mono font-medium text-neutral-400 uppercase tracking-widest mt-1">
                      Detik
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* PLAT 2: UTBK-SNBT */}
            <div className="bg-[#0a0a0c] border border-neutral-800/80 rounded-xl p-4 sm:p-5 flex flex-col justify-between space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <span className="px-2 py-0.5 rounded-md bg-neutral-900 text-neutral-300 text-2xs font-mono uppercase tracking-wider border border-neutral-800">
                    Jalur SNBT
                  </span>
                  <span className="text-sm font-bold text-white tracking-tight">
                    {config.utbkLabel || 'UTBK-SNBT 2027'}
                  </span>
                </div>
                <span className="text-2xs font-mono text-neutral-400">
                  {formatIndonesianDate(config.utbkDate)}
                </span>
              </div>

              {utbkTime.isExpired ? (
                <div className="py-4 text-center text-xs font-bold text-neutral-300 bg-neutral-900 border border-neutral-800 rounded-xl">
                  🎉 UTBK-SNBT Sedang / Telah Berlangsung!
                </div>
              ) : (
                <div className="grid grid-cols-4 gap-2 sm:gap-3 text-center">
                  {/* Hari */}
                  <div className="digital-clock-plate rounded-lg py-2.5 px-1 flex flex-col items-center justify-center">
                    <span className="text-2xl sm:text-3xl font-bold font-mono text-white tracking-tight leading-none">
                      {utbkTime.days}
                    </span>
                    <span className="text-[10px] font-mono font-medium text-neutral-400 uppercase tracking-widest mt-1">
                      Hari
                    </span>
                  </div>

                  {/* Jam */}
                  <div className="digital-clock-plate rounded-lg py-2.5 px-1 flex flex-col items-center justify-center">
                    <span className="text-2xl sm:text-3xl font-bold font-mono text-neutral-200 tracking-tight leading-none">
                      {String(utbkTime.hours).padStart(2, '0')}
                    </span>
                    <span className="text-[10px] font-mono font-medium text-neutral-400 uppercase tracking-widest mt-1">
                      Jam
                    </span>
                  </div>

                  {/* Menit */}
                  <div className="digital-clock-plate rounded-lg py-2.5 px-1 flex flex-col items-center justify-center">
                    <span className="text-2xl sm:text-3xl font-bold font-mono text-neutral-200 tracking-tight leading-none">
                      {String(utbkTime.minutes).padStart(2, '0')}
                    </span>
                    <span className="text-[10px] font-mono font-medium text-neutral-400 uppercase tracking-widest mt-1">
                      Menit
                    </span>
                  </div>

                  {/* Detik */}
                  <div className="digital-clock-plate rounded-lg py-2.5 px-1 flex flex-col items-center justify-center">
                    <span className="text-2xl sm:text-3xl font-bold font-mono text-neutral-400 tracking-tight leading-none">
                      {String(utbkTime.seconds).padStart(2, '0')}
                    </span>
                    <span className="text-[10px] font-mono font-medium text-neutral-400 uppercase tracking-widest mt-1">
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
