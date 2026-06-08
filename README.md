# Interview Master 🎯

> **AI-Powered Interview Preparation Platform** — Upload your resume, paste a job description, and let Google Gemini craft a fully personalised interview strategy in seconds.

---

## Table of Contents

1. [Project Overview](#1-project-overview)
2. [Technology Stack](#2-technology-stack)
3. [Features](#3-features)
4. [Project Structure](#4-project-structure)
5. [Configuration & Environment Variables](#5-configuration--environment-variables)
6. [Usage & Running the Application](#6-usage--running-the-application)
7. [API Documentation](#7-api-documentation)
8. [Database Schema](#8-database-schema)
9. [Contributing Guidelines](#9-contributing-guidelines)
10. [License](#10-license)
11. [Credits & Acknowledgments](#11-credits--acknowledgments)

---

## 1. Project Overview

**Interview Master** is a full-stack, AI-driven web application that helps job seekers prepare for interviews with laser precision. Users register, paste a job description, optionally upload their PDF resume, and the platform uses **Google Gemini 2.5 Flash** to generate a tailored interview report containing:

- A **candidate-to-role match score** (0–100)
- **5 technical questions** with interviewer intentions and model answers
- **5 behavioural questions** with interviewer intentions and model answers
- **3–6 skill gap items** with severity ratings (low / medium / high)
- A **7-day preparation roadmap** with daily focus areas and 3–5 tasks per day
- An **AI-generated, ATS-optimised resume PDF** built from the candidate's data and the job description

Past reports are persisted to MongoDB Atlas and can be viewed, downloaded, or deleted at any time. A contact form on the public pages sends email notifications to the site owner and an auto-reply confirmation to the user, powered by **Nodemailer + Gmail SMTP**.

### Target Audience

- Final-year students and recent graduates preparing for their first technical role
- Working professionals switching domains or companies
- Anyone who wants a structured, data-driven approach to interview preparation

---

## 2. Technology Stack

### Backend

| Technology | Version | Feature / Purpose | Why Chosen |
|---|---|---|---|
| **Node.js** | LTS | JavaScript runtime for the server | Native async I/O, massive npm ecosystem |
| **Express.js** | ^5.2.1 | HTTP server, middleware pipeline, routing | Minimal, un-opinionated, widely adopted |
| **MongoDB Atlas** | Cloud | NoSQL document database for users, reports, blacklist tokens | Flexible schema, hosted, free tier available |
| **Mongoose** | ^9.6.2 | ODM — schema definition, validation, querying | Strongly typed schemas with built-in validators |
| **@google/genai** | ^2.6.0 | Google Gemini 2.5 Flash — AI report & resume generation | Structured JSON output with response schema enforcement |
| **Zod** | ^4.4.3 | Runtime schema validation of Gemini's JSON output | Type-safe, composable, excellent error messages |
| **zod-to-json-schema** | ^3.25.2 | Converts Zod schemas to JSON Schema for Gemini's `responseSchema` | Bridges the Zod ecosystem to the Gemini API |
| **jsonwebtoken** | ^9.0.3 | JWT creation and verification for stateless auth | Compact, self-contained, industry standard |
| **bcryptjs** | ^3.0.3 | Password hashing (salt rounds = 10) | Pure-JS bcrypt, no native binding needed |
| **cookie-parser** | ^1.4.7 | Parses HTTP cookies — reads the `token` cookie | Seamlessly extracts JWT from incoming requests |
| **multer** | ^2.1.1 | `multipart/form-data` parsing — resume PDF upload | Memory storage (no disk writes), 3 MB limit |
| **pdf-parse** | ^1.1.1 | Extracts raw text from uploaded resume PDF buffers | Lightweight, no external binary dependency |
| **puppeteer** | ^25.1.0 | Headless Chromium — renders AI-generated HTML to a PDF | Produces pixel-perfect, styled PDFs from HTML |
| **nodemailer** | ^8.0.10 | Sends emails via Gmail SMTP | Battle-tested Node.js email library |
| **express-rate-limit** | ^8.5.2 | IP-based rate limiting on the contact route (20 req / 15 min) | Protects against spam and abuse without auth |
| **cors** | ^2.8.6 | Configures CORS headers, allows `localhost:5173-5176` and `*.trycloudflare.com` | Enables the Vite dev server and Cloudflare tunnel to call the API |
| **dotenv** | ^17.4.2 | Loads `.env` variables into `process.env` | Keeps secrets out of source code |
| **crypto** | ^1.0.1 | Node.js built-in crypto — available for future token/hash utilities | Standard library wrapper |
| **nodemon** *(dev)* | via npx | Auto-restarts the server on file changes in development | Eliminates manual restarts |

### Frontend

| Technology | Version | Feature / Purpose | Why Chosen |
|---|---|---|---|
| **React** | ^19.2.6 | UI component library, Context API for global state | Declarative, component-driven, huge community |
| **React DOM** | ^19.2.6 | DOM rendering for React | Required peer of React |
| **React Router** | ^7.15.1 | Client-side routing (`createBrowserRouter`), protected routes | Declarative routing with nested layout support |
| **Vite** | ^8.0.12 | Build tool and dev server with `/api` proxy to `localhost:3000` | Sub-second HMR, ES module native, minimal config |
| **@vitejs/plugin-react** | ^6.0.1 | Babel + React Fast Refresh for Vite | Official React integration for Vite |
| **Axios** | ^1.16.1 | HTTP client — all API calls with `withCredentials: true` | Interceptors, automatic JSON parsing, blob support |
| **Sass (SCSS)** | ^1.100.0 | Component-scoped and global styles, variables, nesting | More powerful than plain CSS, no runtime overhead |
| **Motion** | ^12.40.0 | Declarative animation library (Framer Motion v12) | GPU-accelerated animations, gesture support |
| **Lenis** | ^1.3.23 | Smooth scroll implementation | Native-feeling inertia scroll across all browsers |
| **Cobe** | ^2.0.1 | WebGL interactive 3-D globe on the Home page | Visually impressive, lightweight, canvas-based |
| **Lucide React** | ^1.17.0 | SVG icon set | Tree-shakable, consistent design language |
| **Mona Sans** *(font)* | CDN | Primary typeface loaded via jsdelivr | Modern, variable-weight font from GitHub |
| **ESLint** | ^10.3.0 | Static code analysis | Catches bugs and enforces code style |
| **eslint-plugin-react-hooks** | ^7.1.1 | Enforces Rules of Hooks | Prevents subtle hook misuse bugs |

### Infrastructure / Tooling

| Technology | Purpose |
|---|---|
| **MongoDB Atlas** | Managed cloud database (Cluster0) |
| **Cloudflare Tunnel** (`cloudflared`) | Exposes the local frontend to a public `*.trycloudflare.com` URL for external testing — started automatically by `start.bat` |
| **Gmail SMTP + App Password** | Transactional email delivery for contact form |
| **`start.bat`** | Windows batch file that opens three terminal windows — Backend (`npm run dev`), Frontend (`npm run dev`), and Cloudflare Tunnel — with a single double-click |

---

## 3. Features

### 🔐 Authentication System
- **User Registration** — create an account with username, email, and bcrypt-hashed password. A JWT is issued immediately and stored as an HTTP cookie.
- **User Login** — credential verification; on success a 1-day JWT is set in the cookie.
- **User Logout** — the current JWT is added to a MongoDB **blacklist** collection and the cookie is cleared, preventing replay attacks.
- **Persistent Session** — on every page load, `GET /api/auth/get-me` is called; if the cookie is still valid the user state is restored automatically.
- **Protected Routes** — the `<Protected>` component redirects unauthenticated users to `/login` before any private page renders.

### 🤖 AI Interview Report Generation
- Accepts **job description** (required text), **self description** (optional text), and **resume PDF** (optional file, max 3 MB).
- PDF is parsed server-side with `pdf-parse`; text is fed into the Gemini prompt.
- Gemini is called with `responseMimeType: "application/json"` and a strict `responseSchema`; temperature is set to `0` for deterministic output.
- The response is double-validated — first by Gemini's schema enforcement, then by a **Zod schema** (`interviewReportSchema`) before being persisted.
- If Gemini returns a `503 / UNAVAILABLE` error, a graceful **mock report** is returned so the UI never hard-crashes.

### 📋 Interview Report Contents
Each saved report includes:
| Field | Details |
|---|---|
| **title** | Job title extracted from the description |
| **matchScore** | Integer 0–100 indicating candidate fit |
| **technicalQuestions** | Exactly 5 items — question, interviewer intention, model answer |
| **behavioralQuestions** | Exactly 5 items — question, interviewer intention, model answer |
| **skillGaps** | 3–6 items — skill name + severity (`low` / `medium` / `high`) |
| **preparationPlan** | 7 days — each with a focus area and 3–5 actionable tasks |

### 📄 AI Resume PDF Generator
- Triggered from the interview report page (`POST /api/interview/resume/pdf/:id`).
- Gemini generates a **tailored, ATS-optimised HTML resume** based on the stored resume text, self description, and job description.
- `puppeteer` renders the HTML in headless Chromium and returns an **A4 PDF buffer** streamed to the browser as a file download.

### 🗂️ Report Dashboard (Home Page)
- Lists all of the authenticated user's past reports (newest first) as animated cards.
- Cards show: title, match score, and creation date.
- Each card links to the full report detail page.
- **Optimistic deletion** — a report card disappears from the UI instantly; if the API call fails the list is restored.

### 📬 Contact Form
- Public page with name, email, phone (optional), and message fields.
- **Zod validation** on the server rejects malformed input before any email is sent.
- **Rate-limited** at 20 submissions per IP per 15 minutes via `express-rate-limit`.
- On success: sends a **notification email** to the site owner (with Reply-To set to the user's email) and a **confirmation email** to the submitter — both using rich HTML templates.

### 🌐 Public Pages
| Route | Page | Description |
|---|---|---|
| `/` | Home | Dashboard (protected) — lists all reports, form to generate a new report |
| `/interview/:id` | Interview Detail | Full report view — questions, skill gaps, prep plan, PDF download |
| `/about` | About | Platform description and how it works |
| `/testimonials` | Testimonials | Animated testimonials section |
| `/contact` | Contact | Public contact form |
| `/login` | Login | Authentication |
| `/register` | Register | Registration |

### ✨ UI & UX Highlights
- **Smooth scrolling** powered by `Lenis`
- **Framer Motion** (Motion v12) page transitions and micro-animations
- **Interactive 3-D WebGL globe** (`cobe`) on the landing page
- **Animated cards** for report items
- **Mona Sans** variable font for a premium typographic feel
- **Dark-first colour palette** (`#130f0f` background, `#249E94` accent)
- Fully responsive layout with SCSS variables and nesting

---

## 4. Project Structure

```
Interview Master/
│
├── start.bat                       # One-click launcher: Backend + Frontend + Cloudflare Tunnel
│
├── Backend/
│   ├── server.js                   # Entry point — connects DB, starts Express on PORT
│   ├── package.json
│   ├── .env                        # Environment variables (never commit this)
│   ├── .gitignore
│   └── src/
│       ├── app.js                  # Express app — middleware (cors, cookie-parser, json) + route mounting
│       ├── config/
│       │   ├── config.js           # Reads & validates all env vars; exports a config object
│       │   └── db.js               # Mongoose connection helper (connectDB)
│       ├── controllers/
│       │   ├── auth.controller.js       # register, login, logout, get-me
│       │   ├── interview.controller.js  # generate report, get by id, get all, delete, generate PDF
│       │   └── contact.controller.js    # submitContactForm (Zod validation + email dispatch)
│       ├── middlewares/
│       │   ├── auth.middleware.js   # JWT cookie verification + blacklist check (authUserMiddleware)
│       │   └── file.middleware.js   # Multer memory-storage config (3 MB limit)
│       ├── models/
│       │   ├── user.model.js             # username, email, password (hashed)
│       │   ├── interviewReport.model.js  # Full report schema (see Database Schema section)
│       │   └── blacklist.model.js        # Stores invalidated JWT tokens
│       ├── routes/
│       │   ├── auth.routes.js       # /api/auth — register, login, logout, get-me
│       │   ├── interview.routes.js  # /api/interview — CRUD + PDF generation
│       │   └── contact.routes.js    # /api/contact/submit (rate-limited)
│       ├── services/
│       │   ├── ai.service.js        # Gemini API calls: generateInterviewReport, generateResumePdf, generatePdfFromHtml
│       │   ├── email.service.js     # Nodemailer transporter: sendContactNotificationToOwner, sendConfirmationToUser
│       │   └── testData.js          # Static mock/test data (dev utility)
│       └── templates/
│           └── email.templates.js   # HTML email templates for owner notification & user confirmation
│
└── Frontend/
    ├── index.html                   # Root HTML — SEO meta tags, OG/Twitter cards, Mona Sans font
    ├── vite.config.js               # Vite config — React plugin, /api proxy to localhost:3000
    ├── eslint.config.js             # ESLint rules (react-hooks, react-refresh)
    ├── package.json
    ├── .gitignore
    └── src/
        ├── main.jsx                 # React entry — wraps <App> in AuthProvider + InterviewProvider
        ├── App.jsx                  # RouterProvider mounting
        ├── app.routes.jsx           # createBrowserRouter route definitions
        ├── style.scss               # Global SCSS — CSS resets, typography, utility classes
        ├── style/
        │   └── button.scss          # Reusable button component styles
        ├── assets/                  # Static images / SVG assets
        ├── components/              # Shared UI components
        │   ├── Navbar.jsx / .scss   # Top navigation bar with auth-aware links
        │   ├── Footer.jsx / .scss   # Site footer
        │   ├── Loader.jsx / .scss   # Full-screen loading spinner / skeleton
        │   ├── AnimatedCard.jsx / .scss  # Reusable animated report card
        │   └── GlobePulse.jsx / .scss    # Cobe WebGL globe component
        ├── hooks/                   # (reserved for future global hooks)
        └── features/
            ├── auth/
            │   ├── auth.context.jsx         # AuthContext + AuthProvider (global user state)
            │   ├── auth.form.scss           # Shared form styles for Login & Register
            │   ├── components/
            │   │   └── Protected.jsx        # HOC — redirects to /login if not authenticated
            │   ├── hooks/
            │   │   └── useAuth.js           # handleLogin, handleRegister, handleLogout
            │   ├── pages/
            │   │   ├── Login.jsx            # Login page
            │   │   └── Register.jsx         # Registration page
            │   └── services/
            │       └── auth.api.js          # Axios calls: registerUser, loginUser, logoutUser, getUserData
            └── interview/
                ├── interview.context.jsx    # InterviewContext + InterviewProvider (reports state)
                ├── components/
                │   └── TestimonialsColumn.jsx  # Animated scrolling testimonial column
                ├── hooks/
                │   └── useInterview.js      # generateReport, getReportById, getReports, getResumePdf, deleteReport
                ├── pages/
                │   ├── Home.jsx             # Dashboard — report list + new report form
                │   ├── Interview.jsx        # Full report detail + PDF download
                │   ├── About.jsx            # About page
                │   ├── Testimonials.jsx     # Testimonials page
                │   └── Contact.jsx          # Contact form page
                ├── services/
                │   └── interview.api.js     # Axios calls: generateInterviewReport, getInterviewReportById, getAllInterviewReports, generateResumePdf, deleteInterviewReport
                └── styles/
                    ├── home.scss
                    ├── interview.scss
                    ├── about.scss
                    ├── contact.scss
                    └── testimonials.scss
```

---

## 5. Configuration & Environment Variables

Create a file at `Backend/.env` (already present, **never commit it to version control**):

```env
# ── Server ──────────────────────────────────────────────────────────
PORT=3000

# ── MongoDB Atlas ────────────────────────────────────────────────────
# Replace with your own Atlas connection string
MONGO_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/InterviewMaster

# ── JWT ──────────────────────────────────────────────────────────────
# Generate with: node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
JWT_SECRET=<64-hex-char-secret>

# ── Google Gemini ─────────────────────────────────────────────────────
# Get from: https://aistudio.google.com/app/apikey
GEMINI_API_KEY=<your-gemini-api-key>

# ── Gmail SMTP (use an App Password, not your real password) ──────────
# Guide: https://support.google.com/accounts/answer/185833
SMTP_USER=your@gmail.com
SMTP_PASS=xxxx xxxx xxxx xxxx

# ── Contact Form Receiver ─────────────────────────────────────────────
# Email address that receives contact form submissions
CONTACT_EMAIL_RECEIVER=your@gmail.com
```

> **Important:** To use Gmail SMTP, you must enable **2-Step Verification** on your Google account and then generate a dedicated **App Password** (16 characters, with spaces). Using your normal password will not work.

### Vite Proxy (Frontend)

The Vite dev server automatically proxies all requests starting with `/api` to `http://localhost:3000`. This is configured in [`Frontend/vite.config.js`](Frontend/vite.config.js) and requires no extra setup.

```js
// Frontend/vite.config.js
proxy: {
  '/api': {
    target: 'http://localhost:3000',
    changeOrigin: true
  }
}
```

### CORS Allowed Origins

The backend allows requests from:
- `http://localhost:5173` – `http://localhost:5176` (Vite dev ports)
- Any `*.trycloudflare.com` domain (Cloudflare Tunnel public URLs)

To add more origins, edit the `allowedOrigins` array in [`Backend/src/app.js`](Backend/src/app.js).

---

## 6. Usage & Running the Application

### Prerequisites

- **Node.js** v18 or higher
- **npm** v9 or higher
- A **MongoDB Atlas** account and cluster
- A **Google AI Studio** account and Gemini API key
- A **Gmail** account with an App Password generated
- *(Optional)* [`cloudflared`](https://developers.cloudflare.com/cloudflare-one/connections/connect-networks/downloads/) installed and on PATH for the Cloudflare Tunnel

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/PrathamsinhParmar/Interview-Master.git
cd "Interview Master"

# 2. Install backend dependencies
cd Backend
npm install

# 3. Create and fill in the .env file (see Section 5)

# 4. Install frontend dependencies
cd ../Frontend
npm install
```

### Running in Development

**Option A — One-click (Windows only)**

Double-click `start.bat` in the project root. It opens three separate terminal windows:
1. Backend server (`nodemon`) on `http://localhost:3000`
2. Vite dev server on `http://localhost:5173`
3. Cloudflare Tunnel exposing `localhost:5173` to a public URL

**Option B — Manual (cross-platform)**

```bash
# Terminal 1 — Backend
cd Backend
npm run dev        # nodemon server.js

# Terminal 2 — Frontend
cd Frontend
npm run dev        # vite
```

Then open `http://localhost:5173` in your browser.

### Generating an Interview Report

1. Register or log in at `/register` or `/login`.
2. On the **Home** dashboard, fill in the form:
   - **Job Description** *(required)* — paste the full JD.
   - **Self Description** *(optional)* — a short paragraph about yourself.
   - **Resume PDF** *(optional, max 3 MB)* — upload your resume file.
3. Click **Generate Report**. Gemini processes the data and the report appears in your dashboard within a few seconds.
4. Click a report card to open the **full detail view** — read questions, check skill gaps, follow the prep plan.
5. On the detail page, click **Download Resume PDF** to get an AI-generated, ATS-optimised resume tailored to that job.

### Building for Production

```bash
cd Frontend
npm run build      # outputs to Frontend/dist/
```

Serve `Frontend/dist/` with any static host (Vercel, Netlify, Nginx, etc.) and point the backend at a production MongoDB URI and proper domain in the CORS list.

---

## 7. API Documentation

All API endpoints are prefixed with `/api`. Cookies are used for authentication (`credentials: true`).

### Authentication — `/api/auth`

#### `POST /api/auth/register`
Register a new user.

**Access:** Public

**Request Body:**
```json
{
  "username": "johndoe",
  "email": "john@example.com",
  "password": "securepassword"
}
```

**Response `201`:**
```json
{
  "message": "User registered successfully",
  "user": { "id": "...", "username": "johndoe", "email": "john@example.com" }
}
```
Sets `token` cookie (JWT, 1-day expiry).

**Errors:** `400` — missing fields or duplicate username/email.

---

#### `POST /api/auth/login`
Log in an existing user.

**Access:** Public

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "securepassword"
}
```

**Response `200`:**
```json
{
  "message": "User loggedIn successfully.",
  "user": { "id": "...", "username": "johndoe", "email": "john@example.com" }
}
```
Sets `token` cookie.

**Errors:** `400` — invalid email or password.

---

#### `GET /api/auth/logout`
Log out the current user. Blacklists the JWT and clears the cookie.

**Access:** Public (reads cookie if present)

**Response `200`:**
```json
{ "message": "User logged out successfully" }
```

---

#### `GET /api/auth/get-me`
Fetch the currently authenticated user's profile.

**Access:** Private (requires valid `token` cookie)

**Response `200`:**
```json
{
  "message": "User details fetched successfully",
  "user": { "id": "...", "username": "johndoe", "email": "john@example.com" }
}
```

**Errors:** `401` — missing, blacklisted, or invalid token.

---

### Interview — `/api/interview`

All interview routes are **Private** (require a valid `token` cookie).

#### `POST /api/interview/`
Generate a new AI interview report.

**Content-Type:** `multipart/form-data`

**Form Fields:**
| Field | Type | Required | Description |
|---|---|---|---|
| `jobDescription` | string | ✅ | Full job description text |
| `selfDescription` | string | ❌ | Short paragraph about the candidate |
| `resume` | file (PDF) | ❌ | Resume PDF, max 3 MB |

> At least one of `selfDescription` or `resume` must be provided.

**Response `201`:**
```json
{
  "message": "Interview report generated successfully.",
  "interviewReport": {
    "_id": "...",
    "title": "Senior Backend Developer",
    "matchScore": 78,
    "technicalQuestions": [ { "question": "...", "intention": "...", "answer": "..." } ],
    "behavioralQuestions": [ { "question": "...", "intention": "...", "answer": "..." } ],
    "skillGaps": [ { "skill": "Kubernetes", "severity": "medium" } ],
    "preparationPlan": [ { "day": 1, "focus": "...", "tasks": ["..."] } ],
    "user": "...",
    "createdAt": "...",
    "updatedAt": "..."
  }
}
```

**Errors:** `400` — missing required input or PDF parse failure. `500` — Gemini API error.

---

#### `GET /api/interview/`
Get all reports for the authenticated user (summary view — heavy fields excluded).

**Response `200`:**
```json
{
  "message": "Interview reports fetched successfully.",
  "interviewReports": [
    { "_id": "...", "title": "...", "matchScore": 78, "createdAt": "..." }
  ]
}
```

---

#### `GET /api/interview/report/:interviewId`
Get the full detail of a single report.

**Response `200`:** Full `interviewReport` object (all fields).

**Errors:** `404` — report not found or belongs to another user.

---

#### `POST /api/interview/resume/pdf/:interviewReportId`
Generate and download an ATS-optimised resume PDF.

**Response:** Binary `application/pdf` stream with header:
```
Content-Disposition: attachment; filename=resume_<id>.pdf
```

**Errors:** `404` — interview report not found.

---

#### `DELETE /api/interview/:interviewId`
Delete an interview report.

**Response `200`:**
```json
{ "message": "Interview report deleted successfully." }
```

**Errors:** `404` — report not found or not owned by the requesting user.

---

### Contact — `/api/contact`

#### `POST /api/contact/submit`
Submit the contact form.

**Access:** Public (rate-limited: 20 requests / 15 min per IP)

**Request Body:**
```json
{
  "name": "Jane Doe",
  "email": "jane@example.com",
  "phone": "+91 9876543210",
  "message": "I have a question about..."
}
```

**Validation rules (Zod):**
- `name` — min 2 chars, max 100
- `email` — valid email format
- `phone` — optional string
- `message` — min 10 chars, max 1000

**Response `200`:**
```json
{ "success": true, "message": "Your message has been sent successfully." }
```

**Errors:** `400` — Zod validation failure with per-field messages. `429` — rate limit exceeded. `500` — email send failure.

---

## 8. Database Schema

All collections live in the **`InterviewMaster`** MongoDB database.

### `users` Collection

```
user {
  _id        : ObjectId
  username   : String  [unique, required]
  email      : String  [unique, required]
  password   : String  [required]  ← bcrypt hash
  createdAt  : Date
  updatedAt  : Date
}
```

### `interviewreports` Collection

```
interviewReport {
  _id             : ObjectId
  user            : ObjectId  → ref: "user"
  jobDescription  : String  [required]
  resume          : String  ← extracted plain text from uploaded PDF
  selfDescription : String
  title           : String  [required]  ← extracted from JD by Gemini
  matchScore      : Number  [0–100]

  technicalQuestions : [
    { question: String, intention: String, answer: String }  × 5
  ]

  behavioralQuestions : [
    { question: String, intention: String, answer: String }  × 5
  ]

  skillGaps : [
    { skill: String, severity: "low" | "medium" | "high" }  × 3–6
  ]

  preparationPlan : [
    { day: Number[1–7], focus: String, tasks: [String × 3–5] }  × 7
  ]

  createdAt : Date
  updatedAt : Date
}
```

### `blacklists` Collection

```
blacklist {
  _id       : ObjectId
  token     : String  [unique, required]  ← invalidated JWT
  createdAt : Date
  updatedAt : Date
}
```

### Entity Relationship Summary

```
user (1) ──── (many) interviewReport
              Each report stores the userId as a foreign key.
              Queries always filter by { user: req.user.id } to enforce ownership.
```

---

## 9. Contributing Guidelines

Contributions are welcome! Please follow these steps:

1. **Fork** the repository on GitHub.
2. **Create a branch** from `main` with a descriptive name:
   ```bash
   git checkout -b feature/your-feature-name
   # or
   git checkout -b fix/bug-description
   ```
3. **Make your changes** following the existing code style (CommonJS on the backend, ES Modules on the frontend, SCSS for styles).
4. **Test your changes** manually:
   - Start both servers via `start.bat` or the manual steps.
   - Test all affected API routes with a tool like Postman or the browser UI.
5. **Commit** with a clear, present-tense message:
   ```bash
   git commit -m "feat: add email verification on registration"
   ```
6. **Push** your branch and open a **Pull Request** against `main`.

### Code Style Guidelines

- **Backend:** CommonJS (`require`/`module.exports`), async/await, no top-level try/catch — let Express 5's built-in async error handling propagate.
- **Frontend:** ES Modules (`import`/`export`), functional React components, hooks only (no class components).
- **Styles:** SCSS with BEM-inspired class names. Keep component styles co-located with the component file.
- **Environment variables:** Never hard-code secrets. Always add new variables to `.env` and document them in the README.

### Reporting Issues

Please open a GitHub Issue with:
- A clear title and description
- Steps to reproduce
- Expected vs. actual behaviour
- Browser / Node.js version (if applicable)

---

## 10. License

This project is licensed under the **ISC License**.

```
ISC License

Copyright (c) 2026 Prathamsinh Parmar

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted, provided that the above
copyright notice and this permission notice appear in all copies.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES
WITH REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF
MERCHANTABILITY AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR
ANY SPECIAL, DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES
WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS, WHETHER IN AN
ACTION OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF
OR IN CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.
```

---

## 11. Credits & Acknowledgments

| Resource | Role |
|---|---|
| [**Google Gemini 2.5 Flash**](https://ai.google.dev/) | Powers all AI report and resume generation via structured JSON output |
| [**Shreyains Coding School**](https://www.youtube.com/@shreyanshcoding) | Course and project inspiration — *Backend Oneshot* curriculum |
| [**Mongoose**](https://mongoosejs.com/) | Elegant MongoDB object modelling |
| [**Zod**](https://zod.dev/) | Runtime schema validation for Gemini output |
| [**Framer Motion / Motion**](https://motion.dev/) | Declarative animations and page transitions |
| [**Lenis**](https://lenis.darkroom.engineering/) | Smooth scroll utility |
| [**Cobe**](https://cobe.vercel.app/) | WebGL interactive globe |
| [**Lucide React**](https://lucide.dev/) | Clean, consistent SVG icon library |
| [**Mona Sans**](https://github.com/github/mona-sans) | Variable font by GitHub, served via jsDelivr CDN |
| [**Puppeteer**](https://pptr.dev/) | Headless Chromium for server-side PDF generation |
| [**Cloudflare Tunnel**](https://developers.cloudflare.com/cloudflare-one/connections/connect-networks/) | Zero-config local → public URL tunnelling for testing |
| [**MongoDB Atlas**](https://www.mongodb.com/atlas) | Managed cloud database hosting |

---

*Built with ❤️ by [Prathamsinh Parmar](https://github.com/PrathamsinhParmar)*
