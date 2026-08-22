# Product Requirements Document (PRD)

## SobatWeb-vue

**Product:** SobatWeb
**Frontend:** Vue.js 3 + TypeScript + Vite + Tailwind CSS + Pinia + Vue Router + Axios
**Backend:** SobatBE — Bun + Hono + TypeScript + MySQL + JWT
**Document:** `PRD.md`

---

# 1. Problem Statement

Banyak sekolah membutuhkan website resmi untuk menampilkan profil, program keahlian, guru dan staf, berita, galeri, informasi PPDB, kontak, dan informasi lainnya. Namun proses membuat dan mengelola website sekolah sering membutuhkan kemampuan teknis seperti HTML, CSS, JavaScript, hosting, dan pengelolaan backend.

SobatWeb dibuat sebagai platform website builder untuk sekolah sehingga pengguna sekolah dapat membuat dan mengelola website melalui visual editor tanpa harus melakukan coding.

Project saat ini terdiri dari:

```text
Sobatweb-vue
↓ REST API
SobatBE
↓
MySQL
```

Frontend SobatWeb-vue menyediakan visual editor untuk mengelola:

```text
Pages
Sections
Theme
SEO
Navigation
Media
Website Settings
Subdomain
Publish
```

Masalah utama yang ingin diselesaikan adalah:

* Pengguna sekolah tidak memiliki cara sederhana untuk membuat website sekolah tanpa coding.
* Konten website sering sulit diperbarui karena bergantung pada developer.
* Halaman, section, navigation, dan theme perlu dikelola melalui satu editor.
* Data website harus tersimpan secara permanen ke backend dan MySQL.
* Editor harus memberikan perubahan secara langsung tanpa membuat pengguna menunggu setiap request API.
* Setiap sekolah harus hanya dapat mengakses data miliknya sendiri.
* Website yang dibuat harus responsive pada desktop, tablet, dan mobile.
* Draft yang sedang diedit harus dapat dibedakan dari website yang sudah dipublish.
* Admin perlu dapat mengelola sekolah dan website dari sistem yang sama.

---

# 2. Goals

Tujuan utama SobatWeb-vue adalah menyediakan visual website builder yang mudah digunakan oleh sekolah dan terintegrasi penuh dengan SobatBE.

## 2.1 Primary Goals

### 1. Visual Website Builder

Pengguna dapat membangun website menggunakan section siap pakai seperti:

```text
Hero
About
Vision & Mission
Statistics
Facilities
Programs
Teachers
Extracurricular
News
Gallery
Testimonials
Partners
Achievements
Agenda
FAQ
CTA
PPDB
Contact
Map
Social Media
Footer
```

Tanpa menulis HTML atau CSS.

### 2. Page Management

Pengguna dapat membuat dan mengelola beberapa halaman seperti:

```text
Beranda
Profil
Program Keahlian
Guru & Staf
Berita
Galeri
Kontak
```

Setiap halaman memiliki section sendiri.

### 3. Local-First Editing

Perubahan harus langsung terlihat di canvas.

Flow:

```text
User Edit
↓
Vue / Pinia local state
↓
Canvas update
↓
Autosave debounce
↓
SobatBE API
↓
MySQL
```

### 4. Reliable Persistence

Data yang sudah berstatus:

```text
Tersimpan
```

harus benar-benar sudah berhasil disimpan oleh backend.

Refresh browser tidak boleh menghilangkan perubahan yang sudah tersimpan.

### 5. Responsive Website

Website hasil builder harus berfungsi pada:

```text
Desktop
Tablet
Mobile
```

Termasuk responsive navigation.

### 6. Page-Based Navigation

Navbar website harus dapat mengikuti halaman website.

Contoh:

```text
Pages:
Beranda
Profil
Program Keahlian
Prestasi

↓

Navbar:
Beranda | Profil | Program Keahlian | Prestasi
```

### 7. Theme Customization

Pengguna dapat mengubah:

```text
Color Palette
Typography
Corner Radius
```

tanpa mengubah struktur website.

### 8. SEO Management

Pengguna dapat mengatur SEO website/page seperti:

```text
SEO Title
Meta Description
Keywords
OG Image
```

### 9. Multi-Tenant Security

Setiap sekolah hanya dapat mengakses:

```text
school_id miliknya sendiri
```

School A tidak boleh membaca atau mengubah website School B.

### 10. Publishing

Pengguna dapat membedakan:

```text
Draft saved
```

dengan:

```text
Published website
```

Publish hanya boleh dilakukan setelah pending autosave selesai.

---

# 3. Target Users

## 3.1 School Administrator

Pengguna utama SobatWeb.

Contoh:

```text
Operator Sekolah
Admin Website Sekolah
Guru yang bertanggung jawab terhadap website
Staf Tata Usaha
Tim IT Sekolah
```

Kebutuhan:

* Membuat website.
* Mengubah halaman.
* Menambah section.
* Mengedit konten.
* Mengupload gambar.
* Mengatur tema.
* Mengatur SEO.
* Mengatur subdomain.
* Publish website.

---

## 3.2 School Management

Contoh:

```text
Kepala Sekolah
Wakil Kepala Sekolah
Humas
Tim PPDB
```

Kebutuhan:

* Memastikan informasi website benar.
* Melihat preview.
* Mengelola informasi sekolah.
* Memastikan PPDB dan kontak dapat diakses.

---

## 3.3 Platform Administrator

Admin SobatWeb.

Kebutuhan:

* Melihat daftar sekolah.
* Melihat website sekolah.
* Mengelola template.
* Melihat subdomain.
* Melihat activity logs.
* Mengelola status website/sekolah.
* Membantu troubleshooting tenant.

---

## 3.4 Public Visitor

Pengunjung website sekolah.

Contoh:

```text
Calon siswa
Orang tua
Siswa
Alumni
Guru
Masyarakat
Mitra industri
```

Kebutuhan:

* Membuka website tanpa login.
* Mengakses halaman.
* Menggunakan navigation.
* Membaca informasi sekolah.
* Melihat berita.
* Melihat galeri.
* Mengakses PPDB.
* Menghubungi sekolah.

---

# 4. User Stories

## 4.1 Authentication

### US-01

Sebagai pengguna sekolah, saya ingin login agar dapat mengakses website saya.

### US-02

Sebagai pengguna sekolah, saya ingin session tetap valid setelah browser direfresh sehingga saya tidak perlu login berulang kali.

### US-03

Sebagai admin platform, saya ingin diarahkan ke Admin Portal setelah login sebagai admin.

---

# 4.2 Dashboard

### US-04

Sebagai pengguna sekolah, saya ingin melihat status website saya agar mengetahui apakah website masih draft atau sudah published.

### US-05

Sebagai pengguna sekolah, saya ingin membuka Visual Editor dari dashboard.

---

# 4.3 Pages

### US-06

Sebagai pengguna sekolah, saya ingin melihat daftar halaman website saya.

### US-07

Sebagai pengguna sekolah, saya ingin menambah halaman baru.

### US-08

Sebagai pengguna sekolah, saya ingin berpindah halaman tanpa reload browser.

### US-09

Sebagai pengguna sekolah, saya ingin mengetahui dengan jelas halaman mana yang sedang saya edit.

Contoh:

```text
Mengedit: Profil • /profil
```

### US-10

Sebagai pengguna sekolah, saya ingin menghapus atau mengubah halaman jika diperlukan.

---

# 4.4 Sections

### US-11

Sebagai pengguna sekolah, saya ingin menambahkan section ke halaman.

### US-12

Sebagai pengguna sekolah, saya ingin memilih halaman tujuan saat menambahkan section.

Contoh:

```text
Beranda | Profil | Program Keahlian
```

### US-13

Sebagai pengguna sekolah, saya ingin mengedit konten section langsung melalui editor.

### US-14

Sebagai pengguna sekolah, saya ingin perubahan langsung terlihat di canvas.

### US-15

Sebagai pengguna sekolah, saya ingin menduplikasi section.

### US-16

Sebagai pengguna sekolah, saya ingin menghapus section.

### US-17

Sebagai pengguna sekolah, saya ingin memindahkan urutan section.

### US-18

Sebagai pengguna sekolah, saya ingin menyembunyikan section tanpa harus menghapusnya.

---

# 4.5 Selection & Canvas

### US-19

Sebagai pengguna sekolah, ketika saya memilih section pada sidebar, saya ingin canvas otomatis fokus ke section tersebut.

### US-20

Sebagai pengguna sekolah, ketika saya memilih section di canvas, sidebar harus menunjukkan section yang sama.

### US-21

Sebagai pengguna sekolah, saya ingin panel properti menampilkan data section yang sedang aktif.

---

# 4.6 Autosave

### US-22

Sebagai pengguna sekolah, saya ingin perubahan tersimpan otomatis setelah saya berhenti mengetik.

### US-23

Sebagai pengguna sekolah, saya ingin melihat status:

```text
Ada perubahan belum tersimpan
Menyimpan...
Tersimpan
Gagal menyimpan
```

### US-24

Sebagai pengguna sekolah, jika jaringan gagal, saya tidak ingin perubahan lokal langsung hilang.

### US-25

Sebagai pengguna sekolah, saya ingin pending changes disimpan sebelum saya melakukan Publish.

---

# 4.7 Theme

### US-26

Sebagai pengguna sekolah, saya ingin memilih preset warna untuk website saya.

### US-27

Sebagai pengguna sekolah, saya ingin memilih font website.

### US-28

Sebagai pengguna sekolah, saya ingin mengubah corner radius website.

### US-29

Sebagai pengguna sekolah, saya ingin theme berubah langsung pada canvas.

---

# 4.8 SEO

### US-30

Sebagai pengguna sekolah, saya ingin mengatur SEO title.

### US-31

Sebagai pengguna sekolah, saya ingin mengatur meta description.

### US-32

Sebagai pengguna sekolah, saya ingin pengaturan SEO tersimpan otomatis.

---

# 4.9 Navigation

### US-33

Sebagai pengguna sekolah, saya ingin navbar website mengikuti halaman yang tersedia.

### US-34

Sebagai pengguna sekolah, ketika saya menambah halaman, navbar harus ikut diperbarui.

### US-35

Sebagai pengguna sekolah, saya ingin navbar website responsive.

Desktop:

```text
Beranda | Profil | Program | Kontak
```

Mobile:

```text
Brand                           ☰
```

### US-36

Sebagai pengguna editor, ketika saya klik menu navbar website di canvas, saya ingin halaman editor berpindah tanpa reload.

---

# 4.10 Media

### US-37

Sebagai pengguna sekolah, saya ingin mengupload gambar.

### US-38

Sebagai pengguna sekolah, saya ingin mengganti gambar section.

### US-39

Sebagai pengguna sekolah, saya ingin media yang sudah diupload dapat digunakan kembali.

---

# 4.11 Publish

### US-40

Sebagai pengguna sekolah, saya ingin melihat preview sebelum publish.

### US-41

Sebagai pengguna sekolah, saya ingin publish website setelah seluruh perubahan tersimpan.

### US-42

Sebagai pengguna sekolah, saya ingin mengetahui jika perubahan terbaru belum dipublish.

---

# 4.12 Public Website

### US-43

Sebagai pengunjung, saya ingin membuka website sekolah menggunakan subdomain.

### US-44

Sebagai pengunjung, saya ingin berpindah halaman melalui navbar.

### US-45

Sebagai pengunjung mobile, saya ingin navbar dapat digunakan melalui hamburger menu.

---

# 5. Functional Requirements

## FR-01 Authentication

System harus mendukung:

```text
Register
Login
Refresh Token
Current User
Logout
```

Frontend API:

```text
POST /api/auth/register
POST /api/auth/login
GET  /api/auth/me
POST /api/auth/refresh
POST /api/auth/logout
```

---

## FR-02 Role-Based Access

System harus membedakan:

```text
school
admin
```

School user tidak boleh membuka Admin Portal.

---

## FR-03 Page Management

System harus dapat:

```text
List page
Create page
Read page
Update page
Delete page
Reorder page jika tersedia
```

Halaman harus memiliki minimal:

```text
id
websiteId
name
slug
isHome
sortOrder
status
```

---

## FR-04 Active Page

Frontend harus menyimpan:

```text
activePageId
```

Halaman aktif harus mempengaruhi:

```text
Canvas
Sections Panel
Page Indicator
Modal Add Section
Navbar Preview
```

---

## FR-05 Section Management

System harus mendukung:

```text
GET sections
CREATE section
UPDATE section
DELETE section
DUPLICATE section
REORDER section
MOVE section
HIDE / SHOW section
```

---

## FR-06 Section Types

System minimal harus mendukung section seperti:

```text
hero
about
vision_mission
statistics
facilities
programs
teachers
extracurricular
news
gallery
testimonials
partners
achievements
agenda
faq
cta
ppdb
contact
map
social_media
footer
```

---

## FR-07 Section Persistence

Section harus tersimpan di:

```text
website_sections
```

Minimal mempunyai:

```text
id
website_id
page_id
type
title
content
settings
sort_order
hidden
created_at
updated_at
```

---

## FR-08 Section Selection

Frontend harus memiliki:

```text
selectedSectionId
```

Satu section saja yang boleh aktif.

Selection harus sinkron antara:

```text
Sidebar
Canvas
Property Panel
```

---

## FR-09 Canvas Scroll

Klik section sidebar harus:

```text
select
↓
scroll canvas
↓
highlight
```

Klik section canvas harus:

```text
select
↓
highlight sidebar
↓
show properties
```

---

## FR-10 Local-First Editing

Saat edit:

```text
Input
↓
Pinia
↓
Canvas
```

harus terjadi sebelum response API.

---

## FR-11 Autosave

Autosave menggunakan debounce sekitar:

```text
700–1000 ms
```

Recommended:

```text
800 ms
```

Tidak boleh satu karakter menghasilkan satu API request.

---

## FR-12 Save Status

System harus memiliki:

```text
idle
dirty
saving
saved
error
```

`Tersimpan` hanya boleh muncul setelah API sukses.

---

## FR-13 Autosave Race Protection

System harus menangani request lama agar tidak menimpa perubahan lebih baru.

Dapat menggunakan:

```text
revision counter
request sequence
```

---

## FR-14 Flush Pending Saves

Frontend harus menyediakan:

```text
flushPendingSaves()
```

digunakan sebelum:

```text
Publish
Page Switch jika diperlukan
Preview
Critical Navigation
```

---

## FR-15 Add Section Modal

Modal harus memiliki:

### Page Target Navigation

```text
Beranda | Profil | Program Keahlian | ...
```

### Category Navigation

```text
Semua
Header & Banner
Informasi Sekolah
Akademik
Konten & Media
Prestasi & Kegiatan
Konversi & Aksi
Kontak & Footer
```

---

## FR-16 Target Page Selection

Modal harus mempunyai:

```text
targetPageId
```

Default:

```text
targetPageId = activePageId
```

Section dibuat ke:

```text
POST /api/pages/:targetPageId/sections
```

---

## FR-17 Theme Management

Theme harus mendukung:

```text
Color palette
Font
Corner radius
```

Theme harus menggunakan local preview kemudian autosave.

---

## FR-18 SEO Management

SEO harus mendukung field sesuai schema backend, minimal:

```text
title
description
keywords
OG metadata jika tersedia
```

---

## FR-19 Website Navigation

Navbar preview harus menggunakan page data atau navigation data yang disinkronkan.

Navbar tidak boleh menggunakan menu hardcoded.

---

## FR-20 Responsive Navbar

Desktop:

```text
Brand + horizontal menu
```

Mobile:

```text
Brand + hamburger
```

Tidak boleh terjadi horizontal overflow navbar.

---

## FR-21 Preview Modes

Editor harus menyediakan:

```text
Desktop
Tablet
Mobile
```

Preview mode boleh mengubah width canvas.

Preview mode tidak boleh memaksa tinggi canvas menjadi fixed.

---

## FR-22 Dynamic Canvas

Canvas website harus:

```text
height = content height
```

Bukan:

```text
h-screen
min-h-screen
fixed device height
```

Page dengan section lebih banyak harus otomatis lebih panjang.

---

## FR-23 Empty Page

Jika halaman tidak mempunyai section:

```text
Halaman "Profil" belum memiliki section.
+ Tambah Section
```

harus ditampilkan tanpa membuat canvas menjadi area kosong setinggi viewport.

---

## FR-24 Media Upload

Media upload harus:

* Validasi file type.
* Validasi file size.
* Generate safe filename.
* Menyimpan metadata ke database.
* Menyimpan file ke storage.

---

## FR-25 Publishing

Publish harus:

```text
flush pending saves
↓
verify success
↓
publish API
```

Jika save gagal:

```text
Publish blocked
```

---

## FR-26 Draft vs Published

System harus membedakan:

```text
Saved Draft
```

dan:

```text
Published Version
```

UI dapat menunjukkan:

```text
Tersimpan
Ada Perubahan Belum Dipublish
```

secara bersamaan.

---

## FR-27 Public Website

Website publik harus dapat diakses berdasarkan:

```text
subdomain
```

Contoh endpoint:

```text
GET /api/public/sites/:subdomain
GET /api/public/sites/:subdomain/pages/:slug
```

---

## FR-28 Admin Portal

Admin minimal dapat melihat:

```text
Schools
Websites
Templates
Subdomains
Activity Logs
```

---

# 6. Non-Functional Requirements

## NFR-01 Performance

Perubahan local editor harus terasa instan.

Target:

```text
local UI update < 100ms
```

Autosave tidak boleh memblok UI.

---

## NFR-02 API Efficiency

Autosave harus menggunakan debounce.

Tidak boleh:

```text
1 keypress = 1 request
```

---

## NFR-03 Reliability

Setelah API memberikan status sukses:

```text
refresh browser
```

tidak boleh menghilangkan perubahan.

---

## NFR-04 Security

System harus menerapkan:

```text
JWT authentication
Role authorization
Tenant ownership validation
Zod validation
Parameterized SQL
CORS whitelist
Password hashing
Refresh token security
Rate limiting
```

---

## NFR-05 Multi-Tenant Isolation

Semua resource tenant harus diverifikasi terhadap:

```text
authenticatedUser.schoolId
```

Frontend tidak boleh menjadi sumber kebenaran `school_id`.

---

## NFR-06 Responsive Design

Website dan editor harus usable pada minimal:

```text
375px
430px
768px
1024px
1440px
```

---

## NFR-07 Browser Support

Minimal browser modern:

```text
Chrome
Edge
Firefox
Safari
```

---

## NFR-08 Maintainability

Frontend harus mengikuti separation:

```text
View
↓
Component
↓
Pinia
↓
Service
↓
API
```

Backend:

```text
Route
↓
Middleware / Validator
↓
Controller
↓
Service
↓
Repository
↓
MySQL
```

---

## NFR-09 Type Safety

Frontend dan backend harus menggunakan TypeScript.

Hindari:

```ts
any
```

jika type dapat didefinisikan.

---

## NFR-10 Build Stability

Frontend:

```bash
npm run build
```

harus PASS sebelum fitur dianggap selesai.

Backend typecheck/test juga harus berhasil sesuai script project.

---

## NFR-11 Error Handling

Frontend tidak boleh menampilkan raw error seperti:

```text
AxiosError
SQLSTATE
stack trace
```

Gunakan message user-friendly.

---

## NFR-12 Accessibility

Interactive component harus dapat digunakan dengan:

```text
mouse
keyboard
```

dan menggunakan semantic markup bila memungkinkan.

---

## NFR-13 Data Integrity

Operasi bulk seperti reorder harus menggunakan transaction.

Contoh:

```text
BEGIN
UPDATE...
UPDATE...
COMMIT
```

Jika gagal:

```text
ROLLBACK
```

---

## NFR-14 Scalability

Arsitektur harus memungkinkan penambahan section baru tanpa mengubah struktur database besar.

Gunakan:

```text
type
content JSON
settings JSON
```

untuk flexible section configuration.

---

# 7. Scope

## 7.1 In Scope

Fitur berikut termasuk scope SobatWeb-vue:

### Authentication

```text
Register
Login
Logout
Session restore
JWT
Role handling
```

### Dashboard

```text
Website overview
Website status
Quick navigation
```

### Visual Editor

```text
Sections
Pages
Theme
SEO
Canvas
Property panel
Preview mode
Autosave
Publish
```

### Page Management

```text
Create
Read
Update
Delete
Switch Page
```

### Section Management

```text
Add
Edit
Delete
Duplicate
Move
Reorder
Hide/Show
```

### Page Target Selection

Menentukan halaman tujuan saat menambahkan section.

### Website Navigation

Navbar otomatis berdasarkan halaman atau data navigation yang selalu disinkronkan.

### Responsive Website

```text
Desktop
Tablet
Mobile
```

### Theme

```text
Color
Typography
Corner radius
```

### SEO

```text
SEO title
Description
Metadata
```

### Media

```text
Upload
Select
Use image
Delete jika tersedia
```

### Subdomain

```text
Check availability
Assign subdomain
Public URL
```

### Publishing

```text
Draft
Preview
Publish
```

### Public Website

Website sekolah yang dapat diakses tanpa login.

### Admin

```text
Schools
Websites
Templates
Subdomains
Logs
```

### Multi-Tenant

Isolation berdasarkan:

```text
school_id
```

---

## 7.2 Out of Scope — Initial Version

Untuk versi awal, berikut tidak menjadi prioritas utama:

```text
Real-time multi-user collaborative editing
Git-style website version control
Advanced animation builder
Custom JavaScript injection
Full custom CSS editor
Marketplace template pihak ketiga
Advanced analytics platform
A/B testing
E-commerce
Payment gateway
Learning Management System
Student Information System
Automatic AI content generation
Custom plugin architecture
Multiple custom domains per website
```

Fitur tersebut dapat dipertimbangkan setelah core Website Builder stabil.

---

# 8. Product Flow

Flow utama user sekolah:

```text
Register / Login
↓
Dashboard
↓
Website Setup / Onboarding
↓
Visual Editor
↓
Select Page
↓
Add Section
↓
Edit Content
↓
Autosave
↓
Theme / SEO
↓
Preview
↓
Publish
↓
Public Website
```

---

# 9. Editor State Model

Frontend editor minimal memiliki konsep:

```text
activePageId
selectedSectionId
activeSidebarTab
previewMode
saveStatus
isPublishedDirty
```

Temporary modal state:

```text
targetPageId
activeCategory
```

Persistent data tidak boleh bergantung pada state UI tersebut.

---

# 10. Data Flow

```text
Sobatweb-vue
↓
Pinia
↓
Service
↓
Axios
↓
SobatBE
↓
Route
↓
Validator
↓
Controller
↓
Service
↓
Repository
↓
MySQL
```

---

# 11. Source of Truth

Saat editing:

```text
Pinia
=
current local draft
```

Persistence:

```text
MySQL
=
durable source of truth
```

Reload:

```text
MySQL
↓ API
↓ Pinia
↓ Canvas
```

---

# 12. Success Criteria

SobatWeb-vue dianggap memenuhi versi core apabila:

* User dapat login menggunakan API nyata.
* User dapat membuat dan memilih halaman.
* User mengetahui halaman yang sedang diedit.
* User dapat menambah section ke halaman tertentu.
* Section tersimpan ke MySQL.
* User dapat edit section dengan local-first autosave.
* Refresh tidak menghilangkan perubahan tersimpan.
* Duplicate/Delete/Reorder tetap persisten.
* Theme tersimpan.
* SEO tersimpan.
* Navbar mengikuti halaman.
* Mobile navbar menggunakan hamburger.
* Canvas tetap dynamic dan tidak fixed-height.
* Preview Desktop/Tablet/Mobile bekerja.
* Publish hanya dilakukan setelah pending save selesai.
* Website publik dapat diakses dari subdomain.
* School A tidak dapat mengakses resource School B.
* Frontend build berhasil tanpa error.
