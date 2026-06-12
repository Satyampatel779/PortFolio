# Satyam Patel — AI/ML Engineer Portfolio

A dark, animation-heavy, single-page portfolio built with vanilla HTML/CSS/JS + GSAP.
No build step — deploys directly to GitHub Pages.

## ✨ Features

- Animated preloader with gradient name reveal
- Custom cursor (glowing dot + spring-lagged ring with "View" label on projects)
- Interactive neural-network particle canvas that reacts to the mouse
- Aurora gradient blobs (with mouse parallax) + film-grain noise overlay + hero grid
- Hand-drawn **animated SVG architecture diagrams** on all six featured projects *and* all three experience cards (RAG pipeline, pose-estimation skeleton, plant-disease CNN)
- Experience cards styled like featured work: per-card accent colors, glow borders, impact stat strips
- **Live terminal card** in About — types out a `whoami` profile on scroll, with glowing halo + orbiting chips
- Rotating "OPEN TO WORK" circular badge in the hero (wide screens)
- GSAP ScrollTrigger choreography: character-split headings, staggered reveals, scrubbed timeline fill, hero parallax, gradient title underlines
- 3D tilt cards, magnetic buttons, mouse-tracked spotlight cards, button shine sweeps
- Per-project accent colors with gradient hairlines; company badges on experience cards
- Typewriter hero roles, animated metric counters, dual-direction tech marquee (solid + outlined rows)
- Logo scramble-on-hover, education watermark icons, contact dot-grid + rotating halo
- **Statement section** — words light up one-by-one as you scroll (Apple-style scrub reveal)
- **"How I Ship" process section** — 4 connected steps with per-step accent colors
- Giant outlined "SATYAM PATEL" footer watermark that fills with gradient on hover
- Ghost section numbers, circular scroll-progress back-to-top button, "Open to" role chips
- `robots.txt` + `sitemap.xml` for search engines
- Scroll-spy nav that hides on scroll-down, copy-email button with toast
- Open Graph image + Twitter card + JSON-LD (rich link previews on LinkedIn/socials)
- Themed 404 page, console easter egg for devs
- Fully responsive, `prefers-reduced-motion` support, no-JS fallback, skip link + focus styles

## 🚀 Deploy to GitHub Pages

### Option A — user site (cleanest URL: `https://satyampatel779.github.io`)

```bash
cd path/to/PortFolio
git init
git add .
git commit -m "Portfolio launch"
git branch -M main
git remote add origin https://github.com/Satyampatel779/Satyampatel779.github.io.git
git push -u origin main
```

Then on GitHub: **Settings → Pages → Source: Deploy from a branch → main / (root) → Save.**
Live in ~1 minute at **https://satyampatel779.github.io**

### Option B — project site (`https://satyampatel779.github.io/portfolio`)

Same steps, but create a repo named `portfolio` and use its remote URL instead.

## 🗂 Structure

```
├── index.html          # all content & sections
├── 404.html            # themed not-found page
├── robots.txt          # crawler rules
├── sitemap.xml         # search-engine sitemap
├── css/style.css       # design system + animations
├── js/script.js        # cursor, canvas, GSAP choreography
├── assets/
│   ├── Satyam_Patel_Resume.pdf
│   └── og-image.png    # social-share preview card (1200x630)
└── .nojekyll           # serve files as-is on Pages
```

> Deploying as a **project site** instead of the user site? Update the absolute URLs
> (`canonical`, `og:url`, `og:image`, `twitter:image`) in `index.html` to match.

## ✏️ Updating content

- **Projects / experience / skills:** edit the matching `<section>` in `index.html` — every card is self-contained markup.
- **Resume:** replace `assets/Satyam_Patel_Resume.pdf` (keep the filename).
- **Typewriter roles:** the `roles` array at the top of `js/script.js`.
- **Colors:** the `--c1 … --c4` variables at the top of `css/style.css`.
