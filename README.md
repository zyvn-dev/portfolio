# The Living Sky — CS Tech Personal Portfolio & Admin Console

An award-level personal portfolio template engineered with **Next.js (App Router)**, **TypeScript**, **Tailwind CSS**, **Framer Motion**, **Firestore**, **EmailJS**, and **Cloudinary**.

---

## Concept: "The Living Sky — CS / Tech Dark Theme"

The application features a smooth, high-performance **Computer Science & Tech Dark Theme**:
- **Deep Dark Navy Base**: `#0A0E27` to `#050812` (ultra-dark with subtle midnight-blue tint).
- **Floating Binary Stream**: Subtly animated `0`s and `1`s drifting upward in monospace at 8–10% opacity.
- **Circuit Board Grid**: Thin cyber-cyan (`#00D4FF`) lines and pulsing solder nodes with orthogonal traces.
- **Interactive Cursor Glow**: Soft 12% diffuse cyber-cyan and neon-green glow following user cursor physics.
- **Accents**: Cyber Cyan (`#00D4FF`) and Neon Green (`#00FF9F`) across all buttons, cards, badges, and hovers.
- **Accessibility**: Instant static fallback for `prefers-reduced-motion` and mobile performance optimization.

---

## Admin Panel Access & Routing

The administration panel allows managing all public portfolio sections dynamically with zero hardcoded identity data.

### Routes
- **`/admin/login`**: Dedicated private login page.
- **`/admin/dashboard`**: Main control center displaying portfolio statistics and quick management shortcuts.
- **`/admin/profile`**: Full Name, Headline, Bio paragraphs, Portrait, Location, and Social Links.
- **`/admin/education`**: Institute, Education Level, Years, and Badges.
- **`/admin/certifications`**: Certifications, issuing authority, year, and verification links.
- **`/admin/projects`**: Bento grid showcase, cover images, descriptions, tags, and dynamic external links.
- **`/admin/messages`**: Transmission inbox, unread counts, and message deletion.
- **`/admin/settings`**: SEO meta tags, site title, and public section visibility toggles.

### Authentication Flow
1. Click **"Admin"** in the navbar to open `/admin/login`.
2. Enter your root admin credentials (configured in `.env.local` via `ADMIN_EMAIL` and `ADMIN_PASSWORD`).
3. Upon validation, the server issues a signed, httpOnly `admin_session` JWT cookie (24-hour expiration).
4. Edge middleware validates this cookie on all `/admin/*` routes. Unauthenticated requests are redirected back to `/admin/login`.
5. Clicking **"Sign Out"** clears the session cookie and returns to `/`.

> **Admin Credentials Reference (Private Note):**
> - Email: `muhammmadzainumer@gmail.com`
> - Password: `Opportunity@8478`

---

## Contact Form Setup (EmailJS Direct to Gmail)

Transmissions sent from the public site route directly to your Gmail inbox via client-side EmailJS (with a server-side backup):

1. Create a free account at [EmailJS](https://www.emailjs.com/).
2. **Email Services** -> Click **Add Service** -> Select **Gmail** -> Connect `muhammmadzainumer@gmail.com`.
3. **Email Templates** -> Create a template with:
   - To Email: `muhammmadzainumer@gmail.com`
   - Content: `From: {{from_name}} ({{from_email}})\n\n{{message}}`
4. Copy the keys to `.env.local` and your Vercel Project Settings:
   - `NEXT_PUBLIC_EMAILJS_SERVICE_ID`
   - `NEXT_PUBLIC_EMAILJS_TEMPLATE_ID`
   - `NEXT_PUBLIC_EMAILJS_PUBLIC_KEY`

---

## Deployment & Build

```bash
# Run production build
npm run build

# Start production server
npm run start
```
