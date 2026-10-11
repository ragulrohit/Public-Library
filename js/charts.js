/* ============================================================
   Stackly Public Library - Charts (Chart.js)
   charts.js
   Uses sample data for demonstration only.
   ============================================================ */

(function () {
  "use strict";

  const PALETTE = {
    purple: "#6c3fc5",
    purpleLight: "#9d7ae8",
    blue: "#2b6cb0",
    blueLight: "#5b9bd5",
    teal: "#0fb5a5",
    tealLight: "#4fd8cb",
    orange: "#f5822b",
    orangeLight: "#ffab5e",
    pink: "#e94f9b",
    line: "#e7e9f2",
    ink: "#1f2437",
    muted: "#7a8199",
  };

  if (typeof Chart === "undefined") return;

  Chart.defaults.font.family = "'Poppins', sans-serif";
  Chart.defaults.color = PALETTE.muted;
  Chart.defaults.plugins.legend.labels.usePointStyle = true;
  Chart.defaults.plugins.legend.labels.boxWidth = 10;
  Chart.defaults.plugins.legend.labels.padding = 16;

  const charts = [];
  const reduceMotion =
    window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------------- Pie: Borrowing by category ---------------- */
  const pieEl = document.getElementById("categoryPie");
  if (pieEl) {
    const pieLabels = ["Fiction", "Fantasy", "Science Fiction", "Classic", "History", "Self-Help"];
    const counts = [34, 22, 18, 12, 8, 6];

    charts.push(
      new Chart(pieEl, {
        type: "doughnut",
        data: {
          labels: pieLabels,
          datasets: [
            {
              data: counts,
              backgroundColor: [
                PALETTE.purple, PALETTE.blue, PALETTE.teal,
                PALETTE.orange, PALETTE.pink, PALETTE.purpleLight,
              ],
              borderWidth: 3,
              borderColor: "#fff",
              hoverOffset: 10,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          cutout: "62%",
          animation: reduceMotion ? false : { animateScale: true, duration: 1100 },
          plugins: {
            legend: { display: true, position: "bottom" },
            tooltip: {
              callbacks: {
                label: (ctx) => " " + ctx.label + ": " + ctx.parsed + "% of borrowings",
              },
            },
          },
        },
      })
    );
  }

  /* ---------------- Bar: Monthly reading activity ---------------- */
  const barEl = document.getElementById("monthlyBar");
  if (barEl) {
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const borrowed = [8, 11, 9, 14, 12, 17, 15, 19, 16, 21, 18, 23];
    const returned = [6, 9, 8, 12, 11, 14, 13, 17, 14, 18, 16, 20];

    charts.push(
      new Chart(barEl, {
        type: "bar",
        data: {
          labels: months,
          datasets: [
            {
              label: "Books Borrowed",
              data: borrowed,
              backgroundColor: PALETTE.purple,
              borderRadius: 8,
              maxBarThickness: 22,
            },
            {
              label: "Books Returned",
              data: returned,
              backgroundColor: PALETTE.teal,
              borderRadius: 8,
              maxBarThickness: 22,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          animation: reduceMotion ? false : { duration: 1100 },
          plugins: { legend: { position: "top", align: "end" } },
          scales: {
            x: { grid: { display: false }, border: { display: false } },
            y: {
              beginAtZero: true,
              grid: { color: PALETTE.line },
              border: { display: false },
              ticks: { stepSize: 5 },
            },
          },
        },
      })
    );
  }

  /* ---------------- Line: Reading progress over time ---------------- */
  const lineEl = document.getElementById("readingLine");
  if (lineEl) {
    const ctx = lineEl.getContext("2d");
    const grad = ctx.createLinearGradient(0, 0, 0, 260);
    grad.addColorStop(0, "rgba(108,63,197,0.30)");
    grad.addColorStop(1, "rgba(108,63,197,0)");

    charts.push(
      new Chart(lineEl, {
        type: "line",
        data: {
          labels: ["Wk 1", "Wk 2", "Wk 3", "Wk 4", "Wk 5", "Wk 6", "Wk 7", "Wk 8"],
          datasets: [
            {
              label: "Pages read",
              data: [120, 260, 210, 380, 340, 460, 420, 560],
              borderColor: PALETTE.purple,
              backgroundColor: grad,
              fill: true,
              tension: 0.4,
              borderWidth: 3,
              pointBackgroundColor: "#fff",
              pointBorderColor: PALETTE.purple,
              pointBorderWidth: 3,
              pointRadius: 5,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          animation: reduceMotion ? false : { duration: 1200 },
          plugins: { legend: { display: false } },
          scales: {
            x: { grid: { display: false }, border: { display: false } },
            y: { beginAtZero: true, grid: { color: PALETTE.line }, border: { display: false } },
          },
        },
      })
    );
  }

  /* ---------------- Small doughnut: reservation status ---------------- */
  const statusEl = document.getElementById("statusDoughnut");
  if (statusEl) {
    charts.push(
      new Chart(statusEl, {
        type: "doughnut",
        data: {
          labels: ["Ready", "Pending", "Completed"],
          datasets: [
            {
              data: [4, 3, 7],
              backgroundColor: [PALETTE.purple, PALETTE.orange, PALETTE.teal],
              borderWidth: 3,
              borderColor: "#fff",
              hoverOffset: 8,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          cutout: "66%",
          animation: reduceMotion ? false : { duration: 1000 },
          plugins: { legend: { position: "bottom" } },
        },
      })
    );
  }

  /* Keep charts responsive on container resize */
  if ("ResizeObserver" in window) {
    const ro = new ResizeObserver(() => charts.forEach((c) => c.resize()));
    document.querySelectorAll(".chart-wrap, .chart-wrap--sm").forEach((el) => ro.observe(el));
  }
})();
