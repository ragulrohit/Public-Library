/* ============================================================
   Stackly Public Library - Books data + browsing logic
   books.js
   ============================================================ */

(function () {
  "use strict";

  const FALLBACK_COVER =
    "https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&w=600&q=70";

  /* Copyright-safe real book covers via Open Library (ISBN based). */
  const cover = (isbn) => "https://covers.openlibrary.org/b/isbn/" + isbn + "-L.jpg";

  /* Covers are injected after main.js runs, so bind the fallback handler
     whenever a book grid or modal is rendered. */
  function bindImageFallbacks(root) {
    (root || document).querySelectorAll("img[data-fallback]").forEach((img) => {
      if (img.dataset.fallbackBound) return;
      img.dataset.fallbackBound = "1";
      img.addEventListener("error", function () {
        if (this.dataset.fallbackApplied) return;
        this.dataset.fallbackApplied = "1";
        this.src = this.dataset.fallback;
      });
    });
  }

  window.StacklyBindImageFallbacks = bindImageFallbacks;

  window.STACKLY_BOOKS = [
    { id: 1, title: "The Great Gatsby", author: "F. Scott Fitzgerald", category: "Classic", year: 1925, available: true, rating: 4.4, pages: 180, isbn: "9780743273565", copies: 5, shelf: "CL-102", desc: "A vivid portrait of the Jazz Age following the mysterious millionaire Jay Gatsby and his obsession with Daisy Buchanan." },
    { id: 2, title: "1984", author: "George Orwell", category: "Dystopian", year: 1949, available: true, rating: 4.7, pages: 328, isbn: "9780451524935", copies: 7, shelf: "DY-210", desc: "A chilling dystopia about a totalitarian regime that surveils every move of its citizens and rewrites history." },
    { id: 3, title: "To Kill a Mockingbird", author: "Harper Lee", category: "Classic", year: 1960, available: false, rating: 4.8, pages: 281, isbn: "9780061120084", copies: 3, shelf: "CL-118", desc: "Through the eyes of Scout Finch, a story of racial injustice and moral growth in the American South." },
    { id: 4, title: "Pride and Prejudice", author: "Jane Austen", category: "Romance", year: 1813, available: true, rating: 4.6, pages: 279, isbn: "9780141439518", copies: 6, shelf: "RO-305", desc: "Elizabeth Bennet navigates love, class and family in one of literature's most beloved romances." },
    { id: 5, title: "The Hobbit", author: "J. R. R. Tolkien", category: "Fantasy", year: 1937, available: true, rating: 4.7, pages: 310, isbn: "9780547928227", copies: 8, shelf: "FA-401", desc: "Bilbo Baggins is swept into an epic quest to reclaim treasure guarded by the dragon Smaug." },
    { id: 6, title: "The Catcher in the Rye", author: "J. D. Salinger", category: "Classic", year: 1951, available: false, rating: 4.2, pages: 234, isbn: "9780316769488", copies: 2, shelf: "CL-124", desc: "Holden Caulfield's restless journey through New York as he wrestles with growing up." },
    { id: 7, title: "Harry Potter and the Sorcerer's Stone", author: "J. K. Rowling", category: "Fantasy", year: 1997, available: true, rating: 4.9, pages: 309, isbn: "9780590353427", copies: 10, shelf: "FA-305", desc: "An orphan boy discovers he is a wizard and begins his first year at Hogwarts School of Witchcraft and Wizardry." },
    { id: 8, title: "The Alchemist", author: "Paulo Coelho", category: "Fiction", year: 1988, available: true, rating: 4.5, pages: 208, isbn: "9780061122415", copies: 5, shelf: "FI-220", desc: "A shepherd's journey to find treasure teaches him to follow his dreams and listen to his heart." },
    { id: 9, title: "Sapiens", author: "Yuval Noah Harari", category: "History", year: 2011, available: true, rating: 4.6, pages: 443, isbn: "9780062316097", copies: 4, shelf: "HI-510", desc: "A sweeping history of humankind, from the Stone Age to the digital revolution." },
    { id: 10, title: "Educated", author: "Tara Westover", category: "Memoir", year: 2018, available: false, rating: 4.7, pages: 334, isbn: "9780399590504", copies: 3, shelf: "ME-330", desc: "A memoir about a girl who, kept out of school, leaves her survivalist family to earn a doctorate." },
    { id: 11, title: "The Midnight Library", author: "Matt Haig", category: "Fiction", year: 2020, available: true, rating: 4.5, pages: 304, isbn: "9780525559474", copies: 6, shelf: "FI-241", desc: "Between life and death lies a library where every book offers a chance to try another life." },
    { id: 12, title: "Atomic Habits", author: "James Clear", category: "Self-Help", year: 2018, available: true, rating: 4.8, pages: 320, isbn: "9780735211292", copies: 9, shelf: "SH-140", desc: "A practical guide to building good habits and breaking bad ones through tiny changes." },
    { id: 13, title: "Becoming", author: "Michelle Obama", category: "Memoir", year: 2018, available: true, rating: 4.8, pages: 448, isbn: "9781524763138", copies: 5, shelf: "ME-341", desc: "The intimate memoir of the former First Lady, tracing her journey from Chicago to the White House." },
    { id: 14, title: "The Silent Patient", author: "Alex Michaelides", category: "Thriller", year: 2019, available: false, rating: 4.3, pages: 336, isbn: "9781250301697", copies: 2, shelf: "TH-620", desc: "A psychotherapist becomes obsessed with uncovering why a famous painter stopped speaking." },
    { id: 15, title: "Where the Crawdads Sing", author: "Delia Owens", category: "Fiction", year: 2018, available: true, rating: 4.6, pages: 384, isbn: "9780735219090", copies: 7, shelf: "FI-256", desc: "A murder mystery and coming-of-age tale set in the marshes of North Carolina." },
    { id: 16, title: "Dune", author: "Frank Herbert", category: "Science Fiction", year: 1965, available: true, rating: 4.7, pages: 688, isbn: "9780441013593", copies: 5, shelf: "SF-710", desc: "A grand saga of politics, religion and ecology on the desert planet Arrakis." },
    { id: 17, title: "The Song of Achilles", author: "Madeline Miller", category: "Fantasy", year: 2011, available: true, rating: 4.6, pages: 416, isbn: "9780062060624", copies: 4, shelf: "FA-360", desc: "A retelling of the Iliad, following the bond between Achilles and Patroclus." },
    { id: 18, title: "Project Hail Mary", author: "Andy Weir", category: "Science Fiction", year: 2021, available: false, rating: 4.8, pages: 496, isbn: "9780593135204", copies: 3, shelf: "SF-725", desc: "A lone astronaut must save humanity in this smart, funny sci-fi adventure." },
    { id: 19, title: "Klara and the Sun", author: "Kazuo Ishiguro", category: "Science Fiction", year: 2021, available: true, rating: 4.1, pages: 320, isbn: "9780593318171", copies: 4, shelf: "SF-733", desc: "An artificial friend observes the world and the humans she is meant to serve." },
    { id: 20, title: "A Brief History of Time", author: "Stephen Hawking", category: "Science", year: 1988, available: true, rating: 4.6, pages: 212, isbn: "9780553380163", copies: 4, shelf: "SC-802", desc: "A landmark exploration of the universe, from the Big Bang to black holes." },
    { id: 21, title: "Thinking, Fast and Slow", author: "Daniel Kahneman", category: "Psychology", year: 2011, available: true, rating: 4.5, pages: 499, isbn: "9780374533557", copies: 3, shelf: "PS-450", desc: "The two systems that drive the way we think, and how they shape our decisions." },
    { id: 22, title: "The Night Circus", author: "Erin Morgenstern", category: "Fantasy", year: 2011, available: false, rating: 4.4, pages: 512, isbn: "9780307744432", copies: 2, shelf: "FA-372", desc: "A magical competition unfolds within a mysterious circus that appears without warning." },
    { id: 23, title: "Little Women", author: "Louisa May Alcott", category: "Classic", year: 1868, available: true, rating: 4.6, pages: 449, isbn: "9780142408766", copies: 6, shelf: "CL-143", desc: "The March sisters grow up together, navigating love, loss and ambition." },
    { id: 24, title: "A Promised Land", author: "Barack Obama", category: "Memoir", year: 2020, available: true, rating: 4.7, pages: 768, isbn: "9781524763169", copies: 3, shelf: "ME-355", desc: "The first volume of Barack Obama's presidential memoirs, reflecting on history in the making." },
  ];

  window.STACKLY_COVER = cover;
  window.STACKLY_FALLBACK_COVER = FALLBACK_COVER;

  window.getBookById = function (id) {
    return window.STACKLY_BOOKS.find((b) => b.id === Number(id));
  };

  window.renderBookCard = function (b) {
    return (
      '<article class="book-card reveal">' +
      '<div class="book-card__cover">' +
      '<span class="book-card__tag">' + b.category + "</span>" +
      '<img src="' + cover(b.isbn) + '" alt="Cover of ' + b.title + ' by ' + b.author + '" ' +
      'loading="lazy" data-fallback="' + FALLBACK_COVER + '">' +
      "</div>" +
      '<div class="book-card__body">' +
      '<h3 class="book-card__title">' + b.title + "</h3>" +
      '<p class="book-card__author">by ' + b.author + "</p>" +
      '<div class="book-card__meta">' +
      '<span class="badge ' + (b.available ? "badge--available" : "badge--out") + '">' +
      '<i class="fa-solid fa-' + (b.available ? "circle-check" : "clock") + '"></i> ' +
      (b.available ? "Available" : "Checked out") + "</span>" +
      '<span style="font-size:.8rem;color:var(--muted)"><i class="fa-solid fa-star" style="color:#ffb020"></i> ' + b.rating.toFixed(1) + "</span>" +
      "</div>" +
      '<div class="book-card__actions">' +
      '<button class="btn btn--sm btn--ghost" data-details="' + b.id + '"><i class="fa-solid fa-eye"></i> Details</button>' +
      '<button class="btn btn--sm" data-borrow="' + b.id + '"' + (b.available ? "" : ' disabled title="Currently checked out"') + '><i class="fa-solid fa-book-open-reader"></i> Borrow</button>' +
      "</div>" +
      "</div>" +
      "</article>"
    );
  };

  /* ---------------- Book details modal ---------------- */
  window.openBookModal = function (id) {
    const b = getBookById(id);
    if (!b) return;
    let modal = document.getElementById("bookModal");
    if (!modal) {
      modal = document.createElement("div");
      modal.id = "bookModal";
      modal.className = "modal-overlay";
      modal.innerHTML =
        '<div class="modal" role="dialog" aria-modal="true" aria-labelledby="bookModalTitle">' +
        '<div class="modal__head"><h3 id="bookModalTitle">Book Details</h3>' +
        '<button class="modal__close" aria-label="Close"><i class="fa-solid fa-xmark"></i></button></div>' +
        '<div class="modal__body" id="bookModalBody"></div>' +
        '<div class="modal__foot"><button class="btn btn--ghost" data-close-modal>Close</button>' +
        '<button class="btn" id="bookModalBorrow"><i class="fa-solid fa-book-open-reader"></i> Borrow this book</button></div>' +
        "</div>";
      document.body.appendChild(modal);
      modal.querySelectorAll(".modal__close, [data-close-modal]").forEach((el) =>
        el.addEventListener("click", () => modal.classList.remove("open"))
      );
      modal.addEventListener("click", (e) => {
        if (e.target === modal) modal.classList.remove("open");
      });
    }
    modal.querySelector("#bookModalBody").innerHTML =
      '<div class="detail-grid">' +
      '<img src="' + cover(b.isbn) + '" alt="Cover of ' + b.title + '" data-fallback="' + FALLBACK_COVER + '">' +
      "<div>" +
      "<h3 style='margin-bottom:4px'>" + b.title + "</h3>" +
      '<p style="color:var(--muted);margin-bottom:14px">by ' + b.author + "</p>" +
      "<p>" + b.desc + "</p>" +
      '<dl class="detail-list">' +
      "<dt>Category</dt><dd>" + b.category + "</dd>" +
      "<dt>Published</dt><dd>" + b.year + "</dd>" +
      "<dt>Pages</dt><dd>" + b.pages + "</dd>" +
      "<dt>ISBN</dt><dd>" + b.isbn + "</dd>" +
      "<dt>Rating</dt><dd>" + b.rating.toFixed(1) + " / 5</dd>" +
      "<dt>Copies</dt><dd>" + b.copies + " total</dd>" +
      "<dt>Shelf</dt><dd>" + b.shelf + "</dd>" +
      "<dt>Status</dt><dd>" +
      '<span class="badge ' + (b.available ? "badge--available" : "badge--out") + '">' +
      (b.available ? "Available" : "Checked out") + "</span></dd>" +
      "</dl></div></div>";
    bindImageFallbacks(modal);
    const borrowBtn = modal.querySelector("#bookModalBorrow");
    borrowBtn.disabled = !b.available;
    borrowBtn.style.opacity = b.available ? "1" : "0.5";
    borrowBtn.onclick = function () {
      modal.classList.remove("open");
      window.StacklyToast("Borrow requested", '"' + b.title + '" added to your borrowing queue (demo).');
    };
    modal.classList.add("open");
  };

  /* ---------------- Browse page controller ---------------- */
  function initBrowse() {
    const grid = document.getElementById("bookGrid");
    if (!grid) return;

    const searchInput = document.getElementById("bookSearch");
    const catFilter = document.getElementById("catFilter");
    const availFilter = document.getElementById("availFilter");
    const sortSelect = document.getElementById("sortSelect");
    const resultCount = document.getElementById("resultCount");
    const pagination = document.getElementById("pagination");
    const perPage = 8;
    let currentPage = 1;

    // Populate categories dynamically
    if (catFilter && catFilter.options.length <= 1) {
      const cats = [...new Set(window.STACKLY_BOOKS.map((b) => b.category))].sort();
      cats.forEach((c) => {
        const o = document.createElement("option");
        o.value = c;
        o.textContent = c;
        catFilter.appendChild(o);
      });
    }

    // Deep-link support: books.html?category=Fiction&availability=available&q=dune
    try {
      const params = new URLSearchParams(location.search);
      const wantCat = params.get("category");
      const q = params.get("q");
      const av = params.get("availability");
      if (wantCat && catFilter) {
        const match = [...catFilter.options].find(
          (o) => o.value.toLowerCase() === wantCat.toLowerCase()
        );
        if (match) catFilter.value = match.value;
      }
      if (q && searchInput) searchInput.value = q;
      if (av && availFilter) availFilter.value = av;
    } catch (e) {}

    function apply() {
      let list = window.STACKLY_BOOKS.slice();
      const q = (searchInput ? searchInput.value : "").trim().toLowerCase();
      const cat = catFilter ? catFilter.value : "all";
      const av = availFilter ? availFilter.value : "all";
      const sort = sortSelect ? sortSelect.value : "default";

      if (q) list = list.filter((b) => b.title.toLowerCase().includes(q) || b.author.toLowerCase().includes(q));
      if (cat !== "all") list = list.filter((b) => b.category === cat);
      if (av === "available") list = list.filter((b) => b.available);
      if (av === "out") list = list.filter((b) => !b.available);

      switch (sort) {
        case "title-asc": list.sort((a, b) => a.title.localeCompare(b.title)); break;
        case "title-desc": list.sort((a, b) => b.title.localeCompare(a.title)); break;
        case "year-new": list.sort((a, b) => b.year - a.year); break;
        case "year-old": list.sort((a, b) => a.year - b.year); break;
        case "rating": list.sort((a, b) => b.rating - a.rating); break;
        default: break;
      }
      return list;
    }

    function render() {
      const list = apply();
      const totalPages = Math.max(1, Math.ceil(list.length / perPage));
      if (currentPage > totalPages) currentPage = totalPages;
      const start = (currentPage - 1) * perPage;
      const pageItems = list.slice(start, start + perPage);

      if (resultCount) {
        resultCount.textContent =
          list.length + (list.length === 1 ? " book" : " books") + " found";
      }

      if (!list.length) {
        grid.innerHTML =
          '<div class="empty-state" style="grid-column:1/-1"><i class="fa-solid fa-magnifying-glass"></i>' +
          "<h3>No books found</h3><p>Try a different search term or clear your filters.</p></div>";
      } else {
        grid.innerHTML = pageItems.map(window.renderBookCard).join("");
        bindImageFallbacks(grid);
        // Reveal immediately for paginated content
        grid.querySelectorAll(".reveal").forEach((el) => el.classList.add("visible"));
      }

      // Pagination
      if (pagination) {
        if (list.length <= perPage) {
          pagination.innerHTML = "";
        } else {
          let html = '<button data-page="prev"' + (currentPage === 1 ? " disabled" : "") + '><i class="fa-solid fa-chevron-left"></i></button>';
          for (let i = 1; i <= totalPages; i++) {
            html += '<button data-page="' + i + '"' + (i === currentPage ? ' class="active"' : "") + ">" + i + "</button>";
          }
          html += '<button data-page="next"' + (currentPage === totalPages ? " disabled" : "") + '><i class="fa-solid fa-chevron-right"></i></button>';
          pagination.innerHTML = html;
        }
      }
    }

    function bindGrid() {
      grid.querySelectorAll("[data-details]").forEach((btn) =>
        btn.addEventListener("click", () => window.openBookModal(btn.dataset.details))
      );
      grid.querySelectorAll("[data-borrow]").forEach((btn) =>
        btn.addEventListener("click", () => {
          const b = getBookById(btn.dataset.borrow);
          window.StacklyToast("Borrow requested", '"' + b.title + '" added to your borrowing queue (demo).');
        })
      );
    }

    grid.addEventListener("click", (e) => {
      const d = e.target.closest("[data-details]");
      const br = e.target.closest("[data-borrow]");
      if (d) window.openBookModal(d.dataset.details);
      if (br) {
        const b = getBookById(br.dataset.borrow);
        if (b) window.StacklyToast("Borrow requested", '"' + b.title + '" added to your borrowing queue (demo).');
      }
    });

    if (pagination) {
      pagination.addEventListener("click", (e) => {
        const btn = e.target.closest("button[data-page]");
        if (!btn || btn.disabled) return;
        const list = apply();
        const totalPages = Math.max(1, Math.ceil(list.length / perPage));
        const p = btn.dataset.page;
        if (p === "prev") currentPage = Math.max(1, currentPage - 1);
        else if (p === "next") currentPage = Math.min(totalPages, currentPage + 1);
        else currentPage = parseInt(p, 10);
        render();
        const top = grid.getBoundingClientRect().top + window.scrollY - 120;
        window.scrollTo({ top, behavior: "smooth" });
      });
    }

    ["input", "change"].forEach((evt) => {
      [searchInput, catFilter, availFilter, sortSelect].forEach((el) => {
        if (el) el.addEventListener(evt, () => {
          if (el === searchInput) currentPage = 1;
          render();
        });
      });
    });

    const resetBtn = document.getElementById("resetFilters");
    if (resetBtn) {
      resetBtn.addEventListener("click", () => {
        if (searchInput) searchInput.value = "";
        if (catFilter) catFilter.value = "all";
        if (availFilter) availFilter.value = "all";
        if (sortSelect) sortSelect.value = "default";
        currentPage = 1;
        render();
      });
    }

    render();
  }

  /* ---------------- Dashboard "Browse Books" reuses the same grid ---------------- */
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initBrowse);
  } else {
    initBrowse();
  }
})();
