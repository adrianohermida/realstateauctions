document.addEventListener("DOMContentLoaded", async function () {
  const container = document.getElementById("properties-container");
  const pagination = document.getElementById("pagination");
  const searchSummary = document.getElementById("search-summary");

  const typeFilter = document.getElementById("filter-type");
  const cityFilter = document.getElementById("filter-city");
  const stateFilter = document.getElementById("filter-state");
  const keywordFilter = document.getElementById("filter-keyword");

  let allProperties = [];
  let filteredProperties = [];
  let currentPage = 1;
  const itemsPerPage = 6;

  async function loadAllJsonData() {
    const files = [
      "property_1_to_50.json",
      "property_51_to_100.json",
      "property_101_to_150.json",
      "property_151_to_152.json"
    ];
    const results = await Promise.all(
      files.map(file =>
        fetch(`/data/${file}`)
          .then(res => (res.ok ? res.json() : []))
          .catch(() => [])
      )
    );
    return results.flat();
  }

  function applyFiltersFromURL() {
    const urlParams = new URLSearchParams(window.location.search);
    return {
      type: urlParams.get("type") || "",
      city: urlParams.get("city") || "",
      state: urlParams.get("state") || "",
      bedrooms: urlParams.get("bedrooms") || "",
      garages: urlParams.get("garages") || "",
      bathrooms: urlParams.get("bathrooms") || "",
      minprice: parseFloat(urlParams.get("minprice")) || 0,
      keyword: urlParams.get("keyword") || ""
    };
  }

  function filterProperties(filters) {
    return allProperties.filter(p => {
      const keywordMatch =
        !filters.keyword ||
        (p.title && p.title.toLowerCase().includes(filters.keyword.toLowerCase())) ||
        (p.description && p.description.toLowerCase().includes(filters.keyword.toLowerCase()));

      const typeMatch = !filters.type || p.type === filters.type;
      const cityMatch = !filters.city || p.city === filters.city;
      const stateMatch = !filters.state || p.state === filters.state;
      const bedroomsMatch = !filters.bedrooms || String(p.bedrooms) === filters.bedrooms;
      const garagesMatch = !filters.garages || String(p.garages) === filters.garages;
      const bathroomsMatch = !filters.bathrooms || String(p.bathrooms) === filters.bathrooms;
      const priceMatch = !filters.minprice || (p.minimumBid && parseFloat(p.minimumBid) >= filters.minprice);

      return keywordMatch && typeMatch && cityMatch && stateMatch && bedroomsMatch && garagesMatch && bathroomsMatch && priceMatch;
    });
  }

  function renderProperties(page) {
    container.innerHTML = "";
    const start = (page - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    const items = filteredProperties.slice(start, end);

    items.forEach(p => {
      const image = (p.images && p.images[0]) || "/assets/img/default-property.jpg";
      const card = document.createElement("div");
      card.className = "col-md-4 mb-4";
      card.innerHTML = `
        <div class="card-box-a card-shadow">
          <div class="img-box-a">
            <img src="${image}" alt="${p.title}" class="img-a img-fluid">
          </div>
          <div class="card-overlay">
            <div class="card-overlay-a-content">
              <div class="card-header-a">
                <h2 class="card-title-a">
                  <a href="/property-single.html?id=${p.id}">${p.title}</a>
                </h2>
              </div>
              <div class="card-body-a">
                <div class="price-box d-flex">
                  <span class="price-a">Price | R$ ${p.minimumBid ? p.minimumBid.toLocaleString("pt-BR") : "-"}</span>
                </div>
                <a href="/property-single.html?id=${p.id}" class="link-a">Click here to view
                  <span class="bi bi-chevron-right"></span>
                </a>
              </div>
              <div class="card-footer-a">
                <ul class="card-info d-flex justify-content-around">
                  <li><h4 class="card-info-title">Area</h4><span>${p.area || "-"}<sup>2</sup></span></li>
                  <li><h4 class="card-info-title">Beds</h4><span>${p.bedrooms || "-"}</span></li>
                  <li><h4 class="card-info-title">Baths</h4><span>${p.bathrooms || "-"}</span></li>
                  <li><h4 class="card-info-title">Garages</h4><span>${p.garages || "-"}</span></li>
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
    if (totalPages <= 1) return;

    const createPageItem = (text, pageNum, active = false) => {
      const li = document.createElement("li");
      li.className = `page-item ${active ? "active" : ""}`;
      li.innerHTML = `<a class="page-link" href="#">${text}</a>`;
      li.addEventListener("click", e => {
        e.preventDefault();
        currentPage = pageNum;
        renderProperties(currentPage);
      });
      return li;
    };

    for (let i = 1; i <= totalPages; i++) {
      pagination.appendChild(createPageItem(i, i, i === currentPage));
    }
  }

  allProperties = await loadAllJsonData();
  const filters = applyFiltersFromURL();
  filteredProperties = filterProperties(filters);
  renderProperties(currentPage);
});