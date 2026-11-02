# Dark Mattr — Website

The agency site for **Dark Mattr**: *"You can't see it. You'll feel the pull."*

Built with Next.js 16, React 19, Tailwind CSS v4, Motion and Lenis.

## Run it

```bash
npm install
npm run dev        # http://localhost:3000
npm run check      # lint + typecheck + production build
```

## Edit the content

**All copy, services, sub-companies, stats, FAQ and contact details live in [`src/content/site.ts`](src/content/site.ts).**
Anything marked `// PLACEHOLDER` must be replaced before launch:

- `site.url`, `site.email`, `site.socials`, `site.location`
- `universe.bodies`: your real sub-companies, digital products and software (add `href` to link out)
- `numbers.stats`: your real, verifiable results

## Lead form → your CRM

The multi-step contact form posts to `/api/lead`, which forwards the lead as JSON to `LEAD_WEBHOOK_URL`
(GoHighLevel inbound webhook, Zapier, Make, n8n…). Copy `.env.example` to `.env.local` and set it,
and add the same variable in your hosting provider.

- Without it, in production the form shows an error with your email instead of silently losing leads.
- Includes server-side validation and a honeypot spam trap.

## Page structure

| Section | Component | Idea |
|---|---|---|
| Preloader | `Preloader.tsx` | 000→100 counter, "Detecting dark matter…" |
| Hero | `Hero.tsx`, `Galaxy.tsx` | Interactive canvas galaxy: cursor bends it; press & hold collapses it, release = big bang |
| Marquee | `Marquee.tsx` | Services ticker |
| 01 Manifesto | `Manifesto.tsx` | Words light up as you scroll |
| 02 Forces | `Forces.tsx` | The six services |
| 03 Method | `Method.tsx` | 4-phase "Gravity Method" timeline |
| 04 Universe | `Universe.tsx` | Sub-companies & software orbiting the Dark Mattr core |
| 05 Numbers | `Numbers.tsx` | Animated result counters |
| 06 Fit | `Fit.tsx` | Who we work with / who we don't |
| FAQ | `Faq.tsx` | Objection handling |
| 07 Contact | `Contact.tsx` | 3-step qualifying lead form |

Also included: fullscreen menu, custom cursor, film grain, SEO metadata, Open Graph image, JSON-LD, sitemap and robots.
Respects `prefers-reduced-motion`.

## Deploy

Push to GitHub and import into Vercel (zero config). Set `LEAD_WEBHOOK_URL` in the project's environment variables.
