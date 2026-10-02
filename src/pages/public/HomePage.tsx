import { Link } from 'react-router-dom'
import CountdownWidget from '../../components/shared/CountdownWidget'

export default function HomePage() {
  return (
    <div className="space-y-12 sm:space-y-16 py-8 sm:py-14 overflow-hidden">
      
      {/* 1. HERO SECTION: 1-COLUMN CENTERED (VERCEL & LINEAR STYLE) */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 text-center space-y-6">
        
        {/* Pill Kapsul Monokrom Minimalis */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-mono font-medium bg-neutral-900/90 text-neutral-300 border border-neutral-800 shadow-xs">
          <span className="h-1.5 w-1.5 rounded-full bg-neutral-300 animate-subtle-pulse" />
          <span className="tracking-wider text-2xs uppercase">Platform Belajar Mandiri • By Frenzych</span>
        </div>

        {/* Judul Utama Berwibawa */}
        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight leading-[1.05] text-white">
          Bank Materi & Latsol <br />
          <span className="text-neutral-400 font-extrabold">TKA & SNBT</span>
        </h1>

        {/* Slogan & Deskripsi Editorial */}
        <p className="text-sm sm:text-base lg:text-lg text-neutral-400 max-w-2xl mx-auto leading-relaxed font-normal">
          Pusat kurikulum terstruktur, ribuan modul latihan soal terkurasi, dan video pembahasan konsep untuk menembus Perguruan Tinggi Negeri impianmu. Tanpa biaya, tanpa algoritma distraksi.
        </p>

        {/* Tombol Aksi Monokrom Kontras Tinggi */}
        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <Link
            to="/tka"
            className="px-6 py-3 rounded-xl bg-white hover:bg-neutral-200 text-black font-bold text-xs sm:text-sm transition-all hover:-translate-y-0.5 active:translate-y-0 shadow-md flex items-center gap-2 cursor-pointer"
          >
            <span>Mulai Belajar TKA</span>
            <span className="text-xs">→</span>
          </Link>

          <Link
            to="/snbt"
            className="px-6 py-3 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-white font-medium text-xs sm:text-sm border border-neutral-800 hover:border-neutral-700 transition-all hover:-translate-y-0.5 active:translate-y-0 flex items-center gap-2 cursor-pointer"
          >
            <span>Jelajahi Subtes SNBT</span>
            <span className="text-xs text-neutral-400">↗</span>
          </Link>
        </div>

        {/* Indikator Kepercayaan Mikro (Monokrom) */}
        <div className="pt-3 flex flex-wrap items-center justify-center gap-4 sm:gap-6 text-2xs sm:text-xs text-neutral-400 font-mono">
          <span className="flex items-center gap-1.5">
            <span className="text-neutral-300">●</span> 1.014 Modul Live
          </span>
          <span className="flex items-center gap-1.5">
            <span className="text-neutral-300">●</span> 230 Topik Terstruktur
          </span>
          <span className="flex items-center gap-1.5">
            <span className="text-neutral-300">●</span> Bebas Iklan & Distraksi
          </span>
          <span className="flex items-center gap-1.5">
            <span className="text-neutral-300">●</span> 100% Akses Terbuka
          </span>
        </div>
      </section>

      {/* 2. DUAL DIGITAL CLOCK COUNTDOWN WIDGET */}
      <CountdownWidget />

      {/* 3. DUA GERBANG MONOLITIK BESAR: TKA & SNBT */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8 space-y-1.5">
          <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
            Pilih Gerbang Persiapan Belajar
          </h2>
          <p className="text-xs sm:text-sm text-neutral-400 max-w-md mx-auto">
            Setiap jalur disusun hierarkis dari konsep dasar (fundamental) hingga latihan soal tingkat tinggi.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6">
          
          {/* GERBANG 1: TKA */}
          <Link
            to="/tka"
            className="card-obsidian group rounded-2xl p-6 sm:p-8 flex flex-col justify-between"
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 rounded-xl bg-neutral-900 border border-neutral-800 text-white flex items-center justify-center font-black text-lg group-hover:border-neutral-600 transition-colors">
                  TKA
                </div>
                <span className="text-2xs font-mono font-medium uppercase tracking-wider px-2.5 py-0.5 rounded-md bg-neutral-900 text-neutral-400 border border-neutral-800">
                  Ujian Mandiri & TKA
                </span>
              </div>

              <div>
                <h3 className="text-xl sm:text-2xl font-bold text-white group-hover:text-neutral-200 transition-colors">
                  Tes Kemampuan Akademik
                </h3>
                <p className="text-xs sm:text-sm text-neutral-400 mt-2 leading-relaxed">
                  Meliputi materi Fundamental lengkap, 3 Mata Pelajaran Wajib (Matematika, B. Indo, B. Inggris), serta seluruh Mata Pelajaran Pilihan Saintek & Soshum.
                </p>
              </div>

              {/* Tag Sorotan */}
              <div className="flex flex-wrap gap-1.5 pt-2">
                {['Fundamental TKA', 'Materi Wajib', 'Materi Pilihan', 'Latihan Soal'].map((tag) => (
                  <span
                    key={tag}
                    className="text-2xs font-mono px-2 py-0.5 rounded-md bg-neutral-900/90 text-neutral-400 border border-neutral-800/80"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            <div className="mt-8 pt-4 border-t border-neutral-900 flex items-center justify-between text-xs sm:text-sm font-medium text-neutral-300 group-hover:text-white">
              <span>Masuk ke Kurikulum TKA</span>
              <span className="transform group-hover:translate-x-1 transition-transform">→</span>
            </div>
          </Link>

          {/* GERBANG 2: SNBT */}
          <Link
            to="/snbt"
            className="card-obsidian group rounded-2xl p-6 sm:p-8 flex flex-col justify-between"
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 rounded-xl bg-neutral-900 border border-neutral-800 text-white flex items-center justify-center font-black text-lg group-hover:border-neutral-600 transition-colors">
                  SNBT
                </div>
                <span className="text-2xs font-mono font-medium uppercase tracking-wider px-2.5 py-0.5 rounded-md bg-neutral-900 text-neutral-400 border border-neutral-800">
                  UTBK Nasional
                </span>
              </div>

              <div>
                <h3 className="text-xl sm:text-2xl font-bold text-white group-hover:text-neutral-200 transition-colors">
                  Seleksi Nasional Berdasarkan Tes
                </h3>
                <p className="text-xs sm:text-sm text-neutral-400 mt-2 leading-relaxed">
                  Menyediakan Fundamental SNBT dan 7 Subtes UTBK: Penalaran Umum, PPU, PBM, Pengetahuan Kuantitatif, Literasi Bahasa, dan Penalaran Matematika.
                </p>
              </div>

              {/* Tag Sorotan */}
              <div className="flex flex-wrap gap-1.5 pt-2">
                {['Fundamental SNBT', '7 Subtes UTBK', 'Bank Soal Asli', 'Video Konsep'].map((tag) => (
                  <span
                    key={tag}
                    className="text-2xs font-mono px-2 py-0.5 rounded-md bg-neutral-900/90 text-neutral-400 border border-neutral-800/80"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            <div className="mt-8 pt-4 border-t border-neutral-900 flex items-center justify-between text-xs sm:text-sm font-medium text-neutral-300 group-hover:text-white">
              <span>Masuk ke Kurikulum SNBT</span>
              <span className="transform group-hover:translate-x-1 transition-transform">→</span>
            </div>
          </Link>

        </div>
      </section>

      {/* 4. SEKSI MANIFESTO / MOTIVASI EDITORIAL */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6">
        <div className="card-obsidian rounded-2xl p-6 sm:p-8 space-y-6">
          
          {/* Pesan Kutipan */}
          <div className="border-l-2 border-neutral-700 pl-4 py-1 space-y-1">
            <h3 className="text-2xs font-mono font-bold uppercase tracking-widest text-neutral-400">
              Prinsip Pejuang PTN
            </h3>
            <p className="text-sm sm:text-base text-neutral-300 leading-relaxed italic">
              "Lolos PTN bukan hanya soal siapa yang paling cepat paham, melainkan siapa yang paling konsisten bertahan dan terus berlatih setiap hari. Rancang jadwalmu, pahami konsep dasarnya, dan percaya pada proses yang sedang kamu jalani."
            </p>
          </div>

          {/* Misi Platform */}
          <div className="border-t border-neutral-900 pt-5 space-y-1.5">
            <h4 className="text-xs font-semibold text-white tracking-wide uppercase">
              Mengapa repositori ini dibangun?
            </h4>
            <p className="text-xs sm:text-sm text-neutral-400 leading-relaxed">
              Materi belajar di internet sering kali berantakan, terputus-putus, dan penuh distraksi. Repositori ini dirancang khusus sebagai ruang belajar mandiri yang hening, tertata secara logis, dan bebas dari algoritma media sosial. Kamu bisa fokus memahami materi bab demi bab secara tenang hingga tuntas.
            </p>
          </div>

        </div>
      </section>

    </div>
  )
}