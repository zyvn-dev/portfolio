# The Living Sky — Personal Portfolio Template & Admin Console

An award-level, cinematic personal portfolio template engineered with **Next.js (App Router)**, **TypeScript**, **Tailwind CSS**, **Three.js WebGL**, **Framer Motion**, **Firebase Auth & Firestore**, and **Cloudinary**.

---

## Concept: "The Living Sky"

The whole application responds organically to the visitor's **local system time**:
- **Dawn (05:00 – 11:59)**: Sunrise peach `#FFE3D8`, rose gold `#FF7E95`, and golden mist. Greeting: *"Good morning"*.
- **Day (12:00 – 16:59)**: Azure `#0284C7`, sky cyan `#22D3EE`, crystal atmosphere. Greeting: *"Good afternoon"*.
- **Dusk (17:00 – 20:59)**: Twilight violet `#8B5CF6`, magenta streaks `#EC4899`, amber horizon. Greeting: *"Good evening"*.
- **Night (21:00 – 04:59)**: Deep obsidian indigo `#0F172A`, neon teal `#14B8A6`, celestial stardust. Greeting: *"Good night"*.

### Zero Hardcoded Personal Data
Ships with **zero hardcoded personal data**. When collections are empty, the public site renders elegant skeletal shimmers and tasteful placeholder cards—never fake dummy identity content. Everything is populated dynamically from Firestore via the private `/admin` dashboard.

---

## 3-Tier Security Architecture

Administrative authority is strictly locked down to:
**`muhammmadzainumer@gmail.com`** (with `email_verified == true`).

1. **Client UI Guard**: Any unauthenticated visitor or different Google account is immediately rejected, force-signed out, and presented with an access-denied shield.
2. **Server Route Guard**: Next.js API route handlers verify Firebase ID tokens using `firebase-admin` before returning upload signatures or privileged operations.
3. **Database Security Rules (`firestore.rules`)**:
   - Content (`profile`, `education`, `certifications`, `projects`, `settings`): Public read, write strictly reserved for `muhammmadzainumer@gmail.com`.
   - Messages (`messages`): Public create (with strict schema constraints and honeypot protection), read/update/delete strictly reserved for `muhammmadzainumer@gmail.com`.

---

## Step-by-Step Setup Guide

### 1. Firebase Setup
1. Head to the [Firebase Console](https://console.firebase.google.com/) and create a new project.
2. Enable **Authentication**:
   - Go to **Build -> Authentication -> Sign-in method**.
   - Enable **Google** provider and save your project support email.
3. Enable **Cloud Firestore**:
   - Go to **Build -> Firestore Database -> Create database**.
   - Choose production mode.
   - Copy the contents of `firestore.rules` from this repository into **Firestore Database -> Rules** and click **Publish**.
4. Generate Web App Credentials:
   - Go to **Project Settings -> General -> Your apps -> Add app (Web)**.
   - Copy the `firebaseConfig` keys into your `.env.local` file (see `.env.example`).
5. Generate Firebase Admin Service Account Key:
   - Go to **Project Settings -> Service accounts -> Firebase Admin SDK**.
   - Click **Generate new private key**.
   - Copy `project_id`, `client_email`, and `private_key` into `FIREBASE_PROJECT_ID`, `FIREBASE_CLIENT_EMAIL`, and `FIREBASE_PRIVATE_KEY` in `.env.local`.

---

### 2. Cloudinary Setup
1. Create a free account at [Cloudinary](https://cloudinary.com/).
2. From the Cloudinary Dashboard, copy:
   - **Cloud name** -> `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME`
   - **API Key** -> `CLOUDINARY_API_KEY`
   - **API Secret** -> `CLOUDINARY_API_SECRET`
3. All image uploads from the admin panel are automatically compressed in-browser to modern **WebP** format before signed transfer to Cloudinary.

---

### 3. Local Development

```bash
# 1. Install dependencies
npm install

# 2. Duplicate environment template
cp .env.example .env.local

# 3. Start local development server
npm run dev
```

Navigate to `http://localhost:3000` to view the public site, or `http://localhost:3000/admin` to open the administrative console.

---

### 4. Deploying to Vercel

1. Push your code to GitHub, GitLab, or Bitbucket.
2. Import the repository in [Vercel](https://vercel.com/new).
3. Under **Environment Variables**, add all keys from your `.env.local` file:
   - `NEXT_PUBLIC_FIREBASE_API_KEY`
   - `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`
   - `NEXT_PUBLIC_FIREBASE_PROJECT_ID`
   - `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`
   - `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`
   - `NEXT_PUBLIC_FIREBASE_APP_ID`
   - `FIREBASE_PROJECT_ID`
   - `FIREBASE_CLIENT_EMAIL`
   - `FIREBASE_PRIVATE_KEY`
   - `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME`
   - `CLOUDINARY_API_KEY`
   - `CLOUDINARY_API_SECRET`
4. Click **Deploy**. Your living portfolio is live in under 2 minutes!

---

## Tech Stack Summary
- **Framework**: Next.js 15+ (App Router, Server Components & Route Handlers)
- **Styling**: Tailwind CSS + Custom Liquid Glass Design Tokens
- **WebGL Background**: Three.js custom simplex noise shader + celestial particulate field
- **Interactions**: Framer Motion, Lenis Smooth Inertia Scrolling, Custom Magnetic Physics Cursor
- **State & Cloud**: Firebase Auth (Google Sign-In), Firestore Realtime Database
- **Media**: HTML5 Canvas WebP Compressor + Signed Cloudinary CDN
- **Validation**: Zod (Client & Server schemas)
