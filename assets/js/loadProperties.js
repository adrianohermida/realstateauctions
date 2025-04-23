document.addEventListener("DOMContentLoaded", () => {
  // Elementos do DOM
  const container = document.getElementById("properties-container");
  const pagination = document.getElementById("pagination");
  const summary = document.getElementById("search-summary");
  const typeFilter = document.getElementById("filter-type");
  const cityFilter = document.getElementById("filter-city");
  const stateFilter = document.getElementById("filter-state");
  const keywordFilter = document.getElementById("filter-keyword");
  const clearBtn = document.getElementById("clear-filters");

  // Configurações
  const itemsPerPage = 6;
  let allProperties = [];
  let filteredProperties = [];
  let currentPage = 1;

  // Verifica se todos os elementos existem
  if (!container || !pagination || !summary || !typeFilter || !cityFilter || !stateFilter || !keywordFilter || !clearBtn) {
    console.error("One or more DOM elements not found");
    summary.innerHTML = '<p class="text-danger">Error: Page elements not found. Please check the HTML.</p>';
    return;
  }

  // Popula os filtros com valores únicos
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

  // Renderiza as propriedades na página
  function renderProperties() {
    container.innerHTML = "";
    if (filteredProperties.length === 0) {
      container.innerHTML = '<p class="text-center">No properties found.</p>';
      pagination.innerHTML = "";
      summary.innerHTML = '<p class="text-muted">No properties match the current filters.</p>';
      return;
    }

    const start = (currentPage - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    const display = filteredProperties.slice(start, end);

    display.forEach(property => {
      const card = document.createElement("div");
      card.className = "col-md-4 mb-4";
      card.innerHTML = `
        <div class="card-box-a card-shadow">
          <div class="img-box-a">
            <img src="${property.image || './assets/img/default-property.jpg'}" alt="${property.title || 'Property'}" class="img-a img-fluid">
          </div>
          <div class="card-overlay">
            <div class="card-overlay-a-content">
              <div class="card-header-a">
                <h2 class="card-title-a">
                  <a href="/property-single.html?id=${property.id || ''}">
                    ${property.title ? property.title.replace(" - ", "<br />") : 'Untitled Property'}
                  </a>
                </h2>
              </div>
              <div class="card-body-a">
                <div class="price-box d-flex">
                  <span class="price-a">R$ ${property.valuation ? property.valuation.toLocaleString("pt-BR") : '-'}</span>
                </div>
                <a href="/property-single.html?id=${property.id || ''}" class="link-a">
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

    summary.innerHTML = `<p>Showing ${display.length} of ${filteredProperties.length} properties</p>`;
    renderPagination();
  }

  // Renderiza a paginação
  function renderPagination() {
    const totalPages = Math.ceil(filteredProperties.length / itemsPerPage);
    pagination.innerHTML = "";

    // Botão "Previous"
    const prevLi = document.createElement("li");
    prevLi.className = `page-item ${currentPage === 1 ? "disabled" : ""}`;
    prevLi.innerHTML = `<a class="page-link" href="#"><span class="bi bi-chevron-left"></span></a>`;
    prevLi.addEventListener("click", e => {
      e.preventDefault();
      if (currentPage > 1) {
        currentPage--;
        renderProperties();
      }
    });
    pagination.appendChild(prevLi);

    // Páginas numeradas
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

    // Botão "Next"
    const nextLi = document.createElement("li");
    nextLi.className = `page-item ${currentPage === totalPages ? "disabled" : ""}`;
    nextLi.innerHTML = `<a class="page-link" href="#"><span class="bi bi-chevron-right"></span></a>`;
    nextLi.addEventListener("click", e => {
      e.preventDefault();
      if (currentPage < totalPages) {
        currentPage++;
        renderProperties();
      }
    });
    pagination.appendChild(nextLi);
  }

  // Filtra as propriedades
  function filterProperties() {
    const type = typeFilter.value;
    const city = cityFilter.value;
    const state = stateFilter.value;
    const keyword = keywordFilter.value.toLowerCase().trim();

    filteredProperties = allProperties.filter(p => {
      const matchKeyword = keyword ? (
        (p.title?.toLowerCase?.().includes(keyword) || false) ||
        (p.description?.toLowerCase?.().includes(keyword) || false)
      ) : true;

      return (!type || p.type === type) &&
             (!city || p.city === city) &&
             (!state || p.state === state) &&
             matchKeyword;
    });

    currentPage = 1;
  }

  // Aplica os filtros e atualiza a interface
  function applyFilters() {
    filterProperties();
    renderProperties();
  }

  // Limpa os filtros
  clearBtn.addEventListener("click", () => {
    typeFilter.value = "";
    cityFilter.value = "";
    stateFilter.value = "";
    keywordFilter.value = "";
    applyFilters();
  });

  // Carrega as propriedades
  fetch("./data/properties.json")
    .then(res => {
      if (!res.ok) throw new Error(`Failed to load properties: ${res.status}`);
      return res.json();
    })
    .then(data => {
      if (!Array.isArray(data)) throw new Error("Invalid data format: Expected an array");
      allProperties = data;
      filteredProperties = data;
      populateFilters(data);
      applyFilters();
    })
    .catch(err => {
      console.error("Error loading properties:", err);
      summary.innerHTML = '<p class="text-danger">Error loading properties. Please try again later.</p>';
      container.innerHTML = '<p class="text-center">Unable to load properties.</p>';
    });

  // Associa eventos aos filtros
  [typeFilter, cityFilter, stateFilter].forEach(el => el.addEventListener("change", applyFilters));
  keywordFilter.addEventListener("input", applyFilters);
});