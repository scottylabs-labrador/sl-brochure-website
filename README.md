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

## Copy

Committee copy, dates, and figures are transcribed from the 2026–27 print spreads. The TartanConnect QR encodes [linktr.ee/scottylabs](https://linktr.ee/scottylabs).

## Changelog

- **2026-08-29** — Desktop hero Scottie is the full 3-piece mark (body, hind/tail, U-shaped belly/feet), combined in one SVG at native Figma scale with `object-fit: contain`. The mark is centered with large cover gutters so snout, ears, and tail tip stay unclipped.
- **2026-08-29** — Sticky nav highlights Committees while that section is in view (Evan, Slack #leadership-26-27).
