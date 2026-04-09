const revealNodes = document.querySelectorAll("[data-reveal]");

if ("IntersectionObserver" in window && revealNodes.length > 0) {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      });
    },
    {
      threshold: 0.16,
      rootMargin: "0px 0px -32px 0px",
    },
  );

  revealNodes.forEach((node, index) => {
    node.style.transitionDelay = `${Math.min(index * 45, 220)}ms`;
    observer.observe(node);
  });
} else {
  revealNodes.forEach((node) => node.classList.add("is-visible"));
}
