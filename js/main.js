/* ============================================================
   Stackly Public Library - Main site interactions
   main.js
   ============================================================ */

(function () {
  "use strict";

  /* ---------------- Sticky navbar shadow ---------------- */
  const navbar = document.querySelector(".navbar");
  if (navbar) {
    const onScroll = () => navbar.classList.toggle("scrolled", window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
  }

  /* ---------------- Mobile hamburger menu ---------------- */
  const navToggle = document.querySelector(".nav-toggle");
  const navLinks = document.querySelector(".nav-links");
  if (navToggle && navLinks) {
    let backdrop = document.querySelector(".nav-backdrop");
    if (!backdrop) {
      backdrop = document.createElement("div");
      backdrop.className = "nav-backdrop";
      document.body.appendChild(backdrop);
    }
    const closeNav = () => {
      navLinks.classList.remove("open");
      backdrop.classList.remove("open");
      document.body.classList.remove("nav-open");
      navToggle.setAttribute("aria-expanded", "false");
      navToggle.setAttribute("aria-label", "Open menu");
      const icon = navToggle.querySelector("i");
      if (icon) icon.className = "fa-solid fa-bars";
    };
    const openNav = () => {
      navLinks.classList.add("open");
      backdrop.classList.add("open");
      document.body.classList.add("nav-open");
      navToggle.setAttribute("aria-expanded", "true");
      navToggle.setAttribute("aria-label", "Close menu");
      const icon = navToggle.querySelector("i");
      if (icon) icon.className = "fa-solid fa-xmark";
    };
    navToggle.addEventListener("click", () =>
      navLinks.classList.contains("open") ? closeNav() : openNav()
    );
    backdrop.addEventListener("click", closeNav);
    navLinks.querySelectorAll("a").forEach((a) => a.addEventListener("click", closeNav));
    window.addEventListener("keydown", (e) => e.key === "Escape" && closeNav());
  }

  /* ---------------- Mark active nav link ---------------- */
  const path = location.pathname.split("/").pop() || "index.html";
  document.querySelectorAll(".nav-links a[href]").forEach((a) => {
    const href = a.getAttribute("href");
    if (href && href.split("/").pop() === path) a.classList.add("active");
  });

  /* ---------------- Scroll reveal ---------------- */
  const reveals = document.querySelectorAll(".reveal");
  if (reveals.length && "IntersectionObserver" in window) {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );
    reveals.forEach((el) => io.observe(el));
  } else {
    reveals.forEach((el) => el.classList.add("visible"));
  }

  /* ---------------- Animated counters ---------------- */
  const counters = document.querySelectorAll("[data-count]");
  if (counters.length && "IntersectionObserver" in window) {
    const cio = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const el = entry.target;
          const target = parseFloat(el.dataset.count);
          const suffix = el.dataset.suffix || "";
          const decimals = el.dataset.decimals ? parseInt(el.dataset.decimals, 10) : 0;
          const duration = 1600;
          const start = performance.now();
          const tick = (now) => {
            const p = Math.min((now - start) / duration, 1);
            const eased = 1 - Math.pow(1 - p, 3);
            const val = target * eased;
            el.textContent = val.toLocaleString(undefined, {
              minimumFractionDigits: decimals,
              maximumFractionDigits: decimals,
            }) + suffix;
            if (p < 1) requestAnimationFrame(tick);
          };
          requestAnimationFrame(tick);
          cio.unobserve(el);
        });
      },
      { threshold: 0.4 }
    );
    counters.forEach((el) => cio.observe(el));
  }

  /* ---------------- Toast helper (global) ---------------- */
  window.StacklyToast = function (title, subtitle, type) {
    let toast = document.querySelector(".toast");
    if (!toast) {
      toast = document.createElement("div");
      toast.className = "toast";
      toast.innerHTML =
        '<i class="fa-solid fa-circle-check"></i>' +
        '<div><div class="toast__t"></div><div class="toast__s"></div></div>';
      document.body.appendChild(toast);
    }
    toast.classList.toggle("toast--error", type === "error");
    const ic = toast.querySelector("i");
    ic.className =
      type === "error" ? "fa-solid fa-circle-exclamation" : "fa-solid fa-circle-check";
    toast.querySelector(".toast__t").textContent = title || "Done";
    toast.querySelector(".toast__s").textContent = subtitle || "";
    toast.classList.add("show");
    clearTimeout(toast._t);
    toast._t = setTimeout(() => toast.classList.remove("show"), 3600);
  };

  /* ---------------- Accordion ---------------- */
  document.querySelectorAll(".acc-head").forEach((head) => {
    head.addEventListener("click", () => {
      const item = head.closest(".acc-item");
      item.classList.toggle("open");
    });
  });

  /* ---------------- Newsletter form ---------------- */
  const newsForm = document.querySelector("[data-newsletter]");
  if (newsForm) {
    newsForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const input = newsForm.querySelector("input");
      const email = input.value.trim();
      const ok = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
      if (!ok) {
        window.StacklyToast("Invalid email", "Please enter a valid email address.", "error");
        input.focus();
        return;
      }
      window.StacklyToast("Subscribed!", "Thanks for joining the Stackly newsletter.");
      newsForm.reset();
    });
  }

  /* ---------------- Generic image fallback ---------------- */
  document.querySelectorAll("img[data-fallback]").forEach((img) => {
    img.addEventListener("error", function () {
      if (this.dataset.fallbackApplied) return;
      this.dataset.fallbackApplied = "1";
      this.src = this.dataset.fallback;
    });
  });

  /* ---------------- Viewport-safe custom form dropdowns ---------------- */
  function initCustomSelects() {
    const selects = document.querySelectorAll("select.form-control:not([data-custom-select])");
    const closeAll = () => {
      document.querySelectorAll(".custom-select__menu.open").forEach((menu) => {
        menu.classList.remove("open");
        menu.hidden = true;
      });
      document.querySelectorAll(".custom-select__trigger[aria-expanded=true]").forEach((trigger) => trigger.setAttribute("aria-expanded", "false"));
    };

    selects.forEach((select) => {
      select.dataset.customSelect = "1";
      const wrapper = document.createElement("div");
      wrapper.className = "custom-select";
      if (select.style.maxWidth) wrapper.style.maxWidth = select.style.maxWidth;
      select.parentNode.insertBefore(wrapper, select);
      wrapper.appendChild(select);

      const trigger = document.createElement("button");
      trigger.type = "button";
      trigger.className = "custom-select__trigger";
      trigger.setAttribute("aria-haspopup", "listbox");
      trigger.setAttribute("aria-expanded", "false");
      wrapper.insertBefore(trigger, select);

      const menu = document.createElement("div");
      menu.className = "custom-select__menu";
      menu.setAttribute("role", "listbox");
      menu.hidden = true;
      document.body.appendChild(menu);

      const sync = () => {
        const selected = select.options[select.selectedIndex];
        trigger.textContent = selected ? selected.textContent.trim() : "Select an option";
        menu.innerHTML = "";
        Array.from(select.options).forEach((option) => {
          const item = document.createElement("button");
          item.type = "button";
          item.className = "custom-select__option";
          item.textContent = option.textContent.trim();
          item.setAttribute("role", "option");
          item.setAttribute("aria-selected", String(option.selected));
          item.disabled = option.disabled;
          item.addEventListener("click", () => {
            select.value = option.value;
            select.dispatchEvent(new Event("change", { bubbles: true }));
            closeAll();
            sync();
          });
          menu.appendChild(item);
        });
      };

      const open = () => {
        closeAll();
        const rect = trigger.getBoundingClientRect();
        const gap = 6;
        const maxHeight = Math.min(320, window.innerHeight - 24);
        const spaceBelow = window.innerHeight - rect.bottom - gap;
        const openAbove = spaceBelow < Math.min(220, maxHeight) && rect.top > spaceBelow;
        menu.style.left = Math.max(8, Math.min(rect.left, window.innerWidth - rect.width - 8)) + "px";
        menu.style.width = rect.width + "px";
        menu.style.maxHeight = maxHeight + "px";
        menu.style.top = openAbove
          ? Math.max(8, rect.top - maxHeight - gap) + "px"
          : Math.min(rect.bottom + gap, window.innerHeight - maxHeight - 8) + "px";
        menu.classList.add("open");
        menu.hidden = false;
        trigger.setAttribute("aria-expanded", "true");
      };

      trigger.addEventListener("click", () => menu.classList.contains("open") ? closeAll() : open());
      select.addEventListener("change", sync);
      new MutationObserver(sync).observe(select, { childList: true });
      sync();
    });

    document.addEventListener("click", (event) => {
      if (!event.target.closest(".custom-select")) closeAll();
    });
    window.addEventListener("resize", closeAll);
    window.addEventListener("scroll", closeAll, true);
  }
  initCustomSelects();

  /* ---------------- Footer year ---------------- */
  document.querySelectorAll("[data-year]").forEach((el) => {
    el.textContent = new Date().getFullYear();
  });
})();
