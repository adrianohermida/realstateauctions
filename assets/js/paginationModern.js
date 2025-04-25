
// paginationModern.js
document.addEventListener("DOMContentLoaded", () => {
  window.setupPagination = function ({ totalItems, itemsPerPage = 6, onPageChange }) {
    const paginationContainer = document.getElementById("pagination");
    if (!paginationContainer) return;

    const totalPages = Math.ceil(totalItems / itemsPerPage);
    let currentPage = 1;

    function renderPagination() {
      paginationContainer.innerHTML = "";

      const nav = document.createElement("nav");
      nav.className = "pagination-modern d-flex justify-content-center flex-wrap align-items-center";

      const createButton = (label, disabled, callback) => {
        const btn = document.createElement("button");
        btn.className = "btn btn-sm btn-light m-1";
        btn.textContent = label;
        if (disabled) btn.disabled = true;
        btn.addEventListener("click", callback);
        return btn;
      };

      nav.appendChild(createButton("«", currentPage === 1, () => goToPage(1)));
      nav.appendChild(createButton("‹", currentPage === 1, () => goToPage(currentPage - 1)));

      const startPage = Math.max(1, currentPage - 2);
      const endPage = Math.min(totalPages, currentPage + 2);

      for (let i = startPage; i <= endPage; i++) {
        const btn = createButton(i, false, () => goToPage(i));
        if (i === currentPage) btn.classList.add("btn-primary", "text-white");
        nav.appendChild(btn);
      }

      nav.appendChild(createButton("›", currentPage === totalPages, () => goToPage(currentPage + 1)));
      nav.appendChild(createButton("»", currentPage === totalPages, () => goToPage(totalPages)));

      const inputGroup = document.createElement("div");
      inputGroup.className = "input-group input-group-sm mx-2";
      inputGroup.style.width = "100px";
      inputGroup.innerHTML = `
        <input type="number" class="form-control" id="goto-page" min="1" max="${totalPages}" placeholder="#">
        <button class="btn btn-outline-secondary" id="goto-btn">Go</button>
      `;
      nav.appendChild(inputGroup);

      paginationContainer.appendChild(nav);

      document.getElementById("goto-btn").addEventListener("click", () => {
        const value = parseInt(document.getElementById("goto-page").value, 10);
        if (!isNaN(value) && value >= 1 && value <= totalPages) {
          goToPage(value);
        }
      });
    }

    function goToPage(page) {
      currentPage = page;
      onPageChange(currentPage);
      renderPagination();
    }

    renderPagination();
  };
});
