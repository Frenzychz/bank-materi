import { Link } from 'react-router-dom'
import { useRef } from 'react'
import CountdownWidget from '../../components/shared/CountdownWidget'
import { useSpotlight } from '../../hooks/useSpotlight'

export default function HomePage() {
  const tkaCardRef = useRef<HTMLAnchorElement>(null)
  const snbtCardRef = useRef<HTMLAnchorElement>(null)
  const commandCenterRef = useRef<HTMLDivElement>(null)

  useSpotlight(tkaCardRef)
  useSpotlight(snbtCardRef)
  useSpotlight(commandCenterRef)

  return (
    <div className="space-y-12 sm:space-y-16 py-6 sm:py-10 overflow-hidden">
      
      {/* 1. HERO SECTION: STRIPE PRESS X COMMAND CENTER (SPLIT HERO) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* SISI KIRI (60%): TIPOGRAFI EDITORIAL MEWAH */}
          <div className="lg:col-span-7 space-y-6 text-left">
            {/* Pill Kapsul Berkilau */}
            <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full text-xs font-bold bg-blue-500/10 dark:bg-blue-400/10 text-blue-600 dark:text-cyan-300 border border-blue-500/20 dark:border-cyan-400/30 shadow-xs backdrop-blur-md">
              <span className="h-2 w-2 rounded-full bg-cyan-400 animate-pulse" />
              <span className="tracking-wide">PLATFORM BELAJAR RESMI • BY FRENZYCH</span>
            </div>

            {/* Judul Megah */}
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.08] text-slate-900 dark:text-white">
              Bank Materi & Latsol <br />
              <span className="text-electric-blue">TKA & SNBT</span>
            </h1>

            {/* Slogan & Deskripsi Berkelas */}
            <p className="text-sm sm:text-base lg:text-lg text-slate-600 dark:text-slate-300 max-w-xl leading-relaxed">
              Pusat kurikulum terstruktur, ribuan modul latihan soal terkurasi, dan video pembahasan konsep untuk menembus Perguruan Tinggi Negeri impianmu. Tanpa biaya, tanpa algoritma distraksi.
            </p>

            {/* Tombol Aksi Magnetik (CTA) */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <Link
                to="/tka"
                className="px-6 py-3.5 rounded-2xl bg-linear-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-sm shadow-lg shadow-blue-500/25 transition-all hover:scale-[1.02] active:scale-[0.98] flex items-center gap-2 cursor-pointer"
              >
                <span>Mulai Belajar TKA</span>
                <span className="text-xs">→</span>
              </Link>

              <Link
                to="/snbt"
                className="px-6 py-3.5 rounded-2xl bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-800 font-bold text-sm shadow-xs transition-all hover:scale-[1.02] active:scale-[0.98] flex items-center gap-2 cursor-pointer"
              >
                <span>Jelajahi Subtes SNBT</span>
                <span className="text-xs text-slate-400">↗</span>
              </Link>
            </div>

            {/* Indikator Kepercayaan Mikro */}
            <div className="pt-2 flex flex-wrap items-center gap-6 text-xs text-slate-500 dark:text-slate-400 font-medium">
              <span className="flex items-center gap-1.5">
                <span className="text-emerald-500">✓</span> 1.014 Modul Live
              </span>
              <span className="flex items-center gap-1.5">
                <span className="text-cyan-500">✓</span> Bebas Iklan & Distraksi
              </span>
              <span className="flex items-center gap-1.5">
                <span className="text-indigo-500">✓</span> 100% Akses Terbuka
              </span>
            </div>
          </div>

          {/* SISI KANAN (40%): FLOATING 3D GLASS ARTIFACT "PUSAT KENDALI PEJUANG PTN" */}
          <div className="lg:col-span-5 relative">
            {/* Glow Ambient di Belakang Widget */}
            <div className="absolute inset-0 bg-linear-to-tr from-blue-600/20 via-indigo-600/20 to-cyan-400/20 rounded-3xl blur-2xl transform rotate-3 scale-105 pointer-events-none" />

            <div
              ref={commandCenterRef}
              className="spotlight-interactive animate-float-slow relative rounded-3xl p-6 sm:p-7 bg-slate-900/90 dark:bg-slate-950/90 border border-slate-700/60 dark:border-white/10 shadow-2xl backdrop-blur-2xl text-white space-y-5"
            >
              {/* Header Widget */}
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-linear-to-br from-blue-500 to-indigo-600 flex items-center justify-center font-black text-lg shadow-md shadow-blue-500/30">
                    ⚡
                  </div>
                  <div>
                    <h3 className="text-sm font-extrabold tracking-wide text-white">
                      Pusat Kendali Pejuang PTN
                    </h3>
                    <p className="text-2xs text-cyan-300 font-mono tracking-wider">
                      STATUS SISTEM: AKTIF & TERVERIFIKASI
                    </p>
                  </div>
                </div>

                <span className="flex h-2.5 w-2.5 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
                </span>
              </div>

              {/* Data Metrik Live */}
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3.5 rounded-2xl bg-white/5 border border-white/5 flex flex-col justify-between">
                  <span className="text-2xs text-slate-400 font-semibold uppercase tracking-wider">
                    Total Materi & Latsol
                  </span>
                  <div className="mt-1 flex items-baseline gap-1.5">
                    <span className="text-2xl font-black font-mono text-cyan-300">1.014</span>
                    <span className="text-2xs text-slate-400 font-semibold">Modul</span>
                  </div>
                </div>

                <div className="p-3.5 rounded-2xl bg-white/5 border border-white/5 flex flex-col justify-between">
                  <span className="text-2xs text-slate-400 font-semibold uppercase tracking-wider">
                    Katalog Topik
                  </span>
                  <div className="mt-1 flex items-baseline gap-1.5">
                    <span className="text-2xl font-black font-mono text-indigo-300">230</span>
                    <span className="text-2xs text-slate-400 font-semibold">Bab Terstruktur</span>
                  </div>
                </div>
              </div>

              {/* Rincian Jalur Cepat */}
              <div className="space-y-2 pt-1">
                <Link
                  to="/tka"
                  className="p-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 transition-all flex items-center justify-between group"
                >
                  <div className="flex items-center gap-2.5">
                    <span className="text-xs px-2 py-0.5 rounded-md bg-blue-500/20 text-blue-300 font-bold border border-blue-400/30">
                      TKA
                    </span>
                    <span className="text-xs text-slate-200 font-semibold">
                      Fundamental + Wajib & Pilihan
                    </span>
                  </div>
                  <span className="text-xs text-slate-400 group-hover:text-cyan-300 transition-colors">
                    Akses ↗
                  </span>
                </Link>

                <Link
                  to="/snbt"
                  className="p-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 transition-all flex items-center justify-between group"
                >
                  <div className="flex items-center gap-2.5">
                    <span className="text-xs px-2 py-0.5 rounded-md bg-indigo-500/20 text-indigo-300 font-bold border border-indigo-400/30">
                      SNBT
                    </span>
                    <span className="text-xs text-slate-200 font-semibold">
                      Fundamental + 7 Subtes UTBK
                    </span>
                  </div>
                  <span className="text-xs text-slate-400 group-hover:text-indigo-300 transition-colors">
                    Akses ↗
                  </span>
                </Link>
              </div>

              {/* Status Server Bar Bawah */}
              <div className="pt-2 border-t border-white/10 flex items-center justify-between text-2xs text-slate-400">
                <span className="flex items-center gap-1.5">
                  <span className="text-emerald-400">●</span> Cloud Database PostgreSQL
                </span>
                <span className="font-mono text-slate-500">v2.0 Curated</span>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* 2. DUAL DIGITAL CLOCK COUNTDOWN WIDGET */}
      <CountdownWidget />

      {/* 3. DUA GERBANG MONOLITIK BESAR: TKA & SNBT (STRIPE PRESS AESTHETIC) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8 sm:mb-10 space-y-2">
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
            Pilih Gerbang Persiapan Belajar
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-lg mx-auto">
            Setiap jalur disusun hierarkis dari konsep dasar (fundamental) hingga latihan soal tingkat tinggi.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
          
          {/* GERBANG 1: TKA */}
          <Link
            ref={tkaCardRef}
            to="/tka"
            className="spotlight-interactive group relative rounded-3xl p-7 sm:p-9 bg-white dark:bg-slate-900/80 border-2 border-slate-200 dark:border-slate-800 hover:border-blue-500 dark:hover:border-blue-400/80 shadow-md hover:shadow-2xl transition-all duration-300 flex flex-col justify-between"
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="w-14 h-14 rounded-2xl bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800 flex items-center justify-center font-black text-2xl group-hover:scale-105 transition-transform">
                  TKA
                </div>
                <span className="text-2xs font-extrabold uppercase tracking-wider px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950/50 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
                  Ujian Mandiri & TKA
                </span>
              </div>

              <div>
                <h3 className="text-2xl font-black text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                  Tes Kemampuan Akademik
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-2 leading-relaxed">
                  Meliputi materi Fundamental lengkap, 3 Mata Pelajaran Wajib (Matematika, B. Indo, B. Inggris), serta seluruh Mata Pelajaran Pilihan Saintek & Soshum.
                </p>
              </div>

              {/* Tag Sorotan */}
              <div className="flex flex-wrap gap-1.5 pt-2">
                {['Fundamental TKA', 'Materi Wajib', 'Materi Pilihan', 'Latihan Soal'].map((tag) => (
                  <span
                    key={tag}
                    className="text-2xs font-semibold px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800/60 text-slate-600 dark:text-slate-300"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            <div className="mt-8 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs sm:text-sm font-bold text-blue-600 dark:text-blue-400">
              <span>Masuk ke Kurikulum TKA</span>
              <span className="text-base transform group-hover:translate-x-1.5 transition-transform">→</span>
            </div>
          </Link>

          {/* GERBANG 2: SNBT */}
          <Link
            ref={snbtCardRef}
            to="/snbt"
            className="spotlight-interactive group relative rounded-3xl p-7 sm:p-9 bg-white dark:bg-slate-900/80 border-2 border-slate-200 dark:border-slate-800 hover:border-indigo-500 dark:hover:border-indigo-400/80 shadow-md hover:shadow-2xl transition-all duration-300 flex flex-col justify-between"
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="w-14 h-14 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800 flex items-center justify-center font-black text-2xl group-hover:scale-105 transition-transform">
                  SNBT
                </div>
                <span className="text-2xs font-extrabold uppercase tracking-wider px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/50 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
                  UTBK Nasional
                </span>
              </div>

              <div>
                <h3 className="text-2xl font-black text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                  Seleksi Nasional Berdasarkan Tes
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-2 leading-relaxed">
                  Menyediakan Fundamental SNBT dan 7 Subtes UTBK: Penalaran Umum, PPU, PBM, Pengetahuan Kuantitatif, Literasi Bahasa, dan Penalaran Matematika.
                </p>
              </div>

              {/* Tag Sorotan */}
              <div className="flex flex-wrap gap-1.5 pt-2">
                {['Fundamental SNBT', '7 Subtes UTBK', 'Bank Soal Asli', 'Video Konsep'].map((tag) => (
                  <span
                    key={tag}
                    className="text-2xs font-semibold px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800/60 text-slate-600 dark:text-slate-300"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            <div className="mt-8 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs sm:text-sm font-bold text-indigo-600 dark:text-indigo-400">
              <span>Masuk ke Kurikulum SNBT</span>
              <span className="text-base transform group-hover:translate-x-1.5 transition-transform">→</span>
            </div>
          </Link>

        </div>
      </section>

      {/* 4. SEKSI MANIFESTO / MOTIVASI EDITORIAL (STRIPE PRESS PHILOSOPHY) */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6">
        <div className="rounded-3xl p-6 sm:p-9 bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
          
          {/* Pesan Kutipan */}
          <div className="border-l-4 border-blue-500 pl-5 py-1 space-y-1.5">
            <h3 className="text-xs font-black uppercase tracking-widest text-slate-400 dark:text-slate-500">
              Prinsip Pejuang PTN
            </h3>
            <p className="text-sm sm:text-base text-slate-700 dark:text-slate-200 leading-relaxed italic font-serif">
              "Lolos PTN bukan hanya soal siapa yang paling cepat paham, melainkan siapa yang paling konsisten bertahan dan terus berlatih setiap hari. Rancang jadwalmu, pahami konsep dasarnya, dan percaya pada proses yang sedang kamu jalani."
            </p>
          </div>

          {/* Misi Platform */}
          <div className="border-t border-slate-100 dark:border-slate-800 pt-6 space-y-2">
            <h4 className="text-sm font-bold text-slate-900 dark:text-white">
              Mengapa repositori ini dibangun?
            </h4>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              Materi belajar di internet sering kali berantakan, terputus-putus, dan penuh distraksi. Repositori ini dirancang khusus sebagai ruang belajar mandiri yang hening, tertata secara logis, dan bebas dari algoritma media sosial. Kamu bisa fokus memahami materi bab demi bab secara tenang hingga tuntas.
            </p>
          </div>

        </div>
      </section>

    </div>
  )
}