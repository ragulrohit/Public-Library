/* ============================================================
   Stackly Public Library - Dashboard interactions
   dashboard.js
   ============================================================ */

(function () {
  "use strict";

  /* ---------------- Populate logged-in user everywhere ---------------- */
  function initUser() {
    const session = window.StacklyAuth ? window.StacklyAuth.getSession() : null;
    const email = session && session.email ? session.email : "reader@stacklylibrary.org";
    const name =
      session && session.name
        ? session.name
        : window.StacklyAuth
        ? window.StacklyAuth.nameFromEmail(email)
        : "Reader";
    const role = session && session.role ? session.role : "Member";

    document.querySelectorAll("[data-user-email]").forEach((el) => (el.textContent = email));
    document.querySelectorAll("[data-user-name]").forEach((el) => (el.textContent = name));
    document.querySelectorAll("[data-user-role]").forEach((el) => (el.textContent = role));
    document.querySelectorAll("[data-user-initial]").forEach(
      (el) => (el.textContent = name.charAt(0).toUpperCase())
    );
    document.querySelectorAll("[data-user-avatar]").forEach((el) => {
      el.src =
        "https://ui-avatars.com/api/?background=6c3fc5&color=fff&bold=true&size=128&name=" +
        encodeURIComponent(name);
    });
    document.querySelectorAll("[data-user-greeting]").forEach((el) => {
      el.textContent = "Welcome back, " + name + "!";
    });
  }

  /* ---------------- Sidebar (mobile collapse) ---------------- */
  function initSidebar() {
    const sidebar = document.querySelector(".dash-sidebar");
    const toggle = document.querySelector(".dash-header__toggle");
    if (!sidebar || !toggle) return;
    const sidebarClose = sidebar.querySelector(".dash-sidebar__close");
    let backdrop = document.querySelector(".sidebar-backdrop");
    if (!backdrop) {
      backdrop = document.createElement("div");
      backdrop.className = "sidebar-backdrop";
      document.body.appendChild(backdrop);
    }
    const setToggleState = (isOpen) => {
      toggle.setAttribute("aria-expanded", String(isOpen));
      toggle.setAttribute("aria-label", isOpen ? "Close sidebar" : "Open sidebar");
      const icon = toggle.querySelector("i");
      if (icon) icon.className = isOpen ? "fa-solid fa-xmark" : "fa-solid fa-bars";
      if (sidebarClose) sidebarClose.setAttribute("aria-expanded", String(isOpen));
    };
    const close = () => {
      sidebar.classList.remove("open");
      backdrop.classList.remove("open");
      setToggleState(false);
    };
    toggle.addEventListener("click", () => {
      const isOpen = !sidebar.classList.contains("open");
      sidebar.classList.toggle("open", isOpen);
      backdrop.classList.toggle("open", isOpen);
      setToggleState(isOpen);
    });
    if (sidebarClose) sidebarClose.addEventListener("click", close);
    backdrop.addEventListener("click", close);
    window.addEventListener("keydown", (e) => e.key === "Escape" && close());
  }

  /* ---------------- Header dropdowns (notifications / profile) ---------------- */
  function initDropdowns() {
    const triggers = document.querySelectorAll("[data-dropdown]");
    triggers.forEach((trigger) => {
      const menu = trigger.parentElement.querySelector(".dash-menu");
      if (!menu) return;
      trigger.addEventListener("click", (e) => {
        e.stopPropagation();
        const willOpen = !menu.classList.contains("open");
        document.querySelectorAll(".dash-menu.open").forEach((m) => m.classList.remove("open"));
        menu.classList.toggle("open", willOpen);
      });
      menu.addEventListener("click", (e) => e.stopPropagation());
    });
    document.addEventListener("click", () =>
      document.querySelectorAll(".dash-menu.open").forEach((m) => m.classList.remove("open"))
    );
  }

  /* ---------------- Logout confirmation modal ---------------- */
  function initLogout() {
    const triggers = document.querySelectorAll("[data-logout]");
    if (!triggers.length) return;

    let modal = document.getElementById("logoutModal");
    if (!modal) {
      modal = document.createElement("div");
      modal.id = "logoutModal";
      modal.className = "modal-overlay";
      modal.innerHTML =
        '<div class="modal modal__confirm" role="dialog" aria-modal="true" aria-labelledby="logoutTitle">' +
        '<div class="modal__body">' +
        '<div class="warn-icon"><i class="fa-solid fa-right-from-bracket"></i></div>' +
        '<h3 id="logoutTitle">Are you sure you want to log out?</h3>' +
        '<p style="color:var(--muted)">You will be returned to the login page. Your demo session will be cleared.</p>' +
        "</div>" +
        '<div class="modal__foot">' +
        '<button class="btn btn--ghost" data-cancel>Cancel</button>' +
        '<button class="btn btn--warm" data-confirm><i class="fa-solid fa-right-from-bracket"></i> Confirm Logout</button>' +
        "</div></div>";
      document.body.appendChild(modal);

      modal.querySelector("[data-cancel]").addEventListener("click", () =>
        modal.classList.remove("open")
      );
      modal.addEventListener("click", (e) => {
        if (e.target === modal) modal.classList.remove("open");
      });
      modal.querySelector("[data-confirm]").addEventListener("click", () => {
        window.StacklyAuth.logout();
        modal.classList.remove("open");
        window.StacklyToast("Logged out", "You have been securely signed out of the demo.");
        setTimeout(() => {
          const inDashboard = /\/dashboard\//.test(location.pathname);
          window.location.href = inDashboard ? "../login.html" : "login.html";
        }, 900);
      });
    }

    triggers.forEach((t) =>
      t.addEventListener("click", (e) => {
        e.preventDefault();
        modal.classList.add("open");
      })
    );
  }

  /* ---------------- Notification read/unread toggles ---------------- */
  function initNotifications() {
    const list = document.querySelector("[data-notif-list]");
    if (list) {
      list.addEventListener("click", (e) => {
        const item = e.target.closest(".notif-item");
        if (!item) return;
        if (e.target.closest("[data-mark-read]")) item.classList.remove("unread");
        else if (e.target.closest("[data-mark-unread]")) item.classList.add("unread");
        else item.classList.toggle("unread");
        updateNotifBadge();
      });
    }
    const markAll = document.querySelector("[data-mark-all-read]");
    if (markAll) {
      markAll.addEventListener("click", () => {
        document.querySelectorAll(".notif-item.unread").forEach((n) => n.classList.remove("unread"));
        updateNotifBadge();
        window.StacklyToast("All caught up", "All notifications marked as read.");
      });
    }
    updateNotifBadge();
  }
  function updateNotifBadge() {
    const unread = document.querySelectorAll(".notif-item.unread").length;
    document.querySelectorAll("[data-notif-count]").forEach((el) => {
      el.textContent = unread;
      el.style.display = unread ? "grid" : "none";
    });
  }

  /* ---------------- Reading list builder ---------------- */
  function initReadingLists() {
    const tabs = document.querySelectorAll(".rl-tab");
    if (!tabs.length) return;
    const panels = document.querySelectorAll("[data-rl-panel]");

    tabs.forEach((tab) => {
      tab.addEventListener("click", () => {
        tabs.forEach((t) => t.classList.remove("active"));
        tab.classList.add("active");
        const target = tab.dataset.rlTab;
        panels.forEach((p) => {
          p.hidden = p.dataset.rlPanel !== target;
        });
      });
    });

    document.querySelectorAll("[data-rl-toggle]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const item = btn.closest(".rl-item");
        const done = item.classList.toggle("done");
        btn.innerHTML = done
          ? '<i class="fa-solid fa-rotate-left"></i>'
          : '<i class="fa-solid fa-check"></i>';
        btn.title = done ? "Mark as not read" : "Mark as completed";
      });
    });

    document.querySelectorAll("[data-rl-remove]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const item = btn.closest(".rl-item");
        item.style.transition = "opacity .3s, transform .3s";
        item.style.opacity = "0";
        item.style.transform = "translateX(30px)";
        setTimeout(() => item.remove(), 300);
        window.StacklyToast("Removed", "Book removed from this reading list.");
      });
    });

    const createForm = document.querySelector("[data-rl-create]");
    if (createForm) {
      createForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const input = createForm.querySelector("input");
        const name = input.value.trim();
        if (!name) return;
        window.StacklyToast("Reading list created", '"' + name + '" is ready to fill with books.');
        input.value = "";
      });
    }
  }

  /* ---------------- My Books: return & renew ---------------- */
  function initMyBooks() {
    document.querySelectorAll("[data-return]").forEach((btn) =>
      btn.addEventListener("click", () => {
        const row = btn.closest("[data-book-row]");
        const title = row ? row.dataset.bookTitle : "the book";
        btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Returning...';
        btn.disabled = true;
        setTimeout(() => {
          if (row) {
            const statusCell = row.querySelector("[data-status]");
            if (statusCell) statusCell.innerHTML = '<span class="status status--returned"><i class="fa-solid fa-check"></i> Returned</span>';
            const actions = row.querySelector("[data-actions]");
            if (actions) actions.innerHTML = '<span style="color:var(--muted);font-size:.82rem">Returned</span>';
          }
          window.StacklyToast("Book returned", '"' + title + '" has been returned. Thank you!');
        }, 900);
      })
    );
    document.querySelectorAll("[data-renew]").forEach((btn) =>
      btn.addEventListener("click", () => {
        const row = btn.closest("[data-book-row]");
        const title = row ? row.dataset.bookTitle : "the book";
        window.StacklyToast("Renewal requested", '"' + title + '" renewed for 14 more days (demo).');
      })
    );
  }

  /* ---------------- Reservations: cancel ---------------- */
  function initReservations() {
    document.querySelectorAll("[data-cancel-reservation]").forEach((btn) =>
      btn.addEventListener("click", () => {
        const row = btn.closest("tr");
        const title = row ? row.dataset.bookTitle : "the book";
        if (row) {
          const statusCell = row.querySelector("[data-status]");
          if (statusCell) statusCell.innerHTML = '<span class="status status--overdue"><i class="fa-solid fa-xmark"></i> Cancelled</span>';
          const actions = row.querySelector("[data-actions]");
          if (actions) actions.innerHTML = '<span style="color:var(--muted);font-size:.82rem">Cancelled</span>';
        }
        window.StacklyToast("Reservation cancelled", '"' + title + '" reservation cancelled.');
      })
    );
  }

  /* ---------------- Profile save ---------------- */
  function initProfile() {
    const form = document.querySelector("[data-profile-form]");
    if (form) {
      form.addEventListener("submit", (e) => {
        e.preventDefault();
        const nameInput = form.querySelector("[name=fullname]");
        const session = window.StacklyAuth.getSession() || {};
        if (nameInput && nameInput.value.trim()) session.name = nameInput.value.trim();
        session.loggedIn = true;
        window.StacklyAuth.saveSession(session);
        initUser();
        window.StacklyToast("Profile saved", "Your changes have been saved (demo).");
      });
    }
    const avatarInput = document.querySelector("[data-avatar-input]");
    if (avatarInput) {
      avatarInput.addEventListener("change", (e) => {
        const file = e.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = (ev) => {
          document.querySelectorAll("[data-user-avatar]").forEach((img) => (img.src = ev.target.result));
          window.StacklyToast("Photo updated", "Your new profile photo is ready.");
        };
        reader.readAsDataURL(file);
      });
    }
  }

  /* ---------------- Global dashboard search (filters visible cards/tables) ---------------- */
  function initGlobalSearch() {
    const input = document.querySelector("[data-global-search]");
    if (!input) return;
    input.addEventListener("input", () => {
      const q = input.value.trim().toLowerCase();
      document.querySelectorAll("[data-searchable]").forEach((el) => {
        const match = !q || el.textContent.toLowerCase().includes(q);
        el.style.display = match ? "" : "none";
      });
    });
  }

  /* ---------------- Progress bars animate in ---------------- */
  function initProgress() {
    document.querySelectorAll(".progress-fill[data-value]").forEach((el) => {
      setTimeout(() => { el.style.width = el.dataset.value + "%"; }, 200);
    });
  }

  document.addEventListener("DOMContentLoaded", function () {
    if (!window.StacklyAuth) return;
    initUser();
    initSidebar();
    initDropdowns();
    initLogout();
    initNotifications();
    initReadingLists();
    initMyBooks();
    initReservations();
    initProfile();
    initGlobalSearch();
    initProgress();
  });
})();
