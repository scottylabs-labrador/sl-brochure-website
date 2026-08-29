(function () {
  const PRINT_PATH = /(?:^|\/)print\/?$/;

  const printRoot = document.querySelector(".print-root");
  const printOutside = document.querySelector(".print-sheet-outside");
  const printInside = document.querySelector(".print-sheet-inside");
  const printToolbar = document.querySelector(".print-toolbar");
  const cover = document.getElementById("cover");
  const committees = document.getElementById("committees");
  const outsideSpread = document.querySelector(".outside-spread");
  const tech = document.getElementById("tech");
  const labrador = document.getElementById("labrador");
  const foundry = document.getElementById("foundry");
  const events = document.getElementById("events");
  const hello = document.getElementById("hello");
  const printTrigger = document.querySelector("[data-print-trigger]");

  const isPrintPath = PRINT_PATH.test(location.pathname);
  const captureMode = new URLSearchParams(location.search).has("capture");
  let assembled = false;

  function assembleBrochure() {
    if (assembled || !printOutside || !printInside) return;
    if (!events || !hello || !cover || !tech || !labrador || !foundry) return;
    printOutside.append(events, hello, cover);
    printInside.append(tech, labrador, foundry);
    if (printRoot) printRoot.hidden = false;
    assembled = true;
    document.documentElement.classList.add("print-mode");
    requestAnimationFrame(fitPrintPanels);
  }

  function restoreBrochure() {
    if (!assembled || isPrintPath) return;
    if (cover && committees && committees.parentNode) {
      committees.parentNode.insertBefore(cover, committees);
    }
    if (committees && tech && labrador && foundry) {
      committees.append(tech, labrador, foundry);
    }
    if (outsideSpread && events && hello) {
      outsideSpread.append(events, hello);
    }
    document.querySelectorAll(".print-sheet > .panel, .print-sheet > .cover").forEach((el) => {
      el.style.zoom = "";
    });
    if (printRoot) printRoot.hidden = true;
    document.documentElement.classList.remove("print-mode");
    assembled = false;
  }

  function fitPrintPanels() {
    if (!assembled) return;
    document.querySelectorAll(".print-sheet > .panel, .print-sheet > .cover").forEach((el) => {
      el.style.zoom = "";
      if (el.scrollHeight > el.clientHeight + 6) {
        el.style.zoom = String(Math.max(0.78, el.clientHeight / el.scrollHeight));
      }
    });
  }

  if (printTrigger) {
    printTrigger.addEventListener("click", () => window.print());
  }

  if (isPrintPath) {
    document.body.classList.add("print-preview");
    if (captureMode) document.body.classList.add("print-capture");
    if (printToolbar && !captureMode) printToolbar.hidden = false;
    assembleBrochure();
    window.addEventListener("load", fitPrintPanels);
  } else {
    window.addEventListener("beforeprint", assembleBrochure);
    window.addEventListener("afterprint", restoreBrochure);
    const printMq = window.matchMedia("print");
    const onChange = (e) => {
      if (e.matches) assembleBrochure();
      else restoreBrochure();
    };
    if (printMq.addEventListener) printMq.addEventListener("change", onChange);
    else if (printMq.addListener) printMq.addListener(onChange);
  }

  if (isPrintPath) return;

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
    if (active) {
      active.link.scrollIntoView({ inline: "nearest", block: "nearest", behavior: "instant" });
    }
  }

  function spyLine() {
    const headerH = header ? header.offsetHeight : 0;
    // Just below the sticky header so nested headings (Finance, Design,
    // Outreach) win as soon as they dock under the nav — not 20% down the
    // viewport, where a neighboring column's heading can steal the highlight.
    return headerH + 16;
  }

  function update() {
    if (document.documentElement.classList.contains("print-mode")) return;
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
      if (hashTop <= y && bestTop <= hashTop + 48) {
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
