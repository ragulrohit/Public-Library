/* ============================================================
   Stackly Public Library - Demo authentication
   auth.js

   NOTE: This is a FRONT-END DEMO ONLY. Credentials and the
   "session" live in localStorage and are NOT secure. A real
   deployment must authenticate against a secure backend.
   ============================================================ */

(function () {
  "use strict";

  const SESSION_KEY = "stackly_session";
  const USERS_KEY = "stackly_users";

  window.StacklyAuth = {
    /* Persist a demo session object */
    saveSession(user) {
      try {
        localStorage.setItem(SESSION_KEY, JSON.stringify(user));
      } catch (e) {
        /* localStorage may be blocked; fail silently in demo */
      }
    },

    getSession() {
      try {
        return JSON.parse(localStorage.getItem(SESSION_KEY) || "null");
      } catch (e) {
        return null;
      }
    },

    isLoggedIn() {
      const s = this.getSession();
      return !!(s && s.loggedIn);
    },

    logout() {
      try {
        localStorage.removeItem(SESSION_KEY);
      } catch (e) {}
    },

    /* Extremely simple demo "user store" (NOT secure) */
    getUsers() {
      try {
        return JSON.parse(localStorage.getItem(USERS_KEY) || "[]");
      } catch (e) {
        return [];
      }
    },

    addUser(user) {
      const users = this.getUsers();
      users.push(user);
      try {
        localStorage.setItem(USERS_KEY, JSON.stringify(users));
      } catch (e) {}
    },

    /* Derive a display name from an email: rohit@gmail.com -> "rohit" */
    nameFromEmail(email) {
      if (!email) return "Reader";
      const n = email.split("@")[0];
      return n.charAt(0).toUpperCase() + n.slice(1);
    },
  };

  /* ---------------- helpers ---------------- */
  const emailOk = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
  const phoneOk = (v) => /^[+()\d][\d\s()+-]{7,}$/.test(v);

  function setError(input, msg) {
    if (!input) return;
    input.classList.add("is-invalid");
    const group = input.closest(".form-group");
    let err = group ? group.querySelector(".form-error") : null;
    if (!err && group) {
      err = document.createElement("div");
      err.className = "form-error";
      group.appendChild(err);
    }
    if (err) err.textContent = msg;
  }
  function clearError(input) {
    if (!input) return;
    input.classList.remove("is-invalid");
    const group = input.closest(".form-group");
    const err = group ? group.querySelector(".form-error") : null;
    if (err) err.textContent = "";
  }

  /* Password visibility toggles (works for every .toggle-pass) */
  document.querySelectorAll(".toggle-pass").forEach((btn) => {
    btn.addEventListener("click", () => {
      const input = btn.parentElement.querySelector("input");
      if (!input) return;
      const show = input.type === "password";
      input.type = show ? "text" : "password";
      const icon = btn.querySelector("i");
      if (icon) icon.className = show ? "fa-solid fa-eye-slash" : "fa-solid fa-eye";
      btn.setAttribute("aria-label", show ? "Hide password" : "Show password");
    });
  });

  /* Live password strength meter */
  const passStrength = document.querySelector("[data-strength]");
  if (passStrength) {
    const input = document.getElementById("signupPassword");
    const bar = passStrength.querySelector(".strength__bar");
    const label = passStrength.querySelector(".strength__label");
    input.addEventListener("input", () => {
      const v = input.value;
      let score = 0;
      if (v.length >= 6) score++;
      if (v.length >= 10) score++;
      if (/[A-Z]/.test(v) && /[a-z]/.test(v)) score++;
      if (/\d/.test(v)) score++;
      if (/[^A-Za-z0-9]/.test(v)) score++;
      const pct = Math.min(score / 5, 1) * 100;
      const colors = ["#e04b6b", "#f5822b", "#ffb020", "#2b6cb0", "#0a8c5f"];
      bar.style.width = pct + "%";
      bar.style.background = colors[Math.max(0, score - 1)] || "#e04b6b";
      label.textContent = !v
        ? "Use 8+ characters with a mix of letters, numbers and symbols."
        : score <= 2
        ? "Weak password"
        : score === 3
        ? "Fair password"
        : score === 4
        ? "Good password"
        : "Strong password";
    });
  }

  /* ---------------- LOGIN ---------------- */
  const loginForm = document.getElementById("loginForm");
  if (loginForm) {
    loginForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const email = document.getElementById("loginEmail");
      const pass = document.getElementById("loginPassword");
      const role = document.getElementById("loginRole");
      let valid = true;

      clearError(email); clearError(pass); clearError(role);

      if (!email.value.trim()) { setError(email, "Email is required."); valid = false; }
      else if (!emailOk(email.value.trim())) { setError(email, "Enter a valid email address."); valid = false; }

      if (!pass.value) { setError(pass, "Password is required."); valid = false; }
      else if (pass.value.length < 6) { setError(pass, "Password must be at least 6 characters."); valid = false; }

      if (!role.value) { setError(role, "Please choose a role."); valid = false; }

      if (!valid) {
        window.StacklyToast("Check your details", "Please fix the highlighted fields.", "error");
        return;
      }

      const user = {
        email: email.value.trim().toLowerCase(),
        name: window.StacklyAuth.nameFromEmail(email.value.trim()),
        role: role.options[role.selectedIndex].text,
        loggedIn: true,
        since: new Date().toISOString(),
      };
      if (document.getElementById("rememberMe") && document.getElementById("rememberMe").checked) {
        try { localStorage.setItem("stackly_remember", user.email); } catch (err) {}
      }
      window.StacklyAuth.saveSession(user);

      window.StacklyToast("Welcome back, " + user.name + "!", "Login successful. Opening your dashboard...");
      const btn = loginForm.querySelector("button[type=submit]");
      if (btn) { btn.disabled = true; btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Signing in...'; }
      setTimeout(() => { window.location.href = "dashboard/overview.html"; }, 1200);
    });
  }

  /* ---------------- SIGN UP ---------------- */
  const signupForm = document.getElementById("signupForm");
  if (signupForm) {
    signupForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const name = document.getElementById("signupName");
      const email = document.getElementById("signupEmail");
      const phone = document.getElementById("signupPhone");
      const pass = document.getElementById("signupPassword");
      const confirm = document.getElementById("signupConfirm");
      const role = document.getElementById("signupRole");
      const terms = document.getElementById("agreeTerms");
      let valid = true;

      [name, email, phone, pass, confirm, role].forEach(clearError);

      if (!name.value.trim() || name.value.trim().length < 2) { setError(name, "Please enter your full name."); valid = false; }
      if (!emailOk(email.value.trim())) { setError(email, "Enter a valid email address."); valid = false; }
      if (!phoneOk(phone.value.trim())) { setError(phone, "Enter a valid phone number."); valid = false; }
      if (pass.value.length < 6) { setError(pass, "Password must be at least 6 characters."); valid = false; }
      if (pass.value !== confirm.value) { setError(confirm, "Passwords do not match."); valid = false; }
      if (!role.value) { setError(role, "Please choose a role."); valid = false; }

      const termsGroup = terms.closest(".form-group") || terms.parentElement;
      let termsErr = termsGroup.querySelector(".terms-error");
      if (!terms.checked) {
        if (!termsErr) {
          termsErr = document.createElement("div");
          termsErr.className = "form-error terms-error";
          termsGroup.appendChild(termsErr);
        }
        termsErr.textContent = "You must agree to the Terms and Conditions.";
        valid = false;
      } else if (termsErr) {
        termsErr.textContent = "";
      }

      if (!valid) {
        window.StacklyToast("Check your details", "Please fix the highlighted fields.", "error");
        return;
      }

      const user = {
        name: name.value.trim(),
        email: email.value.trim().toLowerCase(),
        phone: phone.value.trim(),
        role: role.options[role.selectedIndex].text,
      };
      window.StacklyAuth.addUser(user);
      window.StacklyAuth.saveSession({
        email: user.email,
        name: user.name,
        role: user.role,
        loggedIn: true,
        since: new Date().toISOString(),
      });

      window.StacklyToast("Account created!", "Welcome to Stackly, " + user.name + "! Please log in to continue.");
      const btn = signupForm.querySelector("button[type=submit]");
      if (btn) { btn.disabled = true; btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Creating account...'; }
      setTimeout(() => { window.location.href = "login.html"; }, 1200);
    });
  }

  /* ---------------- Route guard for dashboard pages ----------------
     Pages inside /dashboard/ include this script and call the guard
     by setting data-guard on <body>. */
  if (document.body && document.body.hasAttribute("data-guard")) {
    if (!window.StacklyAuth.isLoggedIn()) {
      // send to login relative to the dashboard folder
      window.location.replace("../login.html");
    }
  }
})();
