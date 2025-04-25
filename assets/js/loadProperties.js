
document.addEventListener("DOMContentLoaded", async function () {
  const container = document.getElementById("properties-container");
  const typeFilter = document.getElementById("filter-type");
  const cityFilter = document.getElementById("filter-city");
  const stateFilter = document.getElementById("filter-state");
  const keywordFilter = document.getElementById("filter-keyword");
  const clearBtn = document.getElementById("clear-filters");
  const pagination = document.getElementById("pagination");
  const summary = document.getElementById("search-summary");

  let allProperties = [];
  let filteredProperties = [];
  let currentPage = 0;
  const itemsPerPage = 6;

  async function loadAllJsonData() {
    const jsonFiles = [
      "property_1_to_50.json",
      "property_51_to_100.json",
      "property_101_to_150.json",
      "property_151_to_152.json"
    ];
    const promises = jsonFiles.map(file =>
      fetch(`/data/${file}`).then(res => res.json()).catch(() => [])
    );
    const results = await Promise.all(promises);
    return results.flat();
  }

  function populateFilters(data) {
    const types = [...new Set(data.map(p => p.type).filter(Boolean))].sort();
    const cities = [...new Set(data.map(p => p.city).filter(Boolean))].sort();
    const states = [...new Set(data.map(p => p.state).filter(Boolean))].sort();

    typeFilter.innerHTML = `<option value="">All Types</option>`;
    cityFilter.innerHTML = `<option value="">All Cities</option>`;
    stateFilter.innerHTML = `<option value="">All States</option>`;

    types.forEach(type => typeFilter.innerHTML += `<option value="${type}">${type}</option>`);
    cities.forEach(city => cityFilter.innerHTML += `<option value="${city}">${city}</option>`);
    states.forEach(state => stateFilter.innerHTML += `<option value="${state}">${state}</option>`);
  }

  function filterProperties() {
    const type = typeFilter.value;
    const city = cityFilter.value;
    const state = stateFilter.value;
    const keyword = keywordFilter.value.toLowerCase();

    filteredProperties = allProperties.filter(p => {
      const matchKeyword = keyword ? (
        (p.title && p.title.toLowerCase().includes(keyword)) ||
        (p.description && p.description.toLowerCase().includes(keyword))
      ) : true;

      return (!type || p.type === type) &&
             (!city || p.city === city) &&
             (!state || p.state === state) &&
             matchKeyword;
    });

    summary.innerHTML = filteredProperties.length
      ? `<p>${filteredProperties.length} properties found.</p>`
      : `<p>No properties found.</p>`;
  }

  function renderProperties(page = 0) {
    container.innerHTML = "";
    currentPage = page;
    const start = page * itemsPerPage;
    const end = start + itemsPerPage;
    const propertiesToDisplay = filteredProperties.slice(start, end);

    propertiesToDisplay.forEach(property => {
      const card = document.createElement("div");
      card.className = "col-md-4 mb-4";
      const imageUrl = property.images && property.images[0] ? property.images[0] : '/assets/img/default-property.jpg';

      card.innerHTML = `
        <div class="card-box-a card-shadow">
          <div class="img-box-a">
            <img src="${imageUrl}" alt="${property.title}" class="img-a img-fluid">
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
                  <span class="price-a">Price | R$ ${property.minimumBid?.toLocaleString("pt-BR") || "0,00"}</span>
                </div>
                <a href="/property-single.html?id=${property.id}" class="link-a">Click to view <span class="bi bi-chevron-right"></span></a>
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
      container.appendChild(card);
    });

    renderPagination();
  }

  function renderPagination() {
    const totalPages = Math.ceil(filteredProperties.length / itemsPerPage);
    pagination.innerHTML = "";
    for (let i = 0; i < totalPages; i++) {
      const li = document.createElement("li");
      li.className = `page-item ${i === currentPage ? "active" : ""}`;
      li.innerHTML = `<a class="page-link" href="#">${i + 1}</a>`;
      li.addEventListener("click", e => {
        e.preventDefault();
        renderProperties(i);
      });
      pagination.appendChild(li);
    }
  }

  function applyFilters() {
    filterProperties();
    renderProperties(0);
  }

  clearBtn?.addEventListener("click", () => {
    typeFilter.value = "";
    cityFilter.value = "";
    stateFilter.value = "";
    keywordFilter.value = "";
    applyFilters();
  });

  allProperties = await loadAllJsonData();
  populateFilters(allProperties);
  applyFilters();
  typeFilter.addEventListener("change", applyFilters);
  cityFilter.addEventListener("change", applyFilters);
  stateFilter.addEventListener("change", applyFilters);
  keywordFilter.addEventListener("input", applyFilters);

  if (typeof window.applyInitialFilters === "function") {
    window.applyInitialFilters();
  }
});
