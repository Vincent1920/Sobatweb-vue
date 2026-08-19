export const mockSchool = {
  id: 'school-1', name: 'SMK Sobat Teknologi', personInCharge: 'Ahmad Fauzi, S.Kom.',
  email: 'admin@smksobat.sch.id',
  logo: 'https://images.unsplash.com/photo-1546410531-bb4caa6b424d?w=160&auto=format&fit=crop&q=80',
}

export const mockWebsite = {
  id: 'site-sobat-1', schoolName: 'SMK Sobat Teknologi', subdomain: 'sobat',
  fullDomain: 'sobat.smktelkom.com', templateName: 'Modern School', status: 'published' as const,
  lastUpdated: '14 Agu 2026, 10:45', lastPublished: '14 Agu 2026, 10:45', pageCount: 7, mediaCount: 8,
  sections: [
    ['Membangun Generasi Digital Berkeahlian Industri Global', 'hero', 'gradient'],
    ['Sambutan Kepala Sekolah', 'about', 'white'],
    ['Program Keahlian Unggulan', 'programs', 'muted'],
    ['Berita & Agenda Terbaru', 'news', 'white'],
    ['Fasilitas Berstandar Industri', 'gallery', 'muted'],
    ['Apa Kata Alumni & Industri?', 'testimonials', 'white'],
    ['Siap Menjadi Bagian dari Talenta Masa Depan?', 'cta', 'gradient'],
    ['Hubungi & Kunjungi Kampus Kami', 'contact', 'white'],
  ],
}
