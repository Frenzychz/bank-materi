import { Link } from 'react-router-dom'

export default function HomePage() {
  return (
    <div className="space-y-12 sm:space-y-16 py-8 sm:py-12">
      
      {/* 1. HERO SECTION: Judul & Penjelasan Singkat */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 text-center space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-800 border border-blue-200">
          <span>📚</span>
          <span>Repositori Terbuka & Terstruktur</span>
        </div>
        
        <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">
          Bank Materi dan Latsol <br className="hidden sm:inline" />
          <span className="text-blue-700">TKA & SNBT</span> by frenzych
        </h1>
        
        <p className="text-sm sm:text-base text-slate-600 max-w-2xl mx-auto leading-relaxed">
          Pusat materi belajar, latihan soal, modul PDF, rangkuman Google Drive, dan video pembahasan YouTube untuk persiapan seleksi Perguruan Tinggi Negeri. Akses langsung tanpa perlu login.
        </p>
      </section>

      {/* 2. DUA PILIHAN UTAMA: TKA & SNBT */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-6 sm:mb-8">
          <h2 className="text-lg sm:text-xl font-bold text-slate-900">Pilih Jalur Persiapan Belajar</h2>
          <p className="text-xs sm:text-sm text-slate-500">Mulai petualangan belajarmu dengan memilih fokus ujian di bawah ini</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* KARTU 1: TKA */}
          <Link
            to="/tka"
            className="group relative bg-white border-2 border-slate-200 hover:border-blue-600 rounded-2xl p-6 sm:p-8 shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center font-bold text-xl group-hover:bg-blue-600 group-hover:text-white transition-colors">
                TKA
              </div>
              <h3 className="text-xl font-bold text-slate-900 group-hover:text-blue-700 transition-colors">
                Tes Kemampuan Akademik
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Mencakup materi Fundamental dan seluruh mata pelajaran: Matematika, Bahasa Indonesia, Bahasa Inggris, Matematika Tingkat Lanjut, Fisika, Kimia, dan Biologi.
              </p>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs sm:text-sm font-semibold text-blue-700">
              <span>Jelajahi Materi TKA</span>
              <span className="transform group-hover:translate-x-1 transition-transform">→</span>
            </div>
          </Link>

          {/* KARTU 2: SNBT */}
          <Link
            to="/snbt"
            className="group relative bg-white border-2 border-slate-200 hover:border-blue-600 rounded-2xl p-6 sm:p-8 shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-700 flex items-center justify-center font-bold text-xl group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                SNBT
              </div>
              <h3 className="text-xl font-bold text-slate-900 group-hover:text-indigo-700 transition-colors">
                Seleksi Nasional Berdasarkan Tes
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Mencakup materi Fundamental dan seluruh subtes UTBK-SNBT: Penalaran Umum, PPU, PBM, Pengetahuan Kuantitatif, Literasi Bahasa, dan Penalaran Matematika.
              </p>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs sm:text-sm font-semibold text-indigo-700">
              <span>Jelajahi Materi SNBT</span>
              <span className="transform group-hover:translate-x-1 transition-transform">→</span>
            </div>
          </Link>
        </div>
      </section>

      {/* 3. MOTIVASI & ALASAN / TUJUAN WEBSITE */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6">
        <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 space-y-6">
          
          {/* Pesan Motivasi */}
          <div className="border-l-4 border-blue-600 pl-4 py-1 space-y-1">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
              Motivasi untuk Pejuang PTN
            </h3>
            <p className="text-xs sm:text-sm text-slate-700 leading-relaxed italic">
              "Lolos PTN bukan hanya soal siapa yang paling cepat paham, tetapi siapa yang paling konsisten bertahan dan terus berlatih setiap hari. Rancang jadwalmu, pahami konsep dasarnya, dan percaya pada proses yang sedang kamu jalani."
            </p>
          </div>

          {/* Alasan / Tujuan Pembuatan */}
          <div className="border-t border-slate-100 pt-6 space-y-2">
            <h3 className="text-sm font-bold text-slate-900">
              Kenapa website ini dibuat?
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Website ini hadir sebagai wadah belajar mandiri yang rapi, terstruktur, dan bebas gangguan. Seringkali materi belajar bertebaran di mana-mana dan membingungkan untuk dipelajari dari awal. Dengan repositori ini, semua materi, modul PDF, tautan Google Drive, dan video pembahasan telah dikelompokkan hierarkis agar kamu bisa fokus belajar langkah demi langkah.
            </p>
          </div>

        </div>
      </section>

    </div>
  )
}