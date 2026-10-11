# Stackly Public Library

A complete, modern, colorful and responsive **Public Library Management Website** built with **HTML5, CSS3 and Vanilla JavaScript** only.

No frameworks (no React, Vue, Angular, Bootstrap or Tailwind). External, permitted resources are used for icons (Font Awesome), fonts (Google Fonts), charts (Chart.js), book covers (Open Library), photography (Unsplash) and the map (OpenStreetMap).

---

## ✨ Features

**Public website**
- Sticky, responsive navbar with animated underlines, active-page indicators and a mobile hamburger drawer.
- **Home** — hero, featured books, categories, animated statistics, recommendations, events, testimonials and newsletter.
- **About Us** — mission, vision, values, history timeline, team and facilities.
- **Books & Collections** — live search, category filter, availability filter, sorting, pagination and a book details modal.
- **Library Services** — eight animated service cards with functional *Learn More* modals.
- **Contact Us** — validated contact form, info cards, FAQ accordion and a responsive OpenStreetMap embed.

**Accounts (front-end demo)**
- **Login** and **Sign Up** split-screen pages with validation, password visibility toggles, a password-strength meter and a role dropdown.
- Demo session stored in `localStorage`.

**Dashboard**
- Fixed viewport layout with an independently scrollable content area.
- Sidebar with **eight pages**: Overview, My Books, Browse Books, Borrowing History, Reservations, Reading Lists, Notifications, Profile & Settings.
- Dynamic welcome message using the part of the email before `@` (e.g. `rohit@gmail.com` → *Welcome back, rohit!*).
- Chart.js pie/doughnut, bar and line charts, activity tables, reading progress and interactive actions.
- Logout confirmation modal.

**Extras**
- Custom animated `404.html` page.
- Scroll-reveal animations, animated counters, hover effects and `prefers-reduced-motion` support.

> ⚠️ **Demo only.** Login, sign-up and all "transactions" are simulated with `localStorage` and sample data. They are **not secure** and must never replace real authentication. Production accounts require a secure backend with hashing and server-side validation.

---

## 📁 Folder structure

```text
Public Library/
├── index.html
├── about.html
├── books.html
├── services.html
├── contact.html
├── login.html
├── signup.html
├── 404.html
├── .nojekyll
├── dashboard/
│   ├── overview.html
│   ├── my-books.html
│   ├── browse-books.html
│   ├── borrowing-history.html
│   ├── reservations.html
│   ├── reading-lists.html
│   ├── notifications.html
│   └── profile-settings.html
├── css/
│   ├── style.css
│   ├── responsive.css
│   ├── auth.css
│   └── dashboard.css
├── js/
│   ├── main.js
│   ├── auth.js
│   ├── books.js
│   ├── dashboard.js
│   └── charts.js
└── assets/
    ├── images/
    └── icons/
```

---

## 🚀 Run locally

No build step is required. Because the dashboard guard and session use `localStorage`, run it through a **local web server** (opening files with `file://` works for browsing but is not recommended).

Pick any one:

```powershell
# Python 3
python -m http.server 5500

# Node.js (npx)
npx serve -l 5500
```

Then open <http://localhost:5500/>.

**Demo flow**
1. Open `login.html`, enter any valid email, a 6+ character password and choose a role.
2. You are redirected to `dashboard/overview.html`.
3. Use the sidebar to visit all eight dashboard pages.
4. Click **Logout** to see the confirmation modal.

---

## ☁️ Deploy to GitHub Pages

1. Create a new GitHub repository and push these files to the `main` branch:
   ```bash
   git init
   git add .
   git commit -m "Stackly Public Library"
   git branch -M main
   git remote add origin https://github.com/<your-username>/<your-repo>.git
   git push -u origin main
   ```
2. In the repository, go to **Settings → Pages**.
3. Under **Build and deployment → Source**, choose **Deploy from a branch**.
4. Select the **main** branch and the **/(root)** folder, then **Save**.
5. Wait a minute, then visit `https://<your-username>.github.io/<your-repo>/`.

The root `404.html` is served automatically by GitHub Pages for unknown routes, and the included `.nojekyll` file ensures all assets are published as-is.

### Netlify / Vercel (alternative)
Drag-and-drop the project folder (or connect the repo). No build command is needed; publish directory is the project root. Both services serve `404.html` for unmatched routes automatically.

---

## 🗺️ Customization notes

- **Library location:** `contact.html` contains a placeholder address and an OpenStreetMap embed using a real public library (New York Public Library) as an example. Replace the `bbox`/`marker` coordinates and the address text with your own.
- **Contact details:** Update phone, email and hours in the navbar/footer and `contact.html`.
- **Books:** The catalogue lives in the `window.STACKLY_BOOKS` array in `js/books.js`. Add or edit entries there; covers load from Open Library by ISBN with an automatic fallback image.
- **Images:** All photography uses Unsplash with meaningful `alt` text and `data-fallback` fallbacks.

---

## ✅ Quality checklist

- [x] Five public pages, each with its own HTML file
- [x] Login / Sign Up split-screen with working role dropdown
- [x] Demo login shows a success message and opens the dashboard
- [x] Dashboard shows the logged-in email and a dynamic `name@` greeting
- [x] All eight dashboard pages with unique content
- [x] Working pie, bar and line charts (responsive)
- [x] Search, filter, sort and pagination all functional
- [x] Working embedded contact map
- [x] Logout confirmation modal with Cancel / Confirm
- [x] 404 page with working Go Back and Back to Home
- [x] Responsive across desktop, tablet and mobile
- [x] Reduced-motion friendly animations
- [x] No front-end frameworks — HTML, CSS and Vanilla JS only
