document.addEventListener("DOMContentLoaded", function () {
  const paginationContainer = document.getElementById("pagination");
  const propertiesContainer = document.getElementById("properties-container");
  const itemsPerPage = 6;
  let currentPage = 1;
  let properties = [];

  function renderProperties() {
    propertiesContainer.innerHTML = "";
    const start = (currentPage - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    const paginated = properties.slice(start, end);

    paginated.forEach((property) => {
      const col = document.createElement("div");
      col.className = "col-md-4 mb-4";

      col.innerHTML = `
        <div class="card-box-a card-shadow">
          <div class="img-box-a">
            <img src="${property.images?.[0] || '/assets/img/default.jpg'}" alt="${property.title}" class="img-a img-fluid">
          </div>
          <div class="card-overlay">
            <div class="card-overlay-a-content">
              <div class="card-header-a">
                <h2 class="card-title-a">
                  <a href="/property-single.html?id=${property.id}">
                    ${property.title.replace(" - ", "<br />")}
                  </a>
                </h2>
              </div>
              <div class="card-body-a">
                <div class="price-box d-flex">
                  <span class="price-a">R$ ${Number(property.minimumBid).toLocaleString("pt-BR")}</span>
                </div>
                <a href="/property-single.html?id=${property.id}" class="link-a">
                  Click here to view <span class="bi bi-chevron-right"></span>
                </a>
              </div>
              <div class="card-footer-a">
                <ul class="card-info d-flex justify-content-around">
                  <li><h4 class="card-info-title">Area</h4><span>${property.area || "-"}</span></li>
                  <li><h4 class="card-info-title">Beds</h4><span>${property.bedrooms || "-"}</span></li>
                  <li><h4 class="card-info-title">Baths</h4><span>${property.bathrooms || "-"}</span></li>
                  <li><h4 class="card-info-title">Garages</h4><span>${property.garages || "-"}</span></li>
                </ul>
              </div>
            </div>
          </div>
        </div>`;
      propertiesContainer.appendChild(col);
    });

    renderPagination();
  }

  function renderPagination() {
    paginationContainer.innerHTML = "";
    const totalPages = Math.ceil(properties.length / itemsPerPage);
    if (totalPages <= 1) return;

    const navGroup = document.createDocumentFragment();

    const prev = document.createElement("li");
    prev.className = "page-item" + (currentPage === 1 ? " disabled" : "");
    prev.innerHTML = `<a class="page-link" href="#">&laquo;</a>`;
    prev.onclick = () => {
      if (currentPage > 1) {
        currentPage--;
        renderProperties();
      }
    };
    navGroup.appendChild(prev);

    for (let i = 1; i <= totalPages; i++) {
      const li = document.createElement("li");
      li.className = "page-item" + (i === currentPage ? " active" : "");
      li.innerHTML = `<a class="page-link" href="#">${i}</a>`;
      li.onclick = () => {
        currentPage = i;
        renderProperties();
      };
      navGroup.appendChild(li);
    }

    const next = document.createElement("li");
    next.className = "page-item" + (currentPage === totalPages ? " disabled" : "");
    next.innerHTML = `<a class="page-link" href="#">&raquo;</a>`;
    next.onclick = () => {
      if (currentPage < totalPages) {
        currentPage++;
        renderProperties();
      }
    };
    navGroup.appendChild(next);

    paginationContainer.appendChild(navGroup);
  }

  if (window.allProperties && Array.isArray(window.allProperties)) {
    properties = window.allProperties;
    renderProperties();
  } else {
    console.warn("No properties loaded.");
  }
});