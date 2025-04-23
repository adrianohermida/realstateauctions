// loadProperties.js

function getURLParams() {
  const params = new URLSearchParams(window.location.search);
  return {
    keyword: params.get("keyword") || "",
    type: params.get("type") || "",
    city: params.get("city") || "",
    state: params.get("state") || "",
    bedrooms: params.get("bedrooms") || "",
    bathrooms: params.get("bathrooms") || "",
    garages: params.get("garages") || "",
    price: params.get("price") || ""
  };
}

document.addEventListener("DOMContentLoaded", function () {
  const container = document.getElementById("properties-container");
  const typeFilter = document.getElementById("filter-type");
  const cityFilter = document.getElementById("filter-city");
  const stateFilter = document.getElementById("filter-state");
  const keywordFilter = document.getElementById("filter-keyword");
  const clearBtn = document.getElementById("clear-filters");
  const pagination = document.getElementById("pagination");

  let allProperties = [];
  let filteredProperties = [];
  let currentPage = 0;
  const itemsPerPage = 6;

  function populateFilters(data) {
    const types = [...new Set(data.map(p => p.type).filter(Boolean).sort())];
    const cities = [...new Set(data.map(p => p.city).filter(Boolean).sort())];
    const states = [...new Set(data.map(p => p.state).filter(Boolean).sort())];

    typeFilter.innerHTML = `<option value="">All Types</option>`;
    types.forEach(type => {
      typeFilter.innerHTML += `<option value="${type}">${type}</option>`;
    });

    cityFilter.innerHTML = `<option value="">All Cities</option>`;
    cities.forEach(city => {
      cityFilter.innerHTML += `<option value="${city}">${city}</option>`;
    });

    stateFilter.innerHTML = `<option value="">All States</option>`;
    states.forEach(state => {
      stateFilter.innerHTML += `<option value="${state}">${state}</option>`;
    });
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
      card.innerHTML = `
        <div class="card-box-a card-shadow">
          <div class="img-box-a">
            <img src="${property.images?.[0] || '/assets/img/no-image.jpg'}" alt="${property.title}" class="img-a img-fluid">
          </div>
          <div class="card-overlay">
            <div class="card-overlay-a-content">
              <div class="card-header-a">
                <h2 class="card-title-a">
                  <a href="/property-single.html?id=${property.id}">
                    ${property.title.replace(" - ", "<br/>")}
                  </a>
                </h2>
              </div>
              <div class="card-body-a">
                <div class="price-box d-flex">
                  <span class="price-a">R$ ${Number(property.minimumBid).toLocaleString('pt-BR')}</span>
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
      container.appendChild(card);
    });

    renderPagination();
  }

  function renderPagination() {
    const totalPages = Math.ceil(filteredProperties.length / itemsPerPage);
    pagination.innerHTML = "";
    for (let i = 1; i <= totalPages; i++) {
      const li = document.createElement("li");
      li.className = `page-item ${i === currentPage + 1 ? "active" : ""}`;
      li.innerHTML = `<a class="page-link" href="#">${i}</a>`;
      li.addEventListener("click", e => {
        e.preventDefault();
        renderProperties(i - 1);
      });
      pagination.appendChild(li);
    }
  }

  function filterProperties(filters) {
    const { keyword, type, city, state } = filters;
    filteredProperties = allProperties.filter(p => {
      const matchKeyword = keyword ? (
        (p.title && p.title.toLowerCase().includes(keyword.toLowerCase())) ||
        (p.description && p.description.toLowerCase().includes(keyword.toLowerCase()))
      ) : true;

      return (!type || p.type === type) &&
             (!city || p.city === city) &&
             (!state || p.state === state) &&
             matchKeyword;
    });
  }

  function applyFiltersFromParams() {
    const filters = getURLParams();
    if (typeFilter) typeFilter.value = filters.type;
    if (cityFilter) cityFilter.value = filters.city;
    if (stateFilter) stateFilter.value = filters.state;
    if (keywordFilter) keywordFilter.value = filters.keyword;
    filterProperties(filters);
    renderProperties(0);
  }

  clearBtn?.addEventListener("click", () => {
    typeFilter.value = "";
    cityFilter.value = "";
    stateFilter.value = "";
    keywordFilter.value = "";
    filterProperties({});
    renderProperties(0);
  });

  const jsonFiles = [
    "/data/property_1_to_50.json",
    "/data/property_51_to_100.json",
    "/data/property_101_to_150.json",
    "/data/property_151_to_200.json"
  ];
  
  Promise.all(
    jsonFiles.map(file => fetch(file).then(res => res.json()))
  ).then(jsonArrays => {
    allProperties = jsonArrays.flat();
  
    populateFilters(allProperties);
    applyFilters();
  
    typeFilter.addEventListener("change", applyFilters);
    cityFilter.addEventListener("change", applyFilters);
    stateFilter.addEventListener("change", applyFilters);
    keywordFilter.addEventListener("input", applyFilters);
  });
  