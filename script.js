(function () {
  const nav = document.querySelector(".site-nav");
  if (!nav) return;

  const header = document.querySelector(".site-header");
  const items = Array.from(nav.querySelectorAll("a[href^='#']"))
    .map((link) => {
      const href = link.getAttribute("href");
      const id = href && href.startsWith("#") ? href.slice(1) : "";
      const el = id ? document.getElementById(id) : null;
      return el ? { href, el, link } : null;
    })
    .filter(Boolean);

  if (items.length === 0) return;

  // Document order so a nested target (calendar inside hello) wins once its
  // heading crosses the spy line. Nav order would skip nested ids.
  items.sort((a, b) => {
    const pos = a.el.compareDocumentPosition(b.el);
    if (pos & Node.DOCUMENT_POSITION_FOLLOWING) return -1;
    if (pos & Node.DOCUMENT_POSITION_PRECEDING) return 1;
    return 0;
  });

  function setCurrent(active) {
    for (const item of items) {
      if (item === active) item.link.setAttribute("aria-current", "true");
      else item.link.removeAttribute("aria-current");
    }
  }

  function spyLine() {
    const headerH = header ? header.offsetHeight : 0;
    // A line just below the sticky header, ~20% into the viewport — the
    // section whose top has passed this line is "current".
    return Math.max(headerH + 8, window.innerHeight * 0.2);
  }

  function update() {
    const y = spyLine();
    let current = items[0];
    let bestTop = -Infinity;
    for (const item of items) {
      const top = item.el.getBoundingClientRect().top;
      // Closest section top that has crossed the spy line. Strict > keeps
      // document-order on ties so side-by-side Events | Join both highlight
      // as Events (same top) instead of jumping to Join.
      if (top <= y && top > bestTop) {
        bestTop = top;
        current = item;
      }
    }
    const hashItem = items.find((item) => item.href === location.hash);
    if (hashItem) {
      const hashTop = hashItem.el.getBoundingClientRect().top;
      if (hashTop <= y && Math.abs(hashTop - bestTop) <= 12) {
        current = hashItem;
      }
    }
    setCurrent(current);
  }

  let ticking = false;
  function onScroll() {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      update();
      ticking = false;
    });
  }

  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", onScroll);
  window.addEventListener("hashchange", update);
  update();
})();
