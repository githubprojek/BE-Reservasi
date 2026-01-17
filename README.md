# Hotel Booking System - Server

Server backend untuk aplikasi sistem manajemen reservasi hotel yang komprehensif. Dibangun dengan Node.js dan Express, menyediakan REST API untuk mengelola hotel, kamar, reservasi, pembayaran, dan autentikasi pengguna.

---

## 📋 Daftar Isi

- [Fitur Utama](#fitur-utama)
- [Teknologi yang Digunakan](#teknologi-yang-digunakan)
- [Prasyarat Installasi](#prasyarat-installasi)
- [Cara Installasi](#cara-installasi)
- [Konfigurasi Environment](#konfigurasi-environment)
- [Struktur Proyek](#struktur-proyek)
- [API Endpoints](#api-endpoints)
- [Contoh Penggunaan](#contoh-penggunaan)
- [Fitur Khusus](#fitur-khusus)
- [Keamanan](#keamanan)

---

## 🎯 Fitur Utama

### 1. **Manajemen Hotel**
- CRUD (Create, Read, Update, Delete) hotel
- Upload gambar hotel ke Cloudinary
- Daftar hotel dengan informasi lengkap

### 2. **Manajemen Kamar**
- CRUD kamar hotel
- Kategori dan tipe kamar yang berbeda
- Informasi kapasitas dan fasilitas kamar

### 3. **Sistem Reservasi**
- Membuat reservasi baru
- Update data reservasi
- Menghapus reservasi
- Riwayat reservasi tamu
- Check-in dan check-out otomatis/manual

### 4. **Sistem Pembayaran**
- Integrasi Midtrans untuk pembayaran
- Payment Gateway API
- QR Code dan Core API payment method
- Cek status pembayaran real-time
- Pembayaran otomatis untuk reservasi expired

### 5. **Manajemen Fasilitas**
- CRUD fasilitas hotel
- Asosiasi fasilitas dengan kamar

### 6. **Sistem Autentikasi & Autorisasi**
- Login dengan JWT token
- Role-based access control (Admin, Super Admin)
- Password encryption dengan bcrypt
- Proteksi endpoint berdasarkan role

### 7. **Fitur Otomatis**
- Auto checkout untuk reservasi yang expired
- Scheduled tasks menggunakan node-cron
- Sanitasi data MongoDB untuk security

---

## 🛠️ Teknologi yang Digunakan

### Core Framework
- **Express.js** (v4.21.2) - Web framework untuk Node.js
- **Node.js** - Runtime environment

### Database
- **MongoDB** - Database NoSQL
- **Mongoose** (v8.10.0) - ODM untuk MongoDB

### Autentikasi & Keamanan
- **JWT (jsonwebtoken)** (v9.0.2) - Token-based authentication
- **bcrypt** (v5.1.1) & **bcryptjs** (v3.0.0) - Password hashing
- **Helmet.js** (v8.1.0) - HTTP header security
- **express-mongo-sanitize** (v2.2.0) - Data sanitasi
- **cookie-parser** (v1.4.7) - Cookie parsing

### Media Upload
- **Cloudinary** (v2.5.1) - Cloud storage untuk gambar
- **Multer** (v2.0.1) - File upload middleware

### Payment Gateway
- **Midtrans-client** (v1.4.3) - Payment gateway integration
- **QR Code Proxy** - QRIS payment method

### Utility
- **dotenv** (v16.4.7) - Environment variable management
- **CORS** (v2.8.5) - Cross-Origin Resource Sharing
- **node-cron** (v4.2.0) - Scheduled tasks
- **ngrok** (v5.0.0-beta.2) - Webhook tunneling

### Development
- **Nodemon** (v3.1.9) - Auto-reload development server

---

## 📦 Prasyarat Installasi

Sebelum menginstall, pastikan Anda sudah memiliki:

1. **Node.js** (v16.0 atau lebih tinggi)
   - Download dari [nodejs.org](https://nodejs.org)
   - Cek versi: `node --version`

2. **npm** (v7.0 atau lebih tinggi)
   - Biasanya sudah terinstall bersama Node.js
   - Cek versi: `npm --version`

3. **MongoDB Account**
   - Daftar di [mongodb.com](https://www.mongodb.com)
   - Buat cluster dan dapatkan connection string

4. **Cloudinary Account** (untuk upload gambar)
   - Daftar di [cloudinary.com](https://cloudinary.com)
   - Dapatkan Cloud Name, API Key, dan API Secret

5. **Midtrans Account** (untuk payment)
   - Daftar di [midtrans.com](https://midtrans.com)
   - Dapatkan Client Key dan Server Key

6. **Git** (untuk cloning repository)
   - Download dari [git-scm.com](https://git-scm.com)

---

## 🚀 Cara Installasi

### Step 1: Clone Repository
```bash
git clone <repository-url>
cd "Booking App/server"
```

### Step 2: Install Dependencies
```bash
npm install
```

Perintah ini akan menginstall semua package yang diperlukan berdasarkan file `package.json`.

### Step 3: Setup Environment Variables
Buat file `.env` di root folder server dan tambahkan konfigurasi:

```env
# Database
MONGODB_URI=mongodb+srv://username:password@cluster0.xxx.mongodb.net/?retryWrites=true&w=majority

# Server
PORT=5000
NODE_ENV=development

# JWT Secret
JWT_SECRET=your_secret_key_here

# Cloudinary
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Midtrans
MIDTRANS_CLIENT_KEY=your_client_key
MIDTRANS_SERVER_KEY=your_server_key
```

### Step 4: Jalankan Server
```bash
npm start
```

Server akan berjalan di `http://localhost:5000`

Anda akan melihat output:
```
Server running on port 5000
Connected to MongoDB
Auto checkout started
```

---

## ⚙️ Konfigurasi Environment

### MONGODB_URI
- Koneksi string ke MongoDB Atlas
- Format: `mongodb+srv://username:password@cluster.region.mongodb.net/database`
- Dapatkan dari MongoDB Atlas dashboard

### JWT_SECRET
- Secret key untuk signing JWT tokens
- Gunakan string yang random dan panjang
- Contoh: `your_random_secret_key_12345`

### CLOUDINARY
- **CLOUDINARY_CLOUD_NAME**: Nama cloud Anda di Cloudinary
- **CLOUDINARY_API_KEY**: API key dari Cloudinary
- **CLOUDINARY_API_SECRET**: API secret dari Cloudinary

### MIDTRANS
- **MIDTRANS_CLIENT_KEY**: Client key dari Midtrans (public)
- **MIDTRANS_SERVER_KEY**: Server key dari Midtrans (private)

### CORS Configuration
Endpoints yang diizinkan dalam `index.js`:
- `http://localhost:5173` (Vite dev server client)
- `http://localhost:5174` (Vite dev server admin)
- `https://admin-reservasi.vercel.app` (Production admin)
- `https://fe-reservasi.vercel.app` (Production client)

---

## 📁 Struktur Proyek

```
server/
├── src/
│   ├── controllers/          # Business logic untuk setiap resource
│   │   ├── fasilitas.controllers.js
│   │   ├── hotel.controllers.js
│   │   ├── login.controllers.js
│   │   ├── reservasi.controllers.js
│   │   └── room.controllers.js
│   │
│   ├── models/               # Mongoose schemas
│   │   ├── fasilitas.models.js
│   │   ├── history.reservasi.models.js
│   │   ├── hotel.models.js
│   │   ├── login.models.js
│   │   ├── reservasi.models.js
│   │   └── room.models.js
│   │
│   ├── routes/               # Express routes/endpoints
│   │   ├── fasilitas.route.js
│   │   ├── hotel.route.js
│   │   ├── login.route.js
│   │   ├── reservasi.route.js
│   │   ├── room.route.js
│   │   └── qrisProxy.routes.js
│   │
│   ├── middleware/           # Custom middleware
│   │   ├── auth.middleware.js     # JWT & role authorization
│   │   └── uploadImage.js         # File upload handling
│   │
│   └── lib/                  # Utility functions
│       ├── autoCheckout.js        # Auto checkout scheduler
│       ├── checkoutHelper.js      # Checkout logic
│       ├── cloudinary.js          # Cloudinary setup
│       ├── db.js                  # MongoDB connection
│       ├── midtrans.js            # Midtrans payment logic
│       └── utils.js               # Helper functions
│
├── index.js                  # Entry point aplikasi
├── package.json              # Dependencies
├── .env                       # Environment variables
└── vercel.json              # Vercel deployment config
```

---

## 🔗 API Endpoints

### 🔐 Authentication Routes (`/auth`)

| Method | Endpoint | Deskripsi | Protected | Role |
|--------|----------|-----------|-----------|------|
| POST | `/auth/register` | Register staff/admin baru | ✗ | - |
| POST | `/auth/login` | Login user | ✗ | - |
| POST | `/auth/logout` | Logout user | ✓ | - |
| GET | `/auth/profile` | Get profile user | ✓ | - |
| PUT | `/auth/updateProfile` | Update profile user | ✓ | - |
| GET | `/auth/getStaff` | Dapatkan list staff | ✓ | Super Admin |
| DELETE | `/auth/deleteStaff/:id` | Hapus staff | ✓ | Super Admin |

### 🏨 Hotel Routes (`/hotel`)

| Method | Endpoint | Deskripsi | Protected | Role |
|--------|----------|-----------|-----------|------|
| POST | `/hotel/createHotel` | Buat hotel baru | ✓ | Super Admin |
| GET | `/hotel/getHotel` | Dapatkan list hotel | ✗ | - |
| GET | `/hotel/getHotelById/:hotelId` | Dapatkan detail hotel | ✓ | - |
| PUT | `/hotel/updateHotel/:hotelId` | Update hotel | ✓ | Super Admin |
| DELETE | `/hotel/deleteHotel/:hotelId` | Hapus hotel | ✓ | Super Admin |

### 🛏️ Room Routes (`/room`)

| Method | Endpoint | Deskripsi | Protected | Role |
|--------|----------|-----------|-----------|------|
| POST | `/room/createRoom` | Buat kamar baru | ✓ | Super Admin |
| GET | `/room/getRoom` | Dapatkan list kamar | ✗ | - |
| GET | `/room/getRoomById/:roomId` | Dapatkan detail kamar | ✓ | - |
| PUT | `/room/updateRoom/:roomId` | Update kamar | ✓ | Super Admin |
| DELETE | `/room/deleteRoom/:roomId` | Hapus kamar | ✓ | Super Admin |

### 📅 Reservasi Routes (`/reservasi`)

| Method | Endpoint | Deskripsi | Protected | Role |
|--------|----------|-----------|-----------|------|
| POST | `/reservasi/createReservasi` | Buat reservasi baru | ✗ | - |
| GET | `/reservasi/getReservasi` | Dapatkan list reservasi | ✓ | Admin |
| GET | `/reservasi/getReservasiById/:reservasiId` | Dapatkan detail reservasi | ✓ | Admin |
| PUT | `/reservasi/updateReservasi/:reservasiId` | Update reservasi | ✓ | Admin |
| DELETE | `/reservasi/deleteReservasi/:reservasiId` | Hapus reservasi | ✓ | Admin |
| POST | `/reservasi/checkin/:reservasiId` | Check-in manual | ✓ | Admin |
| POST | `/reservasi/checkout/:reservasiId` | Check-out manual | ✓ | Admin |
| POST | `/reservasi/manualCheckout/:reservasiId` | Manual checkout tertentu | ✓ | Admin |
| GET | `/reservasi/getCheckout` | Riwayat checkout/history | ✓ | Admin |

### 💳 Payment Routes (`/reservasi`)

| Method | Endpoint | Deskripsi | Protected |
|--------|----------|-----------|-----------|
| POST | `/reservasi/createMidtransTransaction/:reservasiId` | Buat transaksi Midtrans | ✗ |
| POST | `/reservasi/core-payment/:reservasiId` | Pembayaran Core API | ✗ |
| GET | `/reservasi/cek-status-pembayaran/:reservasiId` | Cek status pembayaran | ✗ |
| POST | `/reservasi/cancelled/:reservasiId` | Cancel reservasi | ✗ |

### 🏢 Fasilitas Routes (`/fasilitas`)

| Method | Endpoint | Deskripsi | Protected | Role |
|--------|----------|-----------|-----------|------|
| POST | `/fasilitas/createFasilitas` | Buat fasilitas baru | ✓ | Super Admin |
| GET | `/fasilitas/getFasilitas` | Dapatkan list fasilitas | ✗ | - |
| GET | `/fasilitas/getFasilitasById/:fasilitasId` | Dapatkan detail fasilitas | ✓ | - |
| PUT | `/fasilitas/updateFasilitas/:fasilitasId` | Update fasilitas | ✓ | Super Admin |
| DELETE | `/fasilitas/deleteFasilitas/:fasilitasId` | Hapus fasilitas | ✓ | Super Admin |

### 🔌 Proxy Routes (`/proxy`)

| Method | Endpoint | Deskripsi |
|--------|----------|-----------|
| POST | `/proxy/qris` | QRIS payment proxy |

---

## 💡 Contoh Penggunaan

### 1. Register Pengguna Baru

**Request:**
```bash
curl -X POST http://localhost:5000/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "fullName": "John Doe",
    "email": "john@example.com",
    "notelp": "082123456789",
    "password": "password123",
    "role": "Admin"
  }'
```

**Response (Success - 201):**
```json
{
  "message": "Register berhasil",
  "data": {
    "_id": "60d5ec49c1234567890abc",
    "fullName": "John Doe",
    "email": "john@example.com",
    "notelp": "082123456789",
    "role": "Admin",
    "createdAt": "2024-01-17T10:30:00Z"
  }
}
```

### 2. Login

**Request:**
```bash
curl -X POST http://localhost:5000/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "password123"
  }'
```

**Response (Success - 200):**
```json
{
  "message": "Login successful",
  "data": {
    "_id": "60d5ec49c1234567890abc",
    "fullName": "John Doe",
    "email": "john@example.com",
    "role": "Admin"
  }
}
```

Cookie dengan JWT token akan di-set secara otomatis.

### 3. Membuat Hotel Baru

**Request:**
```bash
curl -X POST http://localhost:5000/hotel/createHotel \
  -H "Content-Type: application/json" \
  -H "Cookie: jwt=<your_jwt_token>" \
  -F "namaHotel=Hotel Premium" \
  -F "lokasi=Jakarta" \
  -F "deskripsi=Hotel bintang lima" \
  -F "image_hotel=@/path/to/image.jpg"
```

**Response (Success - 201):**
```json
{
  "message": "Hotel created successfully",
  "data": {
    "_id": "60d5ec49c1234567890def",
    "namaHotel": "Hotel Premium",
    "lokasi": "Jakarta",
    "deskripsi": "Hotel bintang lima",
    "imageHotel": [
      "https://res.cloudinary.com/.../image.jpg"
    ],
    "createdAt": "2024-01-17T10:35:00Z"
  }
}
```

### 4. Membuat Kamar Baru

**Request:**
```bash
curl -X POST http://localhost:5000/room/createRoom \
  -H "Content-Type: application/json" \
  -H "Cookie: jwt=<your_jwt_token>" \
  -d '{
    "hotel": "60d5ec49c1234567890def",
    "nomorKamar": "101",
    "tipeKamar": "Deluxe",
    "harga": 500000,
    "kapasitas": 2,
    "fasilitas": ["60d5ec49c1234567890ghi", "60d5ec49c1234567890jkl"]
  }'
```

**Response (Success - 201):**
```json
{
  "message": "Room created successfully",
  "data": {
    "_id": "60d5ec49c1234567890mno",
    "hotel": "60d5ec49c1234567890def",
    "nomorKamar": "101",
    "tipeKamar": "Deluxe",
    "harga": 500000,
    "kapasitas": 2,
    "fasilitas": ["60d5ec49c1234567890ghi", "60d5ec49c1234567890jkl"],
    "createdAt": "2024-01-17T10:40:00Z"
  }
}
```

### 5. Membuat Reservasi

**Request:**
```bash
curl -X POST http://localhost:5000/reservasi/createReservasi \
  -H "Content-Type: application/json" \
  -d '{
    "guestName": "Jane Smith",
    "guestEmail": "jane@example.com",
    "guestPhone": "081234567890",
    "hotel": "60d5ec49c1234567890def",
    "room": "60d5ec49c1234567890mno",
    "jumlahTamu": 2,
    "jumlahKamar": 1,
    "checkIn": "2024-02-01T14:00:00Z",
    "checkOut": "2024-02-03T11:00:00Z",
    "hargaTotal": 1000000
  }'
```

**Response (Success - 201):**
```json
{
  "message": "Reservasi created successfully",
  "data": {
    "_id": "60d5ec49c1234567890pqr",
    "guestName": "Jane Smith",
    "guestEmail": "jane@example.com",
    "guestPhone": "081234567890",
    "hotel": "60d5ec49c1234567890def",
    "room": "60d5ec49c1234567890mno",
    "jumlahTamu": 2,
    "jumlahKamar": 1,
    "checkIn": "2024-02-01T14:00:00Z",
    "checkOut": "2024-02-03T11:00:00Z",
    "hargaTotal": 1000000,
    "statusPembayaran": "Pending",
    "createdAt": "2024-01-17T11:00:00Z"
  }
}
```

### 6. Membuat Transaksi Pembayaran dengan Midtrans

**Request:**
```bash
curl -X POST http://localhost:5000/reservasi/createMidtransTransaction/60d5ec49c1234567890pqr \
  -H "Content-Type: application/json" \
  -d '{}'
```

**Response (Success - 200):**
```json
{
  "message": "Transaksi Midtrans berhasil dibuat",
  "data": {
    "token": "b0123abc456def7890ghi",
    "redirect_url": "https://app.sandbox.midtrans.com/snap/v4/redirection/b0123abc456def7890ghi",
    "reservasiId": "60d5ec49c1234567890pqr"
  }
}
```

### 7. Cek Status Pembayaran

**Request:**
```bash
curl -X GET "http://localhost:5000/reservasi/cek-status-pembayaran/60d5ec49c1234567890pqr" \
  -H "Content-Type: application/json"
```

**Response (Success - 200):**
```json
{
  "message": "Status pembayaran berhasil diambil",
  "status": "settlement",
  "amount": 1000000,
  "transactionTime": "2024-01-17T11:30:00Z"
}
```

### 8. Check-in Reservasi

**Request:**
```bash
curl -X POST http://localhost:5000/reservasi/checkin/60d5ec49c1234567890pqr \
  -H "Content-Type: application/json" \
  -H "Cookie: jwt=<your_jwt_token>" \
  -d '{
    "waktuCheckin": "2024-02-01T14:30:00Z"
  }'
```

**Response (Success - 200):**
```json
{
  "message": "Check-in berhasil",
  "data": {
    "_id": "60d5ec49c1234567890pqr",
    "guestName": "Jane Smith",
    "statusReservasi": "Check-in",
    "waktuCheckin": "2024-02-01T14:30:00Z"
  }
}
```

### 9. Check-out Reservasi

**Request:**
```bash
curl -X POST http://localhost:5000/reservasi/checkout/60d5ec49c1234567890pqr \
  -H "Content-Type: application/json" \
  -H "Cookie: jwt=<your_jwt_token>" \
  -d '{
    "waktuCheckout": "2024-02-03T10:45:00Z"
  }'
```

**Response (Success - 200):**
```json
{
  "message": "Check-out berhasil",
  "data": {
    "_id": "60d5ec49c1234567890pqr",
    "guestName": "Jane Smith",
    "statusReservasi": "Check-out",
    "waktuCheckout": "2024-02-03T10:45:00Z"
  }
}
```

### 10. Mendapatkan List Kamar

**Request:**
```bash
curl -X GET http://localhost:5000/room/getRoom \
  -H "Content-Type: application/json"
```

**Response (Success - 200):**
```json
{
  "message": "Rooms retrieved successfully",
  "data": [
    {
      "_id": "60d5ec49c1234567890mno",
      "nomorKamar": "101",
      "tipeKamar": "Deluxe",
      "harga": 500000,
      "kapasitas": 2,
      "hotel": {
        "_id": "60d5ec49c1234567890def",
        "namaHotel": "Hotel Premium"
      },
      "fasilitas": [
        {
          "_id": "60d5ec49c1234567890ghi",
          "nama": "WiFi"
        }
      ]
    }
  ]
}
```

---

## 🌟 Fitur Khusus

### 1. Auto Checkout Scheduler
- Sistem otomatis yang berjalan setiap hari untuk checkout reservasi yang sudah expired
- Menggunakan `node-cron` untuk scheduling
- File: [autoCheckout.js](src/lib/autoCheckout.js)

### 2. Payment Gateway Integration
- Support untuk 3 metode pembayaran:
  - **Snap Payment**: Redirect ke halaman payment Midtrans
  - **Core API**: Payment dari server
  - **QRIS**: Pembayaran dengan QR Code

### 3. Image Upload ke Cloudinary
- Upload gambar hotel dan kamar langsung ke cloud storage
- Menggunakan Multer untuk handling file upload
- File: [uploadImage.js](src/middleware/uploadImage.js)

### 4. JWT Token Authentication
- Token dikirim dalam cookie untuk keamanan
- Auto expire setelah periode tertentu
- Refresh token mechanism

### 5. Role-Based Access Control
- 2 role: Admin dan Super Admin
- Endpoint tertentu hanya bisa diakses oleh role spesifik
- Middleware: [auth.middleware.js](src/middleware/auth.middleware.js)

### 6. MongoDB Data Sanitization
- Proteksi dari NoSQL injection
- Menggunakan `express-mongo-sanitize`

### 7. Security Headers
- Implementasi Helmet.js untuk HTTP security headers
- Proteksi dari berbagai jenis attack

---

## 🔒 Keamanan

### Best Practices yang Diterapkan

1. **Password Hashing**
   ```javascript
   // Password di-hash menggunakan bcrypt sebelum disimpan
   const hashedPassword = await bcrypt.hash(password, 10);
   ```

2. **JWT Authentication**
   ```javascript
   // Token diverifikasi di setiap protected endpoint
   const decoded = jwt.verify(token, process.env.JWT_SECRET);
   ```

3. **Environment Variables**
   - Semua secret dan sensitive data disimpan di `.env`
   - Jangan commit `.env` file ke repository

4. **CORS Configuration**
   - Hanya domain yang di-whitelist yang bisa akses
   - Credentials (cookies) hanya dikirim ke trusted origins

5. **MongoDB Sanitization**
   - Prevent NoSQL injection attacks
   - Sanitasi semua input ke database

6. **Helmet.js**
   - Set security HTTP headers
   - Prevent XSS, clickjacking, dan attack lainnya

7. **Cookie Security**
   ```javascript
   // JWT disimpan dalam httpOnly cookie
   res.cookie("jwt", token, {
     httpOnly: true,
     secure: process.env.NODE_ENV === "production",
     sameSite: "Strict"
   });
   ```

### Rekomendasi Keamanan Tambahan

- Gunakan HTTPS di production
- Implement rate limiting untuk prevent brute force
- Setup logging dan monitoring
- Regular backup database MongoDB
- Setup SSL certificate
- Implement 2FA untuk admin account
- Regular security audit

---

## 🐛 Troubleshooting

### Koneksi MongoDB Failed
```
Error: MongoDB connection error
```
**Solusi:**
- Pastikan MONGODB_URI benar di `.env`
- Cek IP whitelist di MongoDB Atlas
- Pastikan internet connection stabil

### JWT Token Invalid
```
Error: Unauthorized - Invalid token
```
**Solusi:**
- Pastikan JWT_SECRET sama di `.env`
- Clear cookies dan login ulang
- Cek token expiry time

### Cloudinary Upload Failed
```
Error: Cloudinary upload failed
```
**Solusi:**
- Verifikasi credentials Cloudinary
- Cek limit upload size (50MB di config)
- Pastikan API key valid

### Port Already in Use
```
Error: listen EADDRINUSE: address already in use :::5000
```
**Solusi:**
- Ubah PORT di `.env`
- Kill process yang menggunakan port: `lsof -i :5000`

---

## 📝 License

ISC License



**Last Updated:** January 17, 2024
