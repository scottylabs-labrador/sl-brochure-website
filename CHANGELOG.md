# Changelog

## 2026-08-29

- Desktop hero Scottie is the complete 3-piece silhouette (head/body, hindquarters/tail, and U-shaped belly/feet bar), exported as one SVG at native scale so pieces stay aligned (`object-fit: contain`).
- Desktop frame insets were tightened so snout, ears, and tail tip stay inside `.cover` instead of clipping under `overflow: hidden`. Phone cover layout is unchanged.
- Desktop Scottie is centered in a larger frame (about 9% right, 11% top) so snout and tail tip have visible padding from every cover edge.
- Header scroll-spy now highlights **Committees** when that section is in view. Evan (Slack #leadership-26-27) reported it never became active; the old IntersectionObserver `threshold` skipped the tall three-committee spread. Spy is now a document-order scan against a line below the sticky header, on both desktop and narrow layouts.
- Top nav lists all **7 committees** (Tech, Finance, Labrador, Design, Foundry, Events, Outreach) instead of one lumped Committees item, with scroll-spy on each — including nested Finance, Design, and Outreach. Requested by Thomas.
- Header order is now Outreach → Join → Calendar to match the page layout (Evan, Slack #leadership-26-27).
- Print path lays the live site out as a two-sided letter landscape trifold (outside: Events | Say Hello | Cover; inside: Tech | Labrador | Foundry), matching the Figma sheets. Thomas asked in Slack #leadership-26-27 after Evan’s original print-as-actual-brochure idea. Screen/mobile layout is unchanged. Preview at `/print`; File → Print on the homepage or that route; download `/brochure.pdf`.
