(function () {
  const links = Array.from(document.querySelectorAll(".site-nav a"));
  const sections = links
    .map((link) => {
      const id = link.getAttribute("href");
      return id ? document.querySelector(id) : null;
    })
    .filter(Boolean);

  if (!("IntersectionObserver" in window) || sections.length === 0) {
    return;
  }

  const byId = new Map(links.map((link) => [link.getAttribute("href"), link]));

  const observer = new IntersectionObserver(
    (entries) => {
      const visible = entries
        .filter((entry) => entry.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
      if (!visible) return;
      const href = "#" + visible.target.id;
      links.forEach((link) => {
        link.removeAttribute("aria-current");
      });
      const current = byId.get(href);
      if (current) current.setAttribute("aria-current", "true");
    },
    {
      rootMargin: "-20% 0px -55% 0px",
      threshold: [0.1, 0.25, 0.5],
    }
  );

  sections.forEach((section) => observer.observe(section));
})();
