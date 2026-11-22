# VK STUDIO – Premium 3D Printing & Customization Platform

> **Artisanal Design Meets High-Precision Additive Manufacturing by Vamsi Krishna**

VK STUDIO is a modern, full-stack e-commerce and administrative platform built for bespoke 3D printing, rapid prototyping, and customized design commissions.

---

## 🚀 Features

- **Interactive 3D CAD Preview:** Real-time Three.js viewport with procedural 3D model rotation, mesh/wireframe controls, and live filament finish swatches.
- **Dynamic Customization Engine:** Configure per-product parameters (materials, colors, custom text, scale, reference CAD uploads) with live dynamic price updates.
- **Client Workspace:**
  - Curated product catalog with category filters and instant live search.
  - Cart workspace with guest persistence & user account synchronization.
  - WhatsApp Click-to-Chat integration for instant custom consultations.
  - Order checkout with 8-stage production tracker: `Received` → `Confirmed` → `3D Printing` → `QA Check` → `Packaged` → `Dispatched` → `Delivered`.
  - Dedicated `/custom-quote` bespoke CAD commission request page.
- **Admin Workspace (`/admin`):**
  - Command metrics dashboard (Revenue, Active Printing Jobs, Pending Quotes, Catalog, Customers).
  - Dynamic Customization Field Builder (add/edit custom fields & price modifiers on any product).
  - Customization request inspector with CAD file download, quote updates, and one-click "Convert to Order".
  - Order management with courier tracking assignment.
  - Review moderation & website CMS (Hero text, WhatsApp number, Instagram link).

---

## 🛠️ Tech Stack

- **Framework:** Next.js 14 (App Router) & React 18
- **Language:** TypeScript
- **Styling:** Tailwind CSS (Dark Onyx, Metallic Steel & Studio Lime)
- **3D Graphics:** Three.js
- **Database & ORM:** Prisma ORM with SQLite (Local) & MongoDB Atlas Drivers
- **Icons:** Lucide React
- **Authentication:** JWT Sessions with `bcryptjs` password hashing

---

## 🔑 Demo Accounts

| Role | Email | Password |
|---|---|---|
| **Studio Director (Admin)** | `vamsireddy.kata@gmail.com` | Personal Admin Password |
| **Customer** | `customer@vkstudio.com` | `customer123` |

---

## 🌐 Deploying to Vercel via GitHub

### Step 1: Initialize Git and Push to GitHub

```bash
# 1. Initialize git repository
git init

# 2. Stage all project files (safe .gitignore prevents sensitive leaks)
git add .

# 3. Create initial commit
git commit -m "Initial commit - VK STUDIO production platform"

# 4. Link your GitHub repository (replace with your repo URL)
git branch -M main
git remote add origin https://github.com/<your-username>/vk-studio.git

# 5. Push code to GitHub
git push -u origin main
```

### Step 2: Import into Vercel

1. Go to [vercel.com](https://vercel.com) and log in.
2. Click **"Add New..."** → **"Project"**.
3. Select your `vk-studio` repository and click **Import**.
4. Framework Preset will be automatically detected as **Next.js**.

### Step 3: Configure Environment Variables in Vercel

Under **Environment Variables** in Vercel, add:

| Key | Example Value | Description |
|---|---|---|
| `MONGODB_URI` | `mongodb+srv://<user>:<password>@cluster0.uv9trse.mongodb.net/vkstudio?retryWrites=true&w=majority` | Your MongoDB Atlas Connection String |
| `NEXT_PUBLIC_ADMIN_WHATSAPP` | `+91 91004 84870` | Your Studio WhatsApp Business Number |
| `NEXT_PUBLIC_INSTAGRAM_URL` | `https://instagram.com/vk_studi_o` | Official Studio Instagram Link |
| `NEXT_PUBLIC_INSTAGRAM_HANDLE` | `vk_studi_o` | Official Instagram Handle |
| `JWT_SECRET` | `vk-studio-super-secret-key-2026-production` | Secret string for session cookies |

### Step 4: Deploy

Click **Deploy**! Vercel will build and deploy VK STUDIO to a live global edge URL (e.g. `https://vk-studio.vercel.app`).

---

## 💻 Local Development

```bash
# Install dependencies
npm install

# Push local database schema & seed initial products
npm run prisma:push
npm run prisma:seed

# Start development server
npm run dev
```

Visit `http://localhost:3000` in your browser.
