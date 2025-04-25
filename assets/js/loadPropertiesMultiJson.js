
document.addEventListener("DOMContentLoaded", async function () {
  const container = document.getElementById("properties-container");
  const pagination = document.getElementById("pagination");
  const itemsPerPage = 6;
  let currentPage = 1;
  let allProperties = [];

  async function loadAllJsons() {
    const basePath = "/data/";
    const jsonFiles = [];
    for (let i = 1; i <= 5000; i += 50) {
      const fileName = `property_${i}_to_${i + 49}.json`;
      try {
        const res = await fetch(basePath + fileName);
        if (res.ok) {
          const data = await res.json();
          allProperties = allProperties.concat(data);
        }
      } catch (e) {
        // Ignora erros 404 silenciosamente
      }
    }
    renderProperties();
    renderPagination();
  }

  function renderProperties() {
    container.innerHTML = "";
    const start = (currentPage - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    const propertiesToShow = allProperties.slice(start, end);

    if (propertiesToShow.length === 0) {
      container.innerHTML = "<p class='text-center'>No properties found.</p>";
      return;
    }

    propertiesToShow.forEach(property => {
      const card = document.createElement("div");
      card.className = "col-md-4 mb-4";
      card.innerHTML = `
        <div class="card-box-a card-shadow">
          <div class="img-box-a">
            <img src="${property.images?.[0] || '/assets/img/default.jpg'}" alt="${property.title}" class="img-a img-fluid">
          </div>
          <div class="card-overlay">
            <div class="card-overlay-a-content">
              <div class="card-header-a">
                <h2 class="card-title-a">
                  <a href="property-single.html?id=${property.id}">
                    ${property.title.replace(" - ", "<br/>")}
                  </a>
                </h2>
              </div>
              <div class="card-body-a">
                <div class="price-box d-flex">
                  <span class="price-a">PRICE | R$ ${Number(property.minimumBid).toLocaleString("pt-BR")}</span>
                </div>
                <a href="property-single.html?id=${property.id}" class="link-a">Click here to view <span class="bi bi-chevron-right"></span></a>
              </div>
            </div>
          </div>
        </div>`;
      container.appendChild(card);
    });
  }

  function renderPagination() {
    pagination.innerHTML = "";
    const totalPages = Math.ceil(allProperties.length / itemsPerPage);

    function createButton(page) {
      const li = document.createElement("li");
      li.className = `page-item ${page === currentPage ? "active" : ""}`;
      li.innerHTML = `<a class="page-link" href="#">${page}</a>`;
      li.addEventListener("click", e => {
        e.preventDefault();
        currentPage = page;
        renderProperties();
        renderPagination();
      });
      return li;
    }

    if (totalPages <= 1) return;

    for (let i = 1; i <= totalPages; i++) {
      if (i === 1 || i === totalPages || Math.abs(i - currentPage) <= 2) {
        pagination.appendChild(createButton(i));
      } else if (Math.abs(i - currentPage) === 3) {
        const li = document.createElement("li");
        li.className = "page-item disabled";
        li.innerHTML = `<span class="page-link">...</span>`;
        pagination.appendChild(li);
      }
    }
  }

  loadAllJsons();
});
