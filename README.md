# Nexus Careers - Frontend Application

The web frontend interface for **Nexus Careers**, a premium, high-fidelity Job Portal Management System separating Admin and Job-Seeker workflows. Built using **React, TypeScript, Redux Toolkit, Tailwind CSS, and Vite**.

## 🚀 Live URL
The frontend application is successfully deployed and running at:  
👉 **[https://nexuscareers.vercel.app](https://nexuscareers.vercel.app)**

---

**Default Admin Credentials**:
   - **Email**: `admin@tnp.com`
   - **Password**: `password123`

**Default User Credentials**:
   - **Email**: `user@tnp.com`
   - **Password**: `password123`


## 🎨 Visual Design Aesthetics: "Icy Cyber Light Tech"
The user interface follows strict structural styling principles to provide a premium, modern, and cohesive look:
- **Clean Background Profiles**: Crisp pure white backgrounds (`bg-white`) for cards/components and ultra-light icy grey (`bg-slate-50`) for page frameworks.
- **Subtle Modern Borders**: Minimal, thin border styling (`border-slate-200/60`) to define layout structure without visual clutter.
- **Futuristic Accents**: Bold, linear gradients (such as `from-indigo-600 to-cyan-500`) reserved exclusively for call-to-action buttons, active loaders, and key section headings.
- **Dynamic Interactions**: Smooth micro-animations, backdrop blurs, and hover transitions implemented on interactive grids, buttons, and dialog overlays.

---

## ✨ Features & Functionality

### 💻 Job Seeker Portal (Public & Authenticated)
- **Interactive Landing Page**: Modern Hero grid, category-based job filtering shortcuts, featured jobs list, and a unified footer.
- **Job Discovery & Search**: Filter jobs by Category and Experience levels in a collapsible side panel (collapses into a mobile filters menu on small screens).
- **Job Details View**: Dynamic retrieval of specific job details directly from the API.
- **One-Click Applications**: Logged-in users can apply directly for open positions with validation checks that prevent double-submissions.

### 🛡️ Admin Dashboard (Protected Management)
- **Role-Based Access Control**: Pages are protected by route checks; standard users attempting to access admin dashboards are redirected.
- **Interactive Job Management**: A listing of all open job postings with CRUD actions (Create, Edit, Delete).
- **Modal Confirmation Dialogs**: Custom minimalist confirmation overlays (Delete Postings, Session Logout) featuring full-page backdrop blurs to prevent accidental clicks.

---

## 🏗️ State Management & API Synchronicity
- **State Store**: Redux Toolkit manages global data caching, including job vacancy data arrays, filter schemas, and user auth variables.
- **Axios Client Interceptors**: Located at `src/api/axios.ts`. Handles incoming requests by supplying cross-origin credential cookies. Contains response interceptors to catch `403` status errors and trigger background token rotation (`/auth/refresh`) before retrying failed requests.

---

## 💻 Local Setup & Execution Guide

### 📋 Prerequisites
- **Node.js** (v18 or higher recommended)
- **NPM** (v9 or higher)
- Backend API running locally at `http://localhost:5000` or deployed

### 🛠️ Step-by-Step Installation

1. **Clone the frontend directory**:
   ```bash
   cd tnp-job-portal-frontend
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Configure Environment Variables**:
   Create a `.env` file in the root of the frontend folder:
   ```env
   VITE_API_URL="http://localhost:5000/api"
   ```

4. **Run Local Development Server**:
   ```bash
   npm run dev
   ```
   The local Vite server will launch. Open **`http://localhost:5173`** in your browser to view the application.

5. **Build for Production**:
   Compile and optimize production-ready assets into `./dist`:
   ```bash
   npm run build
   ```
   To preview the production bundle locally:
   ```bash
   npm run preview
   ```
