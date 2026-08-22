import type { Component } from 'vue'
import {
  Activity, Award, BookOpen, Building2, CalendarDays, CircleHelp, Handshake,
  Image, LayoutTemplate, MapPin, MessageSquareQuote, MousePointerClick,
  Newspaper, PanelBottom, Phone, PlaySquare, Share2, Sparkles, Target, Trophy,
  UserPlus, Users,
} from 'lucide-vue-next'
import type { NewSection, SectionSettings, SectionType } from '@/types'

export const SECTION_CATEGORIES = [
  'Semua', 'Header & Banner', 'Informasi Sekolah', 'Akademik', 'Konten & Media',
  'Prestasi & Kegiatan', 'Konversi & Aksi', 'Kontak & Footer',
] as const

export interface SectionPreset {
  type: SectionType
  name: string
  category: Exclude<(typeof SECTION_CATEGORIES)[number], 'Semua'>
  description: string
  icon: Component
  previewGradient: string
  defaultData: NewSection
}

const settings = (bgStyle: SectionSettings['bgStyle'] = 'white'): SectionSettings => ({
  bgStyle, paddingY: 'lg', alignment: 'center', showSubtitle: true,
})
const preset = (type: SectionType, name: string, category: SectionPreset['category'], description: string, icon: Component, previewGradient: string, content: Record<string, unknown> = {}, title = name): SectionPreset => ({
  type, name, category, description, icon, previewGradient,
  defaultData: { type, title, subtitle: '', content, settings: settings(previewGradient.includes('slate') ? 'dark' : 'white'), hidden: false },
})

export const SECTION_PRESETS: SectionPreset[] = [
  preset('hero', 'Hero Banner Interaktif', 'Header & Banner', 'Header utama dengan headline, subjudul, tombol aksi, dan foto sekolah.', Sparkles, 'from-sky-500 to-indigo-600', { badge: 'Pendaftaran telah dibuka', buttonText: 'Daftar Sekarang', buttonUrl: '', image: '' }),
  preset('about', 'Profil & Sambutan Sekolah', 'Informasi Sekolah', 'Profil singkat dan sambutan kepala sekolah.', LayoutTemplate, 'from-emerald-500 to-teal-600', { description: '', principalName: '', principalImage: '' }),
  preset('vision_mission', 'Visi & Misi Sekolah', 'Informasi Sekolah', 'Menampilkan visi, misi, tujuan, dan nilai utama sekolah.', Target, 'from-cyan-500 to-blue-600', { vision: '', missions: [], goals: [], values: [] }),
  preset('statistics', 'Statistik & Pencapaian Utama', 'Informasi Sekolah', 'Angka statistik penting sekolah.', Award, 'from-blue-600 to-sky-500', { items: [] }),
  preset('facilities', 'Fasilitas Sekolah', 'Informasi Sekolah', 'Tampilkan fasilitas unggulan sekolah dengan foto dan deskripsi.', Building2, 'from-teal-500 to-emerald-600', { items: [] }),
  preset('testimonials', 'Testimoni Siswa & Alumni', 'Informasi Sekolah', 'Testimoni siswa, alumni, orang tua, dan mitra industri.', MessageSquareQuote, 'from-fuchsia-500 to-rose-600', { items: [] }, 'Apa Kata Mereka'),
  preset('partners', 'Mitra & Kerja Sama', 'Informasi Sekolah', 'Logo perusahaan, universitas, lembaga, dan mitra industri.', Handshake, 'from-indigo-500 to-violet-600', { items: [] }),
  preset('programs', 'Program Keahlian & Jurusan', 'Akademik', 'Daftar program keahlian beserta deskripsi dan prospek.', BookOpen, 'from-amber-500 to-orange-600', { items: [] }),
  preset('teachers', 'Dewan Guru & Tenaga Ahli', 'Akademik', 'Kartu profil pendidik dan praktisi industri.', Users, 'from-violet-500 to-purple-600', { items: [] }),
  preset('extracurricular', 'Ekstrakurikuler', 'Akademik', 'Kegiatan ekstrakurikuler lengkap dengan jadwal.', Activity, 'from-lime-500 to-green-600', { items: [] }),
  preset('news', 'Berita & Pengumuman Sekolah', 'Konten & Media', 'Artikel, berita, dan pengumuman terkini.', Newspaper, 'from-rose-500 to-pink-600', { items: [] }),
  preset('gallery', 'Galeri Fasilitas & Kegiatan', 'Konten & Media', 'Galeri foto kegiatan dan fasilitas sekolah.', Image, 'from-cyan-500 to-blue-600', { items: [] }),
  preset('video', 'Video Profil Sekolah', 'Konten & Media', 'Video profil atau dokumentasi sekolah.', PlaySquare, 'from-red-500 to-rose-700', { videoUrl: '', poster: '', description: '' }),
  preset('achievements', 'Prestasi Sekolah', 'Prestasi & Kegiatan', 'Prestasi sekolah dari tingkat kota hingga internasional.', Trophy, 'from-yellow-500 to-amber-600', { items: [] }),
  preset('agenda', 'Agenda & Kegiatan', 'Prestasi & Kegiatan', 'Jadwal agenda dan kegiatan sekolah.', CalendarDays, 'from-orange-500 to-red-500', { items: [] }, 'Agenda Sekolah'),
  preset('cta', 'Ajakan & Pendaftaran', 'Konversi & Aksi', 'Ajakan mendaftar, menghubungi, atau mengunjungi sekolah.', MousePointerClick, 'from-indigo-600 to-sky-600', { buttonText: 'Daftar Sekarang', buttonUrl: '' }, 'Bergabung Bersama Kami'),
  preset('ppdb', 'Penerimaan Peserta Didik Baru', 'Konversi & Aksi', 'Informasi periode, persyaratan, dan tautan pendaftaran PPDB.', UserPlus, 'from-sky-600 to-blue-700', { description: '', registrationPeriod: '', requirements: [], buttonText: 'Daftar PPDB', buttonUrl: '' }, 'PPDB'),
  preset('faq', 'Pertanyaan yang Sering Diajukan', 'Konversi & Aksi', 'Pertanyaan dan jawaban umum dalam tampilan accordion.', CircleHelp, 'from-purple-500 to-indigo-600', { items: [] }, 'Pertanyaan Umum'),
  preset('contact', 'Kontak Sekolah', 'Kontak & Footer', 'Alamat, telepon, email, WhatsApp, dan Google Maps.', Phone, 'from-slate-700 to-slate-900', { address: '', phone: '', email: '', whatsapp: '', mapsUrl: '' }, 'Hubungi Kami'),
  preset('map', 'Lokasi Sekolah', 'Kontak & Footer', 'Peta lokasi sekolah menggunakan URL embed yang aman.', MapPin, 'from-emerald-600 to-teal-700', { mapEmbedUrl: '' }, 'Lokasi Kami'),
  preset('social_media', 'Media Sosial Sekolah', 'Kontak & Footer', 'Tautan media sosial sekolah yang aktif.', Share2, 'from-pink-500 to-violet-600', { instagram: '', youtube: '', tiktok: '', facebook: '', twitter: '' }, 'Ikuti Kami'),
  preset('footer', 'Footer Website', 'Kontak & Footer', 'Identitas, kontak, tautan cepat, dan media sosial sekolah.', PanelBottom, 'from-slate-900 to-slate-950', { schoolName: '', description: '', address: '', phone: '', email: '', links: [], socialMedia: {} }, 'Footer'),
]
