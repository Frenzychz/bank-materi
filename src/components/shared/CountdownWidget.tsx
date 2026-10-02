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
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-2">
      <div className="bg-linear-to-r from-slate-900 via-indigo-950 to-slate-900 text-white rounded-2xl p-4 sm:p-5 shadow-lg border border-indigo-900/50 relative overflow-hidden transition-all duration-300">
        {/* Dekorasi Glow Latar */}
        <div className="absolute top-0 right-0 -mt-8 -mr-8 w-48 h-48 bg-blue-500/10 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -mb-8 -ml-8 w-48 h-48 bg-indigo-500/10 rounded-full blur-2xl pointer-events-none" />

        {/* Header Widget */}
        <div className="flex items-center justify-between gap-2 relative z-10">
          <div className="flex items-center gap-2.5">
            <span className="flex h-3 w-3 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-3 w-3 bg-amber-500" />
            </span>
            <h2 className="text-sm sm:text-base font-bold tracking-wide text-amber-300 flex items-center gap-2">
              <span>⏳ Hitung Mundur Ujian PTN</span>
            </h2>
          </div>

          <button
            onClick={toggleMinimize}
            type="button"
            className="text-xs px-2.5 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-slate-200 transition-colors flex items-center gap-1"
            title={isMinimized ? 'Perluas tampilan hitung mundur' : 'Sembunyikan kartu hitung mundur'}
          >
            <span>{isMinimized ? 'Tampilkan' : 'Sembunyikan'}</span>
            <span>{isMinimized ? '▼' : '▲'}</span>
          </button>
        </div>

        {/* Isi Countdown (Grid 2 Kolom: TKA & UTBK) */}
        {!isMinimized && (
          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4 relative z-10 pt-2 border-t border-white/10">
            {/* Kartu 1: TKA */}
            <div className="bg-white/5 border border-white/10 rounded-xl p-3 sm:p-4 backdrop-blur-xs flex flex-col justify-between">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded-md bg-blue-500/20 text-blue-300 text-xs font-semibold border border-blue-400/30">
                    Jalur TKA
                  </span>
                  <span className="text-xs text-slate-300 font-medium">
                    {config.tkaLabel || 'TKA 2026'}
                  </span>
                </div>
                <span className="text-[11px] text-slate-400">
                  {formatIndonesianDate(config.tkaDate)}
                </span>
              </div>

              {tkaTime.isExpired ? (
                <div className="py-2 text-center text-sm font-semibold text-emerald-400">
                  🎉 Ujian TKA Sedang / Telah Berlangsung!
                </div>
              ) : (
                <div className="grid grid-cols-4 gap-2 text-center mt-1">
                  <div className="bg-black/30 rounded-lg py-1.5 px-1 border border-white/5">
                    <span className="block text-lg sm:text-2xl font-black text-white font-mono leading-tight">
                      {tkaTime.days}
                    </span>
                    <span className="text-[10px] text-slate-400 uppercase font-semibold">Hari</span>
                  </div>
                  <div className="bg-black/30 rounded-lg py-1.5 px-1 border border-white/5">
                    <span className="block text-lg sm:text-2xl font-black text-white font-mono leading-tight">
                      {String(tkaTime.hours).padStart(2, '0')}
                    </span>
                    <span className="text-[10px] text-slate-400 uppercase font-semibold">Jam</span>
                  </div>
                  <div className="bg-black/30 rounded-lg py-1.5 px-1 border border-white/5">
                    <span className="block text-lg sm:text-2xl font-black text-white font-mono leading-tight">
                      {String(tkaTime.minutes).padStart(2, '0')}
                    </span>
                    <span className="text-[10px] text-slate-400 uppercase font-semibold">Menit</span>
                  </div>
                  <div className="bg-black/30 rounded-lg py-1.5 px-1 border border-white/5">
                    <span className="block text-lg sm:text-2xl font-black text-amber-400 font-mono leading-tight">
                      {String(tkaTime.seconds).padStart(2, '0')}
                    </span>
                    <span className="text-[10px] text-slate-400 uppercase font-semibold">Detik</span>
                  </div>
                </div>
              )}
            </div>

            {/* Kartu 2: UTBK-SNBT */}
            <div className="bg-white/5 border border-white/10 rounded-xl p-3 sm:p-4 backdrop-blur-xs flex flex-col justify-between">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded-md bg-indigo-500/20 text-indigo-300 text-xs font-semibold border border-indigo-400/30">
                    Jalur SNBT
                  </span>
                  <span className="text-xs text-slate-300 font-medium">
                    {config.utbkLabel || 'UTBK-SNBT 2027'}
                  </span>
                </div>
                <span className="text-[11px] text-slate-400">
                  {formatIndonesianDate(config.utbkDate)}
                </span>
              </div>

              {utbkTime.isExpired ? (
                <div className="py-2 text-center text-sm font-semibold text-emerald-400">
                  🎉 UTBK-SNBT Sedang / Telah Berlangsung!
                </div>
              ) : (
                <div className="grid grid-cols-4 gap-2 text-center mt-1">
                  <div className="bg-black/30 rounded-lg py-1.5 px-1 border border-white/5">
                    <span className="block text-lg sm:text-2xl font-black text-white font-mono leading-tight">
                      {utbkTime.days}
                    </span>
                    <span className="text-[10px] text-slate-400 uppercase font-semibold">Hari</span>
                  </div>
                  <div className="bg-black/30 rounded-lg py-1.5 px-1 border border-white/5">
                    <span className="block text-lg sm:text-2xl font-black text-white font-mono leading-tight">
                      {String(utbkTime.hours).padStart(2, '0')}
                    </span>
                    <span className="text-[10px] text-slate-400 uppercase font-semibold">Jam</span>
                  </div>
                  <div className="bg-black/30 rounded-lg py-1.5 px-1 border border-white/5">
                    <span className="block text-lg sm:text-2xl font-black text-white font-mono leading-tight">
                      {String(utbkTime.minutes).padStart(2, '0')}
                    </span>
                    <span className="text-[10px] text-slate-400 uppercase font-semibold">Menit</span>
                  </div>
                  <div className="bg-black/30 rounded-lg py-1.5 px-1 border border-white/5">
                    <span className="block text-lg sm:text-2xl font-black text-amber-400 font-mono leading-tight">
                      {String(utbkTime.seconds).padStart(2, '0')}
                    </span>
                    <span className="text-[10px] text-slate-400 uppercase font-semibold">Detik</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
