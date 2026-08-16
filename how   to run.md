# 🚀 HOW TO RUN THE FULL PROJECT — Complete Guide

Bro, here's the **complete step-by-step guide** to run everything locally. I'll show you how to run each part **individually** and **all together**.

---

## 📊 QUICK OVERVIEW — What Runs Where

| Part | Folder | Port | Command |
|------|--------|------|---------|
| **Backend API** | `backend/` | `5000` | `npm run dev` |
| **Admin Panel** | `admin/` | `3000` | `npm run dev` |
| **Flutter App** | `app/` | `3001` (web) | `flutter run -d chrome` |
| **Database** | PostgreSQL | `5432` | `docker-compose up -d db` |
| **Redis** | Redis | `6379` | `docker-compose up -d redis` |

---

## 🔧 1. RUN THE BACKEND API (First!)

### Step 1: Open Terminal

```bash
# Go to backend folder
cd ~/Desktop/homepulse/backend
```

### Step 2: Install Dependencies

```bash
npm install
```

### Step 3: Create Environment File

```bash
# Copy the example environment file
cp .env.example .env

# OR create it manually
nano .env
```

Add this to `.env`:

```env
# Database
DATABASE_URL="postgresql://postgres:password@localhost:5432/homepulse"

# Server
PORT=5000
JWT_SECRET="your-super-secret-key-change-this"

# M-Pesa
MPESA_CONSUMER_KEY="your_consumer_key"
MPESA_CONSUMER_SECRET="your_consumer_secret"
MPESA_PASSKEY="your_passkey"

# Redis
REDIS_URL="redis://localhost:6379"

# AWS (for file uploads)
AWS_ACCESS_KEY_ID="your_access_key"
AWS_SECRET_ACCESS_KEY="your_secret_key"
AWS_S3_BUCKET="homepulse-storage"
AWS_REGION="us-east-1"
```

### Step 4: Setup Database

```bash
# Make sure PostgreSQL is running
# Then run Prisma migrations
npx prisma migrate dev --name init

# Generate Prisma client
npx prisma generate

# Seed the database (optional)
npx prisma db seed
```

### Step 5: Run the Backend

```bash
# Development mode (with auto-reload)
npm run dev

# OR production mode
npm run build
npm start
```

**You should see:**
```
🚀 Server running on http://localhost:5000
✅ Database connected
✅ Redis connected
```

**Test it:**
```bash
# Open browser or use curl
curl http://localhost:5000
# Should return: {"message": "🏠 HomePulse API is running!"}
```

---

## 🖥️ 2. RUN THE ADMIN PANEL

### Step 1: Open Terminal (New Window)

```bash
# Go to admin folder
cd ~/Desktop/homepulse/admin
```

### Step 2: Install Dependencies

```bash
npm install
```

### Step 3: Create Environment File

```bash
cp .env.example .env
# OR
nano .env
```

Add this to `.env`:

```env
# API URL (Backend must be running)
NEXT_PUBLIC_API_URL="http://localhost:5000"

# Admin Secret (for authentication)
ADMIN_SECRET="your-admin-secret-key"

# Next.js
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

### Step 4: Run the Admin

```bash
# Development mode
npm run dev
```

**You should see:**
```
  ▲ Next.js 14.0.0
  - Local:        http://localhost:3000
  - Environments: .env
```

**Open in browser:** `http://localhost:3000`

---

## 📱 3. RUN THE FLUTTER APP

### Step 1: Open Terminal (New Window)

```bash
# Go to app folder
cd ~/Desktop/homepulse/app
```

### Step 2: Install Dependencies

```bash
flutter pub get
```

### Step 3: Create Environment File

```bash
# Create .env file in the root of app/
nano .env
```

Add this to `.env`:

```env
API_URL=http://localhost:5000
MAPBOX_API_KEY=your_mapbox_key
MPESA_CONSUMER_KEY=your_consumer_key
```

### Step 4: Run the App

#### Option A: Run on Chrome (Web — FASTEST)

```bash
flutter run -d chrome
```

**Open in browser:** `http://localhost:3001`

#### Option B: Run on Android Emulator

```bash
# List available emulators
flutter emulators

# Launch an emulator
flutter emulators --launch Pixel_4_API_30

# Run on Android
flutter run -d android
```

#### Option C: Run on iOS (Mac only)

```bash
# Open iOS simulator
open -a Simulator

# Run on iOS
flutter run -d ios
```

#### Option D: Run on Physical Device

```bash
# Connect your phone via USB
# Enable USB debugging (Android) or Trust (iOS)

# Run on device
flutter run -d <device-id>
```

---

## 🐳 4. RUN EVERYTHING WITH DOCKER (All at Once)

### Step 1: Make Sure Docker is Installed

```bash
docker --version
docker-compose --version
```

### Step 2: Start All Services

```bash
# Go to project root
cd ~/Desktop/homepulse

# Start everything
docker-compose up -d
```

This starts:
- ✅ PostgreSQL (port 5432)
- ✅ Redis (port 6379)
- ✅ Backend API (port 5000)
- ✅ Admin Panel (port 3000)
- ✅ Flutter App (port 3001)

### Step 3: Check Everything is Running

```bash
# Check all containers
docker-compose ps

# Check logs
docker-compose logs -f
```

### Step 4: Stop Everything

```bash
docker-compose down
```

---

## 📋 5. RUNNING IN PARALLEL (Recommended for Development)

Open **3 separate terminal windows**:

### Terminal 1: Backend

```bash
cd ~/Desktop/homepulse/backend
npm install
npm run dev
```

### Terminal 2: Admin

```bash
cd ~/Desktop/homepulse/admin
npm install
npm run dev
```

### Terminal 3: Flutter

```bash
cd ~/Desktop/homepulse/app
flutter pub get
flutter run -d chrome
```

---

## 🔧 TROUBLESHOOTING

### Backend Issues

| Issue | Solution |
|-------|----------|
| `Error: connect ECONNREFUSED` | PostgreSQL not running → Start it |
| `Error: Prisma Client not found` | Run `npx prisma generate` |
| `Error: .env file not found` | Create `.env` file |
| `Port 5000 already in use` | Change PORT in `.env` |

### Admin Issues

| Issue | Solution |
|-------|----------|
| `Error: Cannot find module` | Run `npm install` again |
| `Error: Next.js build failed` | Delete `.next/` folder and rebuild |
| `Error: API calls failing` | Make sure backend is running |

### Flutter Issues

| Issue | Solution |
|-------|----------|
| `Error: Flutter not found` | Add Flutter to PATH |
| `Error: pub get failed` | Run `flutter clean` then `flutter pub get` |
| `Error: Chrome not found` | Install Chrome or use `flutter run -d web-server` |
| `Error: Emulator not found` | Create emulator in Android Studio |

---

## ✅ CHECKLIST — Everything is Working

| Check | Command | Expected Output |
|-------|---------|-----------------|
| **Backend** | `curl http://localhost:5000` | `{"message":"🏠 HomePulse API is running!"}` |
| **Admin** | Open `http://localhost:3000` | Admin login page |
| **Flutter** | Open `http://localhost:3001` | HomePulse app |
| **Database** | `docker ps` | PostgreSQL container running |
| **Redis** | `docker ps` | Redis container running |

---

## 🚀 QUICK START COMMANDS (Copy-Paste)

### One by One:

```bash
# 1. Start Backend
cd ~/Desktop/homepulse/backend && npm install && npm run dev

# 2. Start Admin (in new terminal)
cd ~/Desktop/homepulse/admin && npm install && npm run dev

# 3. Start Flutter (in new terminal)
cd ~/Desktop/homepulse/app && flutter pub get && flutter run -d chrome
```

### All with Docker:

```bash
cd ~/Desktop/homepulse && docker-compose up -d
```

---

## 📊 SUMMARY TABLE

| What | Folder | Port | Command | URL |
|------|--------|------|---------|-----|
| **Backend** | `backend/` | `5000` | `npm run dev` | `http://localhost:5000` |
| **Admin** | `admin/` | `3000` | `npm run dev` | `http://localhost:3000` |
| **Flutter** | `app/` | `3001` | `flutter run -d chrome` | `http://localhost:3001` |
| **Database** | Docker | `5432` | `docker-compose up -d db` | `postgresql://localhost:5432` |
| **Redis** | Docker | `6379` | `docker-compose up -d redis` | `redis://localhost:6379` |

---

**Bro, now you have EVERYTHING you need to run the full project! 🏠🔥**