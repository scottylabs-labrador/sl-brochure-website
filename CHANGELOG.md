# Changelog

## 2026-08-29

- Desktop hero Scottie is the complete 3-piece silhouette (head/body, hindquarters/tail, and U-shaped belly/feet bar), exported as one SVG at native scale so pieces stay aligned (`object-fit: contain`).
- Desktop frame insets were tightened so snout, ears, and tail tip stay inside `.cover` instead of clipping under `overflow: hidden`. Phone cover layout is unchanged.
- Desktop Scottie is centered in a larger frame (about 9% right, 11% top) so snout and tail tip have visible padding from every cover edge.
- Header scroll-spy now highlights **Committees** when that section is in view. Evan (Slack #leadership-26-27) reported it never became active; the old IntersectionObserver `threshold` skipped the tall three-committee spread. Spy is now a document-order scan against a line below the sticky header, on both desktop and narrow layouts.
