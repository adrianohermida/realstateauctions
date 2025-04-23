window.addEventListener("DOMContentLoaded", () => {
  const container = document.getElementById("properties-container");
  const pagination = document.getElementById("pagination");
  const summary = document.getElementById("search-summary");
  const typeFilter = document.getElementById("filter-type");
  const cityFilter = document.getElementById("filter-city");
  const stateFilter = document.getElementById("filter-state");
  const keywordFilter = document.getElementById("filter-keyword");
  const clearBtn = document.getElementById("clear-filters");

  const itemsPerPage = 6;
  let allProperties = [];
  let filteredProperties = [];
  let currentPage = 1;

  function populateFilters(data) {
    const addOptions = (select, values, defaultOption) => {
      const unique = [...new Set(values)].filter(Boolean).sort();
      select.innerHTML = `<option value="">${defaultOption}</option>`;
      unique.forEach(val => {
        const opt = document.createElement("option");
        opt.value = val;
        opt.textContent = val;
        select.appendChild(opt);
      });
    };

    addOptions(typeFilter, data.map(p => p.type), "All Types");
    addOptions(cityFilter, data.map(p => p.city), "All Cities");
    addOptions(stateFilter, data.map(p => p.state), "All States");
  }

  function renderProperties() {
    container.innerHTML = "";
    const start = (currentPage - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    const pageItems = filteredProperties.slice(start, end);

    pageItems.forEach(property => {
      const card = document.createElement("div");
      card.className = "col-md-4 mb-4";
      card.innerHTML = `
        <div class="card-box-a card-shadow">
          <div class="img-box-a">
            <img src="${property.image}" alt="${property.title}" class="img-a img-fluid">
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
                  <span class="price-a">R$ ${property.valuation?.toLocaleString("pt-BR") || "-"}</span>
                </div>
                <a href="/property-single.html?id=${property.id}" class="link-a">
                  Click here to view <span class="bi bi-chevron-right"></span>
                </a>
              </div>
              <div class="card-footer-a">
                <ul class="card-info d-flex justify-content-around">
                  <li><h4 class="card-info-title">Area</h4><span>${property.area || "-"}<sup>2</sup></span></li>
                  <li><h4 class="card-info-title">Beds</h4><span>${property.bedrooms || "-"}</span></li>
                  <li><h4 class="card-info-title">Baths</h4><span>${property.bathrooms || "-"}</span></li>
                  <li><h4 class="card-info-title">Garages</h4><span>${property.garages || "-"}</span></li>
                </ul>
              </div>
            </div>
          </div>
        </div>`;
      container.appendChild(card);
    });

    renderPagination();
  }

  function renderPagination() {
    pagination.innerHTML = "";
    const totalPages = Math.ceil(filteredProperties.length / itemsPerPage);
    for (let i = 1; i <= totalPages; i++) {
      const li = document.createElement("li");
      li.className = `page-item ${i === currentPage ? "active" : ""}`;
      li.innerHTML = `<a class="page-link" href="#">${i}</a>`;
      li.addEventListener("click", e => {
        e.preventDefault();
        currentPage = i;
        renderProperties();
      });
      pagination.appendChild(li);
    }
  }

  function filterProperties() {
    const type = typeFilter.value;
    const city = cityFilter.value;
    const state = stateFilter.value;
    const keyword = keywordFilter.value.toLowerCase();

    filteredProperties = allProperties.filter(p => {
      const matchesKeyword = keyword
        ? (p.title?.toLowerCase().includes(keyword) || p.description?.toLowerCase().includes(keyword))
        : true;
      return (!type || p.type === type) &&
             (!city || p.city === city) &&
             (!state || p.state === state) &&
             matchesKeyword;
    });

    summary.innerHTML = keyword ? `<p class="text-muted">Results for: <strong>${keyword}</strong></p>` : "";
  }

  function applyFilters() {
    filterProperties();
    currentPage = 1;
    renderProperties();
  }

  clearBtn?.addEventListener("click", () => {
    typeFilter.value = "";
    cityFilter.value = "";
    stateFilter.value = "";
    keywordFilter.value = "";
    applyFilters();
  });

  fetch("/data/properties.json")
    .then(res => res.json())
    .then(data => {
      allProperties = data;
      populateFilters(data);
      applyFilters();
      typeFilter.addEventListener("change", applyFilters);
      cityFilter.addEventListener("change", applyFilters);
      stateFilter.addEventListener("change", applyFilters);
      keywordFilter.addEventListener("input", applyFilters);
    });
});