
document.addEventListener("DOMContentLoaded", function () {
  const container = document.getElementById("properties-container");
  const paginationContainer = document.getElementById("pagination");
  const itemsPerPage = 6;
  let currentPage = 1;
  let allProperties = [];

  async function fetchJsonFiles() {
    let index = 1;
    while (true) {
      const fileName = `/data/property_${index}_to_${index + 49}.json`;
      try {
        const response = await fetch(fileName);
        if (!response.ok) throw new Error("Not found");
        const data = await response.json();
        allProperties = allProperties.concat(data);
        index += 50;
      } catch (e) {
        break;
      }
    }
    renderPage(currentPage);
    renderPagination();
  }

  function renderPage(page) {
    container.innerHTML = "";
    const start = (page - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    const sliced = allProperties.slice(start, end);
    sliced.forEach(p => {
      const card = document.createElement("div");
      card.className = "col-md-4 mb-4";
      card.innerHTML = `
        <div class="card-box-a card-shadow">
          <div class="img-box-a">
            <img src="${p.images?.[0] || '/assets/img/default.jpg'}" class="img-a img-fluid" alt="${p.title}">
          </div>
          <div class="card-overlay">
            <div class="card-overlay-a-content">
              <div class="card-header-a">
                <h2 class="card-title-a">
                  <a href="property-single.html?id=${p.id}">${p.title}</a>
                </h2>
              </div>
              <div class="card-body-a">
                <div class="price-box d-flex">
                  <span class="price-a">PRICE | R$ ${p.minimumBid?.toLocaleString("pt-BR") || "—"}</span>
                </div>
                <a href="property-single.html?id=${p.id}" class="link-a">Click here to view <span class="bi bi-chevron-right"></span></a>
              </div>
            </div>
          </div>
        </div>`;
      container.appendChild(card);
    });
  }

  function renderPagination() {
    paginationContainer.innerHTML = "";
    const totalPages = Math.ceil(allProperties.length / itemsPerPage);
    const fragment = document.createDocumentFragment();

    function addPageButton(label, pageNum, isActive = false, isDisabled = false) {
      const li = document.createElement("li");
      li.className = `page-item ${isActive ? "active" : ""} ${isDisabled ? "disabled" : ""}`;
      const a = document.createElement("a");
      a.className = "page-link";
      a.href = "#";
      a.textContent = label;
      a.addEventListener("click", (e) => {
        e.preventDefault();
        if (!isDisabled) {
          currentPage = pageNum;
          renderPage(currentPage);
          renderPagination();
        }
      });
      li.appendChild(a);
      fragment.appendChild(li);
    }

    if (totalPages <= 1) return;

    addPageButton("«", 1, false, currentPage === 1);
    addPageButton("‹", currentPage - 1, false, currentPage === 1);

    const delta = 2;
    const range = [];
    for (let i = Math.max(2, currentPage - delta); i <= Math.min(totalPages - 1, currentPage + delta); i++) {
      range.push(i);
    }

    addPageButton("1", 1, currentPage === 1);
    if (range[0] > 2) {
      const dots = document.createElement("li");
      dots.className = "page-item disabled";
      dots.innerHTML = `<span class="page-link">…</span>`;
      fragment.appendChild(dots);
    }

    range.forEach(i => addPageButton(i, i, currentPage === i));

    if (range[range.length - 1] < totalPages - 1) {
      const dots = document.createElement("li");
      dots.className = "page-item disabled";
      dots.innerHTML = `<span class="page-link">…</span>`;
      fragment.appendChild(dots);
    }

    addPageButton(totalPages, totalPages, currentPage === totalPages);
    addPageButton("›", currentPage + 1, false, currentPage === totalPages);
    addPageButton("»", totalPages, false, currentPage === totalPages);

    paginationContainer.appendChild(fragment);
  }

  fetchJsonFiles();
});
