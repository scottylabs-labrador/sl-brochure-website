# ScottyLabs 2026–27 O-week brochure

Digital, readable version of the ScottyLabs tri-fold for [brochure.scottylabs.org](https://brochure.scottylabs.org).

## Local

```bash
python3 -m http.server 8080
```

Open [http://localhost:8080](http://localhost:8080).

## Railway

The site is a static bundle served by nginx on `$PORT`.

```bash
docker build -t sl-brochure .
docker run --rm -p 8080:8080 -e PORT=8080 sl-brochure
```

On Railway, connect this repo and deploy. Point `brochure.scottylabs.org` at the generated domain.

## Print (trifold)

The on-screen site stays a scrolling digital brochure. Printing reassembles the same sections into the two Figma sheets (letter landscape, three panels).

1. Open [https://brochure.scottylabs.org/print](https://brochure.scottylabs.org/print) for an on-screen proof of both sheets.
2. **Print / Save PDF** (or File → Print). Use Chrome or Edge: **Letter**, **landscape**, **margins None**, **background graphics** on. Two-sided: flip on the **short edge**. Page 1 is the outside (cover on the right); page 2 is the inside.
3. Download [https://brochure.scottylabs.org/brochure.pdf](https://brochure.scottylabs.org/brochure.pdf) for the two pages the app renders. PNGs: `/brochure-outside.png`, `/brochure-inside.png`.

File → Print from the homepage uses the same layout (sticky header hidden). Regenerating the PDF/PNGs: `python3 -m http.server 8080` then `node tools/render-brochure.mjs`.

## Copy

Committee copy, dates, and figures are transcribed from the 2026–27 print spreads. The TartanConnect QR encodes [linktr.ee/scottylabs](https://linktr.ee/scottylabs).

## Changelog

- **2026-08-29** — Desktop hero Scottie is the full 3-piece mark (body, hind/tail, U-shaped belly/feet), combined in one SVG at native Figma scale with `object-fit: contain`. The mark is centered with large cover gutters so snout, ears, and tail tip stay unclipped.
- **2026-08-29** — Sticky nav highlights Committees while that section is in view (Evan, Slack #leadership-26-27).
- **2026-08-29** — Header nav lists all seven committees with per-committee scroll-spy (Thomas).
- **2026-08-29** — Header order is Outreach → Join → Calendar to match the page (Evan, Slack #leadership-26-27).
- **2026-08-29** — Print CSS + `/print` preview reassemble the live site into a two-sided letter landscape trifold. Evan’s idea in Slack #leadership-26-27; Thomas Kanz gave the go-ahead and asked for proof pages from the live app. Screen layout unchanged.
- **2026-08-29** — Print density tightened to match Figma (Thomas: live print had too much unused space).
- **2026-08-29** — Print inside stacks Labrador→Design and Foundry→Interested from the top (Thomas: the `margin-top: auto` gap looked sus). Leftover room stays at the column bottom, not between sections.
- **2026-08-29** — CMU Guide pill links to https://cmu.guide/?utm_source=SL-brochure (Thomas).
- **2026-08-29** — tartanhacks.com links now go to https://nova.scottylabs.org (Thomas, Slack #leadership-26-27; Nova AI hackathon site is up).
