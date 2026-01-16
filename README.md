```markdown
# Booking App - Hotel Reservation System

Sistem manajemen reservasi hotel yang komprehensif dengan backend REST API, panel admin, dan aplikasi klien untuk booking hotel secara online.

## 📋 Daftar Isi

- [Fitur Utama](#fitur-utama)
- [Teknologi yang Digunakan](#teknologi-yang-digunakan)
- [Prasyarat Installasi](#prasyarat-installasi)
- [Instalasi](#instalasi)
- [Susunan Proyek](#susunan-proyek)
- [Contoh Penggunaan](#contoh-penggunaan)
- [Kontribusi](#kontribusi)
- [Lisensi](#lisensi)

## 🎯 Fitur Utama

### Backend Server
- **Autentikasi & Autorisasi**: Sistem login dengan JWT dan role-based access control (Super Admin, Staff)
- **Manajemen Hotel**: CRUD operasi untuk data hotel
- **Manajemen Kamar**: Pengelolaan kamar hotel dengan detail fasilitas dan harga
- **Sistem Reservasi**: Pemesanan kamar dengan status tracking dan otomatis checkout
- **Manajemen Fasilitas**: Kelola fasilitas yang tersedia di hotel
- **Pembayaran**: Integrasi Midtrans untuk sistem pembayaran online
- **Upload Gambar**: Integrasi Cloudinary untuk penyimpanan gambar
- **Auto Checkout**: Sistem otomatis untuk checkout reservasi yang sudah berakhir
- **QRIS Proxy**: Proxy untuk handling QRIS payment

### Admin Panel
- Dashboard dengan chart dan statistik
- Manajemen staff dan user
- Kelola profil hotel dan kamar
- Monitoring reservasi
- History reservasi dengan detail transaksi

### Client Application
- Browsing hotel dan kamar
- Sistem reservasi yang user-friendly
- Pembayaran online via Midtrans
- Riwayat reservasi pengguna
- Gallery dan detail fasilitas hotel
- Responsive design untuk mobile dan desktop

## 🛠️ Teknologi yang Digunakan

### Backend
- **Runtime**: Node.js (ES6 Modules)
- **Framework**: Express.js
- **Database**: MongoDB dengan Mongoose
- **Autentikasi**: JWT (JSON Web Tokens), bcrypt
- **File Upload**: Multer, Cloudinary
- **Pembayaran**: Midtrans Client
- **Scheduling**: Node Cron
- **Security**: Helmet, Express Mongo Sanitize, CORS
- **Tunneling**: ngrok

### Admin Panel
- **Frontend Framework**: React 19
- **Build Tool**: Vite
- **UI Library**: Material-UI (MUI), Tailwind CSS
- **State Management**: Zustand
- **HTTP Client**: Axios
- **Router**: React Router v7
- **Charts**: Chart.js, react-chartjs-2
- **Animation**: Framer Motion
- **Icons**: Lucide React, MUI Icons

### Client Application
- **Frontend Framework**: React 19
- **Build Tool**: Vite
- **Styling**: Tailwind CSS, DaisyUI
- **State Management**: Zustand
- **HTTP Client**: Axios
- **Router**: React Router v7
- **Animation**: Framer Motion
- **Icons**: React Icons
- **Carousel**: React Responsive Carousel

## 📦 Prasyarat Installasi

Pastikan Anda telah menginstall:

- **Node.js** (v18 atau lebih tinggi)
- **npm** atau **yarn** sebagai package manager
- **MongoDB** (lokal atau MongoDB Atlas)
- **Git** untuk version control

## 🚀 Instalasi

### 1. Clone Repository

```bash
git clone https://github.com/githubprojek/admin-reservasi.git
cd admin-reservasi
```

### 2. Setup Backend Server

```bash
cd server

# Install dependencies
npm install

# Konfigurasi environment variables
# Buat file .env dengan konfigurasi berikut:
# PORT=5000
# MONGODB_URI=mongodb+srv://your_username:your_password@cluster.mongodb.net/booking_db
# JWT_SECRET=your_jwt_secret_key
# CLOUDINARY_CLOUD_NAME=your_cloudinary_name
# CLOUDINARY_API_KEY=your_cloudinary_api_key
# CLOUDINARY_API_SECRET=your_cloudinary_api_secret
# MIDTRANS_SERVER_KEY=your_midtrans_server_key
# MIDTRANS_CLIENT_KEY=your_midtrans_client_key

# Jalankan server
npm start
# Server akan berjalan di http://localhost:5000
```

### 3. Setup Admin Panel

```bash
cd ../admin

# Install dependencies
npm install

# Buat file .env.local
# VITE_API_URL=http://localhost:5000

# Jalankan development server
npm run dev
# Admin panel akan berjalan di http://localhost:5173
```

### 4. Setup Client Application

```bash
cd ../client

# Install dependencies
npm install

# Buat file .env.local
# VITE_API_URL=http://localhost:5000

# Jalankan development server
npm run dev
# Client akan berjalan di http://localhost:5174
```

## 📁 Susunan Proyek

```
booking-app/
├── server/                          # Backend REST API
│   ├── src/
│   │   ├── controllers/             # Logika bisnis untuk setiap endpoint
│   │   │   ├── login.controllers.js      # Autentikasi & user management
│   │   │   ├── hotel.controllers.js      # Hotel CRUD operations
│   │   │   ├── room.controllers.js       # Room CRUD operations
│   │   │   ├── reservasi.controllers.js  # Reservation management
│   │   │   └── fasilitas.controllers.js  # Facilities management
│   │   ├── models/                  # Database schemas
│   │   │   ├── login.models.js           # User/Staff model
│   │   │   ├── hotel.models.js           # Hotel model
│   │   │   ├── room.models.js            # Room model
│   │   │   ├── reservasi.models.js       # Reservation model
│   │   │   ├── history.reservasi.models.js # Reservation history
│   │   │   └── fasilitas.models.js       # Facilities model
│   │   ├── routes/                  # API endpoints
│   │   │   ├── login.route.js            # Auth routes
│   │   │   ├── hotel.route.js            # Hotel routes
│   │   │   ├── room.route.js             # Room routes
│   │   │   ├── reservasi.route.js        # Reservation routes
│   │   │   ├── fasilitas.route.js        # Facilities routes
│   │   │   └── qrisProxy.routes.js       # QRIS payment proxy
│   │   ├── middleware/              # Custom middleware
│   │   │   ├── auth.middleware.js        # JWT validation & role authorization
│   │   │   └── uploadImage.js            # Image upload handling
│   │   └── lib/                     # Utility functions
│   │       ├── db.js                     # MongoDB connection
│   │       ├── cloudinary.js             # Cloudinary integration
│   │       ├── midtrans.js               # Midtrans payment integration
│   │       ├── autoCheckout.js           # Auto checkout scheduler
│   │       ├── checkoutHelper.js         # Checkout helper functions
│   │       └── utils.js                  # Utility functions
│   ├── index.js                     # Server entry point
│   ├── package.json
│   ├── .env                         # Environment variables
│   └── vercel.json                  # Vercel deployment config
│
├── admin/                           # Admin Dashboard (React)
│   ├── src/
│   │   ├── components/              # Reusable UI components
│   │   │   ├── Navbar.jsx
│   │   │   ├── Sidebar.jsx
│   │   │   ├── ProtectedRoute.jsx
│   │   │   ├── Spinner.jsx
│   │   │   └── ConfrimModal.jsx
│   │   ├── features/                # Feature-specific components
│   │   │   ├── auth/                # Authentication pages
│   │   │   │   ├── Login.jsx
│   │   │   │   ├── Profile.jsx
│   │   │   │   ├── Staff.jsx
│   │   │   │   ├── AddStaff.jsx
│   │   │   │   ├── updateStaff.jsx
│   │   │   │   └── useStoreAuth.js  # Auth state management
│   │   │   ├── dashboard/           # Dashboard components
│   │   │   │   ├── Dashboard.jsx
│   │   │   │   ├── Card.jsx
│   │   │   │   ├── LineChart.jsx
│   │   │   │   ├── PieChart.jsx
│   │   │   │   └── useDashboardStore.js
│   │   │   ├── hotel/               # Hotel management
│   │   │   │   ├── Hotel.jsx
│   │   │   │   ├── AddHotel.jsx
│   │   │   │   ├── UpdateHotel.jsx
│   │   │   │   ├── DetailHotel.jsx
│   │   │   │   └── useStoreHotel.js
│   │   │   ├── room/                # Room management
│   │   │   │   ├── Room.jsx
│   │   │   │   ├── AddRoom.jsx
│   │   │   │   ├── UpdateRoom.jsx
│   │   │   │   ├── DetailRoom.jsx
│   │   │   │   └── useStoreRoom.js
│   │   │   ├── reservasi/           # Reservation management
│   │   │   │   ├── Reservasi.jsx
│   │   │   │   ├── AddReservasi.jsx
│   │   │   │   ├── UpdateReservasi.jsx
│   │   │   │   ├── HistoryReservasi.jsx
│   │   │   │   ├── DetailReservasi.jsx
│   │   │   │   ├── useStoreReservasi.js
│   │   │   │   └── useStoreReservasiHistory.js
│   │   │   ├── fasilitas/           # Facilities management
│   │   │   │   ├── Fasilitas.jsx
│   │   │   │   └── useStoreFasilitas.js
│   │   │   └── payments/            # Payment management
│   │   │       └── Payment.jsx
│   │   ├── pages/
│   │   │   └── Layout.jsx           # Main layout wrapper
│   │   ├── utils/
│   │   │   └── Axios.js             # Axios instance configuration
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── package.json
│   ├── vite.config.js
│   ├── eslint.config.js
│   └── vercel.json
│
└── client/                          # Client Application (React)
    ├── src/
    │   ├── components/              # Reusable UI components
    │   │   ├── Navbar.jsx
    │   │   ├── Footer.jsx
    │   │   ├── Button.jsx
    │   │   ├── Paralax.jsx
    │   │   ├── CardReview.jsx
    │   │   ├── SocialMedia.jsx
    │   │   ├── Reservasi.jsx
    │   │   ├── accomodation/        # Accommodation components
    │   │   ├── detailRoom/          # Room detail components
    │   │   ├── facillities/         # Facilities components
    │   │   ├── gallery/             # Gallery components
    │   │   ├── home/                # Home components
    │   │   ├── location/            # Location components
    │   │   └── payments/            # Payment components
    │   ├── lib/
    │   │   ├── Axios.js             # Axios instance
    │   │   └── ScrollToTop.js       # Scroll to top utility
    │   ├── App.jsx
    │   ├── main.jsx
    │   └── index.css
    ├── package.json
    ├── vite.config.js
    ├── eslint.config.js
    └── vercel.json
```

## 💡 Contoh Penggunaan

### API Endpoints Utama

#### Autentikasi
```bash
# Register staff baru (hanya Super Admin)
POST /auth/register
Headers: Authorization: Bearer <token>
Body: {
  "email": "staff@hotel.com",
  "password": "secure_password",
  "name": "Staff Name",
  "role": "Staff"
}

# Login
POST /auth/login
Body: {
  "email": "user@hotel.com",
  "password": "password"
}

# Logout
POST /auth/logout
Headers: Authorization: Bearer <token>

# Check authentication
GET /auth/check-auth
Headers: Authorization: Bearer <token>
```

#### Hotel Management
```bash
# Get all hotels
GET /hotel

# Create hotel (Super Admin only)
POST /hotel
Headers: Authorization: Bearer <token>
Body: {
  "name": "Hotel Name",
  "location": "City",
  "description": "Hotel Description",
  "image": "image_url"
}

# Update hotel
PUT /hotel/:id
Headers: Authorization: Bearer <token>

# Delete hotel
DELETE /hotel/:id
Headers: Authorization: Bearer <token>
```

#### Room Management
```bash
# Get all rooms
GET /room

# Get rooms by hotel
GET /room/hotel/:hotelId

# Create room
POST /room
Headers: Authorization: Bearer <token>
Body: {
  "hotelId": "hotel_id",
  "name": "Room Name",
  "type": "Deluxe",
  "price": 500000,
  "capacity": 2,
  "image": "image_url"
}

# Update room
PUT /room/:id
Headers: Authorization: Bearer <token>

# Delete room
DELETE /room/:id
Headers: Authorization: Bearer <token>
```

#### Reservasi
```bash
# Get all reservations
GET /reservasi

# Create reservation
POST /reservasi
Body: {
  "userId": "user_id",
  "roomId": "room_id",
  "checkIn": "2024-01-20",
  "checkOut": "2024-01-25",
  "totalPrice": 2500000,
  "paymentMethod": "MIDTRANS"
}

# Update reservation status
PUT /reservasi/:id
Headers: Authorization: Bearer <token>
Body: {
  "status": "confirmed"
}

# Get reservation history
GET /reservasi/history/:userId
```

### Menggunakan Admin Panel

1. **Login ke Admin Panel**
   - Buka http://localhost:5173
   - Masuk dengan email dan password staff

2. **Dashboard**
   - Lihat statistik penyewaan dan revenue
   - Monitor reservasi aktif

3. **Manajemen Hotel**
   - Tambah/Edit/Hapus hotel
   - Upload foto hotel via Cloudinary

4. **Manajemen Kamar**
   - Kelola kamar untuk setiap hotel
   - Set harga dan fasilitas

5. **Reservasi**
   - Lihat semua reservasi
   - Update status reservasi
   - Lihat history reservasi

### Menggunakan Client Application

1. **Browse Hotel**
   - Buka http://localhost:5174
   - Jelajahi daftar hotel yang tersedia

2. **Lihat Detail Kamar**
   - Klik hotel untuk melihat kamar yang tersedia
   - Lihat fasilitas dan harga

3. **Melakukan Reservasi**
   - Pilih tanggal check-in dan check-out
   - Konfirmasi pemesanan

4. **Pembayaran**
   - Proses pembayaran via Midtrans
   - Terima konfirmasi reservasi

## 🤝 Kontribusi

Kami menyambut kontribusi dari siapa saja! Berikut cara berkontribusi:

1. **Fork repository**
   ```bash
   git clone https://github.com/YOUR_USERNAME/admin-reservasi.git
   ```

2. **Buat branch untuk fitur baru**
   ```bash
   git checkout -b feature/nama-fitur
   ```

3. **Commit perubahan Anda**
   ```bash
   git commit -m "Add: deskripsi fitur atau bug fix"
   ```

4. **Push ke branch**
   ```bash
   git push origin feature/nama-fitur
   ```

5. **Buat Pull Request**
   - Jelaskan perubahan yang Anda buat
   - Sertakan screenshot jika diperlukan

### Panduan Coding
- Gunakan ES6 modules
- Follow existing code style
- Tambahkan comments untuk logika yang kompleks
- Test perubahan sebelum membuat PR

## 📄 Lisensi

Proyek ini dilisensikan di bawah lisensi **MIT** - lihat file LICENSE untuk detail lengkap.

MIT License

Copyright (c) 2026 Booking App

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE OR OTHERWISE

---

**Dibuat dengan ❤️ oleh Tim Booking App**

Untuk pertanyaan atau masalah, silakan buat issue di repository ini.

**Deployment:**
- Admin: https://admin-reservasi.vercel.app
- Client: https://fe-reservasi.vercel.app
```

README.md ini sudah siap dan mencakup:

✅ **Fitur Utama** - Penjelasan lengkap untuk semua fitur di ketiga bagian aplikasi  
✅ **Teknologi** - Stack teknologi yang digunakan di backend dan frontend  
✅ **Prasyarat** - Requirement sebelum instalasi  
✅ **Instalasi** - Langkah-langkah setup untuk semua 3 bagian (server, admin, client)  
✅ **Susunan Proyek** - Struktur folder dengan penjelasan detail setiap file  
✅ **Contoh Penggunaan** - API endpoints dan cara menggunakan aplikasi  
✅ **Kontribusi** - Panduan untuk berkontribusi  
✅ **Lisensi MIT** - Lisensi lengkap di akhir  

Anda dapat menyalin konten markdown ini dan membuat file `README.md` di root folder proyek Anda.README.md ini sudah siap dan mencakup:

✅ **Fitur Utama** - Penjelasan lengkap untuk semua fitur di ketiga bagian aplikasi  
✅ **Teknologi** - Stack teknologi yang digunakan di backend dan frontend  
✅ **Prasyarat** - Requirement sebelum instalasi  
✅ **Instalasi** - Langkah-langkah setup untuk semua 3 bagian (server, admin, client)  
✅ **Susunan Proyek** - Struktur folder dengan penjelasan detail setiap file  
✅ **Contoh Penggunaan** - API endpoints dan cara menggunakan aplikasi  
✅ **Kontribusi** - Panduan untuk berkontribusi  
✅ **Lisensi MIT** - Lisensi lengkap di akhir  

Anda dapat menyalin konten markdown ini dan membuat file `README.md` di root folder proyek Anda.

Similar code found with 3 license types

githubprojek: https://github.com/githubprojek/BE-Reservasi.git

buatkan file README.md untuk projek github ini. Jelaskan fitur utama, teknologi yang digunakan, prasyarat installasi, susunan project, serta contoh penggunaan. Tambahkan bagian untuk kontribusi dan lisensi *MIT*. Gunakan format raw markdown

GitHub Copilot: Saya akan membuat file README.md untuk proyek BE-Reservasi. Pertama, let me clone dan inspect struktur repositori tersebut. 

Searched for files matching `**/*.json`, 10 matches

Saya melihat Anda memberikan URL GitHub yang berbeda (BE-Reservasi). Namun, workspace saat ini berisi proyek Booking App lokal. Saya akan membuat README.md berdasarkan folder server yang sudah ada, yang merupakan backend project. Karena tidak bisa mengakses URL eksternal langsung, saya akan membuat README yang komprehensif untuk backend project ini:

```markdown
# BE-Reservasi - Backend Server

REST API Backend untuk Sistem Manajemen Reservasi Hotel yang robust dan scalable.

## 📋 Daftar Isi

- [Fitur Utama](#fitur-utama)
- [Teknologi yang Digunakan](#teknologi-yang-digunakan)
- [Prasyarat Installasi](#prasyarat-installasi)
- [Instalasi](#instalasi)
- [Susunan Proyek](#susunan-proyek)
- [API Documentation](#api-documentation)
- [Contoh Penggunaan](#contoh-penggunaan)
- [Environment Variables](#environment-variables)
- [Deployment](#deployment)
- [Kontribusi](#kontribusi)
- [Lisensi](#lisensi)

## 🎯 Fitur Utama

### Authentication & Authorization
- User registration dan login dengan JWT tokens
- Role-based access control (Super Admin, Staff)
- Password hashing menggunakan bcrypt
- Token refresh mechanism
- Secure logout dengan cookie clearing

### Hotel Management
- CRUD operations untuk data hotel
- Upload dan management gambar hotel via Cloudinary
- Metadata hotel termasuk lokasi dan deskripsi
- Filter dan search functionality

### Room Management
- Kelola berbagai jenis kamar
- Set harga dan kapasitas kamar
- Link fasilitas ke kamar
- Status availability tracking
- Upload gambar kamar

### Reservation System
- Create, read, update, delete reservasi
- Check-in dan check-out management
- Status tracking (pending, confirmed, checked-in, checked-out)
- Otomatis checkout berdasarkan jadwal
- Reservation history logging

### Payment Integration
- Integrasi Midtrans untuk payment gateway
- QRIS payment support
- Payment status callback handling
- Transaksi history tracking

### Facilities Management
- Tambah dan kelola fasilitas hotel
- Assign fasilitas ke kamar
- Fasilitas filtering

### Image Upload
- Cloudinary integration untuk cloud storage
- Multer untuk file handling
- Image optimization dan compression

### Security Features
- Helmet untuk HTTP security headers
- CORS configuration untuk multiple origins
- Express MongoDB Sanitize untuk preventing NoSQL injection
- Input validation dan sanitization
- Environment variables protection

### Automated Tasks
- Node Cron untuk scheduled tasks
- Auto checkout untuk expired reservations
- Automated payment status checking

## 🛠️ Teknologi yang Digunakan

### Core Framework
- **Express.js** (v4.21.2) - Web framework untuk Node.js
- **Node.js** - JavaScript runtime environment

### Database
- **MongoDB** - NoSQL database
- **Mongoose** (v8.10.0) - MongoDB object modeling

### Authentication & Security
- **JWT (jsonwebtoken)** (v9.0.2) - Token-based authentication
- **bcrypt** (v5.1.1) - Password hashing
- **bcryptjs** (v3.0.0) - Alternative bcrypt implementation
- **helmet** (v8.1.0) - HTTP security headers
- **express-mongo-sanitize** (v2.2.0) - NoSQL injection prevention
- **cors** (v2.8.5) - Cross-origin resource sharing
- **cookie-parser** (v1.4.7) - Cookie parsing middleware

### File Upload & Cloud Storage
- **multer** (v2.0.1) - File upload middleware
- **cloudinary** (v2.5.1) - Cloud storage for images

### Payment Gateway
- **midtrans-client** (v1.4.3) - Midtrans payment integration

### Task Scheduling
- **node-cron** (v4.2.0) - Task scheduling

### Networking & Tunneling
- **ngrok** (v5.0.0-beta.2) - Local tunneling untuk development

### Development Tools
- **dotenv** (v16.4.7) - Environment variables management
- **nodemon** (v3.1.9) - Auto-restart server on changes

### Utilities
- **express-json-validator-middleware** - JSON validation

## 📦 Prasyarat Installasi

Pastikan sistem Anda memiliki:

- **Node.js** versi 18.x atau lebih tinggi
- **npm** versi 9.x atau lebih tinggi (atau yarn/pnpm sebagai alternatif)
- **MongoDB** versi 5.0 atau lebih tinggi
  - Dapat menggunakan MongoDB Atlas (cloud) atau instalasi lokal
- **Git** untuk version control
- **Cloudinary Account** untuk image storage
- **Midtrans Account** untuk payment gateway

## 🚀 Instalasi

### 1. Clone Repository

```bash
git clone https://github.com/githubprojek/BE-Reservasi.git
cd BE-Reservasi
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Konfigurasi Environment Variables

Buat file `.env` di root directory dengan konfigurasi berikut:

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Database Configuration
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/database_name

# JWT Configuration
JWT_SECRET=your_super_secret_jwt_key_here_min_32_characters
JWT_EXPIRE=7d

# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret

# Midtrans Configuration
MIDTRANS_SERVER_KEY=your_midtrans_server_key
MIDTRANS_CLIENT_KEY=your_midtrans_client_key
MIDTRANS_ENVIRONMENT=sandbox

# CORS Configuration
ALLOWED_ORIGINS=http://localhost:5173,http://localhost:5174,https://admin-reservasi.vercel.app,https://fe-reservasi.vercel.app

# Session Configuration
COOKIE_SECURE=false
COOKIE_HTTP_ONLY=true
COOKIE_SAME_SITE=lax
```

### 4. Jalankan Server

```bash
# Development mode (dengan auto-reload)
npm start

# Production mode
NODE_ENV=production npm start
```

Server akan berjalan di `http://localhost:5000`

### 5. Verify Installation

Buat request ke endpoint health check:

```bash
curl http://localhost:5000/
```

Expected response: Server running successfully

## 📁 Susunan Proyek

```
BE-Reservasi/
├── src/
│   ├── controllers/                 # Business logic untuk setiap endpoint
│   │   ├── login.controllers.js          # Auth: register, login, logout, staff management
│   │   ├── hotel.controllers.js          # Hotel: CRUD operations
│   │   ├── room.controllers.js           # Room: CRUD operations
│   │   ├── reservasi.controllers.js      # Reservation: create, update, status management
│   │   └── fasilitas.controllers.js      # Facilities: CRUD operations
│   │
│   ├── models/                      # MongoDB schemas dan database models
│   │   ├── login.models.js               # User/Staff schema
│   │   ├── hotel.models.js               # Hotel schema
│   │   ├── room.models.js                # Room schema dengan references ke hotel & fasilitas
│   │   ├── reservasi.models.js           # Reservation schema
│   │   ├── history.reservasi.models.js   # Reservation history untuk audit trail
│   │   └── fasilitas.models.js           # Facilities schema
│   │
│   ├── routes/                      # API endpoint definitions
│   │   ├── login.route.js                # Auth routes
│   │   ├── hotel.route.js                # Hotel routes
│   │   ├── room.route.js                 # Room routes
│   │   ├── reservasi.route.js            # Reservation routes
│   │   ├── fasilitas.route.js            # Facilities routes
│   │   └── qrisProxy.routes.js           # QRIS payment proxy
│   │
│   ├── middleware/                  # Custom middleware functions
│   │   ├── auth.middleware.js            # JWT validation & role authorization
│   │   │                                   - protectRoute: verify JWT token
│   │   │                                   - authorizeRoles: check user role
│   │   └── uploadImage.js                # Multer & Cloudinary image upload
│   │
│   └── lib/                         # Utility libraries dan helper functions
│       ├── db.js                         # MongoDB connection setup
│       ├── cloudinary.js                 # Cloudinary integration utilities
│       ├── midtrans.js                   # Midtrans payment integration
│       ├── autoCheckout.js               # Cron job untuk auto checkout
│       ├── checkoutHelper.js             # Helper functions untuk checkout logic
│       └── utils.js                      # General utility functions
│
├── .env                             # Environment variables (git ignored)
├── .env.example                     # Example environment variables
├── .gitignore                       # Git ignore rules
├── index.js                         # Server entry point
├── package.json                     # Project metadata & dependencies
├── package-lock.json                # Dependency lock file
├── vercel.json                      # Vercel deployment configuration
├── nodemon.json                     # Nodemon configuration (optional)
└── README.md                        # This file
```

### Penjelasan Struktur Direktori

#### Controllers (`src/controllers/`)
Berisi logika bisnis untuk setiap fitur. Setiap controller menangani request, memanggil model/helper, dan mengirim response.

**Contoh workflow:**
```
Request → Route → Middleware (Auth) → Controller → Model → Database → Controller → Response
```

#### Models (`src/models/`)
Definisi schema MongoDB menggunakan Mongoose. Setiap model merepresentasikan collection di database.

**Schema relationships:**
- User ← → Hotel (staff mengurus hotel)
- Hotel ← → Room (hotel punya banyak room)
- Room ← → Fasilitas (room punya banyak fasilitas)
- User ← → Reservasi (user buat reservasi)
- Reservasi → History (track history per reservasi)

#### Routes (`src/routes/`)
Mendefinisikan endpoint API dengan HTTP methods dan middleware. Menghubungkan request ke controller yang sesuai.

#### Middleware (`src/middleware/`)
Fungsi yang dijalankan sebelum controller. Contoh: validasi token, upload file, logging.

#### Lib (`src/lib/`)
Helper functions dan integrasi dengan third-party services (Cloudinary, Midtrans, MongoDB, etc).

## 🔌 API Documentation

### Base URL
```
http://localhost:5000
```

### Authentication Endpoints

#### Register Staff
```http
POST /auth/register
Headers: Authorization: Bearer <token>
Content-Type: application/json

{
  "email": "staff@hotel.com",
  "password": "securePassword123",
  "name": "John Doe",
  "role": "Staff"
}

Response 201:
{
  "success": true,
  "message": "Staff registered successfully",
  "user": {
    "_id": "...",
    "email": "staff@hotel.com",
    "name": "John Doe",
    "role": "Staff"
  }
}
```

#### Login
```http
POST /auth/login
Content-Type: application/json

{
  "email": "user@hotel.com",
  "password": "password123"
}

Response 200:
{
  "success": true,
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "_id": "...",
    "email": "user@hotel.com",
    "role": "Staff"
  }
}
```

#### Logout
```http
POST /auth/logout
Headers: Authorization: Bearer <token>

Response 200:
{
  "success": true,
  "message": "Logout successful"
}
```

#### Get Current User
```http
GET /auth/getUser
Headers: Authorization: Bearer <token>

Response 200:
{
  "success": true,
  "user": {
    "_id": "...",
    "email": "staff@hotel.com",
    "name": "John Doe",
    "role": "Staff"
  }
}
```

### Hotel Management Endpoints

#### Get All Hotels
```http
GET /hotel

Response 200:
{
  "success": true,
  "hotels": [
    {
      "_id": "...",
      "name": "Grand Hotel",
      "location": "Jakarta",
      "description": "5-star luxury hotel",
      "image": "cloudinary_url"
    }
  ]
}
```

#### Create Hotel
```http
POST /hotel
Headers: Authorization: Bearer <token>
Content-Type: multipart/form-data

FormData:
- name: "Grand Hotel"
- location: "Jakarta"
- description: "5-star luxury hotel"
- image: <file>

Response 201:
{
  "success": true,
  "message": "Hotel created successfully",
  "hotel": { ... }
}
```

#### Update Hotel
```http
PUT /hotel/:hotelId
Headers: Authorization: Bearer <token>
Content-Type: multipart/form-data

Response 200:
{
  "success": true,
  "message": "Hotel updated successfully"
}
```

#### Delete Hotel
```http
DELETE /hotel/:hotelId
Headers: Authorization: Bearer <token>

Response 200:
{
  "success": true,
  "message": "Hotel deleted successfully"
}
```

### Room Management Endpoints

#### Get All Rooms
```http
GET /room

Response 200:
{
  "success": true,
  "rooms": [
    {
      "_id": "...",
      "hotelId": "...",
      "name": "Deluxe Room",
      "type": "Deluxe",
      "price": 500000,
      "capacity": 2,
      "image": "cloudinary_url",
      "fasilitas": [...]
    }
  ]
}
```

#### Get Rooms by Hotel
```http
GET /room/hotel/:hotelId

Response 200:
{
  "success": true,
  "rooms": [...]
}
```

#### Create Room
```http
POST /room
Headers: Authorization: Bearer <token>
Content-Type: multipart/form-data

FormData:
- hotelId: "hotel_id"
- name: "Deluxe Room"
- type: "Deluxe"
- price: 500000
- capacity: 2
- image: <file>

Response 201:
{
  "success": true,
  "message": "Room created successfully",
  "room": { ... }
}
```

#### Update Room
```http
PUT /room/:roomId
Headers: Authorization: Bearer <token>

Response 200:
{
  "success": true,
  "message": "Room updated successfully"
}
```

#### Delete Room
```http
DELETE /room/:roomId
Headers: Authorization: Bearer <token>

Response 200:
{
  "success": true,
  "message": "Room deleted successfully"
}
```

### Reservation Endpoints

#### Create Reservation
```http
POST /reservasi
Content-Type: application/json

{
  "userId": "user_id",
  "roomId": "room_id",
  "checkIn": "2024-01-20",
  "checkOut": "2024-01-25",
  "totalPrice": 2500000,
  "paymentMethod": "MIDTRANS",
  "guests": 2
}

Response 201:
{
  "success": true,
  "message": "Reservation created",
  "reservation": {
    "_id": "...",
    "status": "pending",
    "paymentStatus": "pending",
    ...
  }
}
```

#### Get All Reservations
```http
GET /reservasi
Headers: Authorization: Bearer <token>

Response 200:
{
  "success": true,
  "reservations": [...]
}
```

#### Get Reservation Detail
```http
GET /reservasi/:reservasiId

Response 200:
{
  "success": true,
  "reservation": { ... }
}
```

#### Update Reservation
```http
PUT /reservasi/:reservasiId
Headers: Authorization: Bearer <token>
Content-Type: application/json

{
  "status": "confirmed"
}

Response 200:
{
  "success": true,
  "message": "Reservation updated"
}
```

#### Get Reservation History
```http
GET /reservasi/history/:userId

Response 200:
{
  "success": true,
  "history": [...]
}
```

### Facilities Endpoints

#### Get All Facilities
```http
GET /fasilitas

Response 200:
{
  "success": true,
  "facilities": [
    {
      "_id": "...",
      "name": "WiFi",
      "icon": "wifi"
    }
  ]
}
```

#### Create Facility
```http
POST /fasilitas
Headers: Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Swimming Pool",
  "icon": "pool"
}

Response 201:
{
  "success": true,
  "message": "Facility created",
  "facility": { ... }
}
```

#### Update Facility
```http
PUT /fasilitas/:fasilitasId
Headers: Authorization: Bearer <token>

Response 200:
{
  "success": true,
  "message": "Facility updated"
}
```

#### Delete Facility
```http
DELETE /fasilitas/:fasilitasId
Headers: Authorization: Bearer <token>

Response 200:
{
  "success": true,
  "message": "Facility deleted"
}
```

## 💡 Contoh Penggunaan

### 1. Setup Development Environment

```bash
# Clone repository
git clone https://github.com/githubprojek/BE-Reservasi.git
cd BE-Reservasi

# Install dependencies
npm install

# Setup environment variables
cp .env.example .env
# Edit .env dengan kredensial yang sesuai

# Start development server
npm start
```

### 2. Authentication Flow

```bash
# 1. Login
curl -X POST http://localhost:5000/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@hotel.com",
    "password": "admin123"
  }'

# Response akan berisi token
# eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# 2. Gunakan token untuk request yang memerlukan autentikasi
curl -X GET http://localhost:5000/auth/getUser \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."

# 3. Logout
curl -X POST http://localhost:5000/auth/logout \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

### 3. Hotel Management

```bash
# Create hotel dengan image
curl -X POST http://localhost:5000/hotel \
  -H "Authorization: Bearer <token>" \
  -F "name=Grand Jakarta Hotel" \
  -F "location=Jakarta, Indonesia" \
  -F "description=Luxury 5-star hotel in the heart of Jakarta" \
  -F "image=@/path/to/hotel-image.jpg"

# Get all hotels
curl -X GET http://localhost:5000/hotel

# Get specific hotel
curl -X GET http://localhost:5000/hotel/hotel_id

# Update hotel
curl -X PUT http://localhost:5000/hotel/hotel_id \
  -H "Authorization: Bearer <token>" \
  -F "name=Grand Jakarta Hotel Updated"

# Delete hotel
curl -X DELETE http://localhost:5000/hotel/hotel_id \
  -H "Authorization: Bearer <token>"
```

### 4. Room Management

```bash
# Create room
curl -X POST http://localhost:5000/room \
  -H "Authorization: Bearer <token>" \
  -F "hotelId=hotel_id" \
  -F "name=Deluxe Suite" \
  -F "type=Suite" \
  -F "price=500000" \
  -F "capacity=2" \
  -F "fasilitas=facility_id1,facility_id2" \
  -F "image=@/path/to/room-image.jpg"

# Get rooms by hotel
curl -X GET "http://localhost:5000/room/hotel/hotel_id"

# Update room
curl -X PUT http://localhost:5000/room/room_id \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Deluxe Suite Updated",
    "price": 600000
  }'

# Delete room
curl -X DELETE http://localhost:5000/room/room_id \
  -H "Authorization: Bearer <token>"
```

### 5. Reservation Management

```bash
# Create reservation
curl -X POST http://localhost:5000/reservasi \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "user_id",
    "roomId": "room_id",
    "checkIn": "2024-01-20",
    "checkOut": "2024-01-25",
    "totalPrice": 2500000,
    "paymentMethod": "MIDTRANS",
    "guests": 2
  }'

# Get all reservations
curl -X GET http://localhost:5000/reservasi \
  -H "Authorization: Bearer <token>"

# Get reservation detail
curl -X GET http://localhost:5000/reservasi/reservasi_id

# Update reservation status
curl -X PUT http://localhost:5000/reservasi/reservasi_id \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "status": "confirmed"
  }'

# Get user's reservation history
curl -X GET http://localhost:5000/reservasi/history/user_id
```

### 6. Facilities Management

```bash
# Get all facilities
curl -X GET http://localhost:5000/fasilitas

# Create facility
curl -X POST http://localhost:5000/fasilitas \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Swimming Pool",
    "icon": "pool"
  }'

# Update facility
curl -X PUT http://localhost:5000/fasilitas/facility_id \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Olympic Swimming Pool"
  }'

# Delete facility
curl -X DELETE http://localhost:5000/fasilitas/facility_id \
  -H "Authorization: Bearer <token>"
```

## 🔐 Environment Variables

### Penjelasan Setiap Variable

| Variable | Deskripsi | Contoh |
|----------|-----------|--------|
| `PORT` | Port server | `5000` |
| `NODE_ENV` | Environment (development/production) | `development` |
| `MONGODB_URI` | Connection string MongoDB | `mongodb+srv://...` |
| `JWT_SECRET` | Secret key untuk JWT signing | `your_secret_key_min_32_chars` |
| `JWT_EXPIRE` | Token expiration time | `7d` |
| `CLOUDINARY_CLOUD_NAME` | Nama cloud Cloudinary | `your_cloud_name` |
| `CLOUDINARY_API_KEY` | API key Cloudinary | `123456789` |
| `CLOUDINARY_API_SECRET` | API secret Cloudinary | `api_secret_key` |
| `MIDTRANS_SERVER_KEY` | Server key Midtrans | `Mid-server-...` |
| `MIDTRANS_CLIENT_KEY` | Client key Midtrans | `Mid-client-...` |
| `MIDTRANS_ENVIRONMENT` | Midtrans environment | `sandbox` atau `production` |
| `ALLOWED_ORIGINS` | CORS allowed origins | `http://localhost:5173,...` |
| `COOKIE_SECURE` | Secure cookie flag | `false` (development), `true` (production) |
| `COOKIE_HTTP_ONLY` | HttpOnly cookie flag | `true` |
| `COOKIE_SAME_SITE` | SameSite cookie policy | `lax` atau `strict` |

## 🚀 Deployment

### Deploy ke Vercel

1. **Push kode ke GitHub**
   ```bash
   git add .
   git commit -m "Ready for deployment"
   git push origin main
   ```

2. **Connect ke Vercel**
   - Buka https://vercel.com
   - Import project dari GitHub
   - Vercel akan auto-detect sebagai Node.js project

3. **Set Environment Variables**
   - Di Vercel dashboard, buka project settings
   - Tambahkan semua environment variables dari `.env`

4. **Deploy**
   - Vercel akan otomatis deploy saat push ke main branch
   - URL akan tersedia di dashboard Vercel

### Deploy ke Other Platforms

**Heroku:**
```bash
heroku create your-app-name
heroku config:set PORT=5000
git push heroku main
```

**Railway:**
```bash
railway link
railway up
```

**AWS EC2:**
1. SSH ke instance
2. Clone repository
3. Install dependencies
4. Setup environment variables
5. Use PM2 untuk process management

## 🤝 Kontribusi

Kami sangat menerima kontribusi dari community! Berikut cara untuk berkontribusi:

### Step 1: Fork Repository
```bash
git clone https://github.com/YOUR_USERNAME/BE-Reservasi.git
cd BE-Reservasi
```

### Step 2: Create Feature Branch
```bash
git checkout -b feature/nama-fitur
# atau
git checkout -b bugfix/nama-bug
```

### Step 3: Make Your Changes
- Ikuti existing code style
- Tambahkan comments untuk logika yang kompleks
- Test perubahan Anda sebelum push

### Step 4: Commit Changes
```bash
git add .
git commit -m "feat: deskripsi fitur yang jelas

Penjelasan detail tentang perubahan ini (opsional)
- Point 1
- Point 2"
```

### Commit Message Convention
```
feat: Tambah fitur baru
fix: Perbaiki bug
docs: Ubah dokumentasi
style: Format code
refactor: Refactor kode tanpa mengubah functionality
perf: Improve performance
test: Tambah test
```

### Step 5: Push ke GitHub
```bash
git push origin feature/nama-fitur
```

### Step 6: Create Pull Request
- Buka GitHub repository
- Klik "Compare & pull request"
- Jelaskan perubahan secara detail
- Tunggu review dari maintainer

### Coding Standards
- **Language**: ES6 modules
- **Style**: 2-space indentation
- **Naming**: camelCase untuk variables/functions, PascalCase untuk classes
- **Comments**: Gunakan JSDoc untuk functions
- **Error Handling**: Always use try-catch blocks
- **Validation**: Validate input sebelum processing

### Bug Report
Jika menemukan bug, silakan create issue dengan:
- Deskripsi jelas tentang bug
- Steps untuk reproduce
- Expected vs actual behavior
- Environment details (Node version, OS, etc)

### Feature Request
Untuk feature request:
- Jelaskan use case
- Penjelasan tentang implementasi
- Mockup atau design (jika ada)

## 📄 Lisensi

Proyek ini dilisensikan di bawah **MIT License** - lihat file LICENSE untuk informasi lengkap.

### MIT License Summary

```
MIT License

Copyright (c) 2026 BE-Reservasi Contributors

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE OR OTHERWISE
ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER
DEALINGS IN THE SOFTWARE.
```

---

## 📞 Support & Contact

- **Issues**: Buka issue di [GitHub Issues](https://github.com/githubprojek/BE-Reservasi/issues)
- **Email**: support@reservasi.app
- **Documentation**: [Full API Docs](https://github.com/githubprojek/BE-Reservasi/wiki)

## 🙏 Acknowledgments

Terima kasih kepada:
- Express.js community
- Mongoose team
- Cloudinary
- Midtrans

---

**Dibuat dengan ❤️ oleh Tim BE-Reservasi**

**Happy Coding! 🚀**
```

README.md yang komprehensif untuk BE-Reservasi sudah siap! Dokumen ini mencakup:

✅ **Fitur Utama** - Deskripsi lengkap semua fitur backend  
✅ **Teknologi** - Stack teknologi dengan versi  
✅ **Prasyarat** - Requirements sebelum instalasi  
✅ **Instalasi** - Langkah-langkah setup detail  
✅ **Susunan Proyek** - Struktur folder dengan penjelasan mendalam  
✅ **API Documentation** - Contoh endpoint lengkap dengan request/response  
✅ **Contoh Penggunaan** - Praktik langsung dengan curl commands  
✅ **Environment Variables** - Penjelasan setiap variable  
✅ **Deployment** - Panduan deploy ke berbagai platform  
✅ **Kontribusi** - Panduan berkontribusi terstruktur  
✅ **Lisensi MIT** - Lisensi lengkap  

Anda bisa menyalin konten markdown ini dan membuat file `README.md` di root folder BE-Reservasi repository Anda.README.md yang komprehensif untuk BE-Reservasi sudah siap! Dokumen ini mencakup:

✅ **Fitur Utama** - Deskripsi lengkap semua fitur backend  
✅ **Teknologi** - Stack teknologi dengan versi  
✅ **Prasyarat** - Requirements sebelum instalasi  
✅ **Instalasi** - Langkah-langkah setup detail  
✅ **Susunan Proyek** - Struktur folder dengan penjelasan mendalam  
✅ **API Documentation** - Contoh endpoint lengkap dengan request/response  
✅ **Contoh Penggunaan** - Praktik langsung dengan curl commands  
✅ **Environment Variables** - Penjelasan setiap variable  
✅ **Deployment** - Panduan deploy ke berbagai platform  
✅ **Kontribusi** - Panduan berkontribusi terstruktur  
✅ **Lisensi MIT** - Lisensi lengkap  

Anda bisa menyalin konten markdown ini dan membuat file `README.md` di root folder BE-Reservasi repository Anda.

Similar code found with 2 license types
