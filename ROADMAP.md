# Projeto Verde — Roadmap

Forest school website for Projeto Verde, Barreiro, Portugal.
Stack: Go + Chi (backend) · React + Vite + Tailwind (frontend) · GitHub Actions (CI/CD).

---

## Status

| Epic | Title | Status |
|---|---|---|
| E1 | Contact Form Backend | Backlog |
| E2 | Deploy Pipeline | Backlog |
| E3 | Real Media & Gallery | Backlog |
| E4 | SEO & Performance | Backlog |

---

## Epics

### E1: Contact Form Backend

**Goal:** Wire the existing contact form to send real emails so parents can reach the school.

**Motivation:** The contact form on the website currently has a placeholder submit handler — clicking "Enviar mensagem" does nothing. Parents and interested families have no way to contact the school through the site. This is the most critical gap between the current UI and a live, useful website.

**Requirements:**

Functional:
- REQ-01: Form submissions (name, email, message) must be delivered to `escolaprojetoverde@gmail.com`
- REQ-02: The user must receive visual confirmation that the message was sent
- REQ-03: If submission fails, the user must see a clear error message and be able to retry
- REQ-04: The backend must validate all fields (name non-empty, email valid format, message non-empty) and return meaningful errors

Non-functional:
- REQ-05: Submission must complete within 5 seconds under normal conditions
- REQ-06: No email credentials may be stored in version control

**Test Cases:**
- TC-01: Happy path — user fills all fields and submits; email arrives at school inbox; success state shown
- TC-02: Validation — user submits with empty name or invalid email; field-level error shown; no email sent
- TC-03: Server error — SMTP is unreachable; user sees retry message; no silent failure

**Architecture Decisions:**
- ADR-01: Use SMTP via Go's `net/smtp` + app password (Gmail) over a third-party email API — avoids new external dependencies and free tier limits

**Scope:**

Backend:
- `POST /api/contact` handler — validate input, send email via SMTP, return JSON response
- Config: `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`, `CONTACT_TO` env vars
- Unit tests for validation logic; integration test for handler

Frontend:
- Wire `Contact.tsx` form to `POST /api/contact`
- Show field-level validation errors from API response
- Retain success state on 200; show error banner with retry on failure

---

### E2: Deploy Pipeline

**Goal:** Deploy the site publicly on free infrastructure with automatic deploys on every merge to `main`.

**Motivation:** The site exists only locally. To be useful to the school, it needs a public URL. Deployment should be zero-effort after setup — merge to `main` and the site updates automatically.

**Requirements:**

Functional:
- REQ-01: Every merge to `main` automatically deploys both frontend and backend to a **QA environment**
- REQ-02: QA environment is publicly accessible via HTTPS and usable by the school owners for testing
- REQ-03: **Production deploy is a manual action** — a human must explicitly trigger it (e.g. GitHub Actions workflow dispatch or a manual Vercel/Render promotion)
- REQ-04: Production and QA are fully isolated — QA deploys never affect the production URL
- REQ-05: Deploy failures notify the team (GitHub Actions status)
- REQ-06: Both QA and production backend APIs are reachable from their respective frontends

Non-functional:
- REQ-07: Total hosting cost must be €0 (free tier only)
- REQ-08: Frontend cold load < 3s on a 4G connection

**Test Cases:**
- TC-01: Auto-deploy to QA — merge to `main`; both services deploy to QA URL automatically; school owners can browse the site within 5 minutes
- TC-02: Manual prod deploy — human triggers production deploy via GitHub Actions; production URL updated; QA URL unchanged
- TC-03: Build failure — broken code merged; QA deploy fails; previous QA version stays live; production unaffected; CI reports failure
- TC-04: Environment isolation — changes visible on QA URL are not visible on production URL until a prod deploy is triggered
- TC-05: API reachability — frontend can POST to `/api/contact` without CORS errors on both QA and production

**Architecture Decisions:**
- ADR-02: Frontend on Vercel (free tier, GitHub integration, CDN) — zero config for Vite apps
- ADR-03: Backend on Render (free tier, Go support, automatic deploys from GitHub) — simplest free Go hosting

**Scope:**

DevOps:
- Vercel project linked to `frontend/` directory
- Render service linked to `backend/` directory
- Environment variables set in both platforms
- `.github/workflows/deploy.yml` or rely on platform-native GitHub integrations

---

### E3: Real Media & Gallery

**Goal:** Replace placeholder Picsum images with real photos from Projeto Verde's activities.

**Motivation:** The current site uses random stock photos. Real photos of the school's outdoor activities, children exploring nature, and community events are essential for authenticity and building trust with prospective families.

**Requirements:**

Functional:
- REQ-01: Hero, Philosophy, and Gallery sections display real Projeto Verde photos
- REQ-02: Images are optimised for web (< 200 KB each, WebP format preferred)
- REQ-03: Gallery layout adapts to the number of photos provided (no broken grid with fewer than 6 images)

Non-functional:
- REQ-04: Images served from a CDN or static hosting — no images committed to Git
- REQ-05: Alt text provided for all images (accessibility)

**Test Cases:**
- TC-01: Happy path — all sections render real photos at correct aspect ratios on desktop and mobile
- TC-02: Missing image — one image URL 404s; placeholder shown, rest of page unaffected
- TC-03: Slow connection — images lazy-load; page is usable before images finish loading

**Architecture Decisions:**
- ADR-04: Images hosted on Cloudinary free tier (50 GB bandwidth, transformation API) — avoids bloating the Git repo and provides on-the-fly resizing

**Scope:**

Frontend:
- Replace all `picsum.photos` URLs with real image URLs
- Add `loading="lazy"` to all `<img>` tags
- Add descriptive `alt` text to every image

DevOps:
- Cloudinary account setup and upload workflow documented

---

### E4: SEO & Performance

**Goal:** Make the site discoverable on Google and load fast enough to pass Core Web Vitals.

**Motivation:** Parents searching for "escola floresta Barreiro" or "forest school Portugal" should find Projeto Verde. A fast, well-structured page also builds trust.

**Requirements:**

Functional:
- REQ-01: Page title, meta description, and Open Graph tags set correctly
- REQ-02: `sitemap.xml` and `robots.txt` present and correct
- REQ-03: Structured data (JSON-LD `EducationalOrganization`) present in `<head>`

Non-functional:
- REQ-04: Lighthouse Performance score ≥ 90 on mobile
- REQ-05: Lighthouse SEO score ≥ 95

**Test Cases:**
- TC-01: Google preview — title and description appear correctly in a search result snippet
- TC-02: Social share — sharing the URL on WhatsApp shows the correct OG image and title
- TC-03: Lighthouse — mobile audit scores ≥ 90 performance, ≥ 95 SEO

**Architecture Decisions:**
- ADR-05: Static meta tags in `index.html` (no SSR) — sufficient for a single-page marketing site; revisit if blog/dynamic content added

**Scope:**

Frontend:
- `<title>`, `<meta name="description">`, Open Graph and Twitter Card tags in `index.html`
- JSON-LD `EducationalOrganization` schema
- `public/sitemap.xml` and `public/robots.txt`
- Lazy loading, image sizing, font preloading for Core Web Vitals

---

## Stories Index

See `STORIES.md` for the full index of stories per epic.
