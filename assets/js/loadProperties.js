document.addEventListener("DOMContentLoaded", function () {
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
  let currentPage = 1;
  const itemsPerPage = 6;

  function fetchMultipleJSONs() {
    const promises = [];
    const maxFiles = 10;
    for (let i = 1; i <= maxFiles; i++) {
      promises.push(fetch(`/data/property_${(i - 1) * 50 + 1}_to_${i * 50}.json`).then(res => res.ok ? res.json() : []));
    }
    return Promise.all(promises).then(results => results.flat());
  }

  function populateFilters(data) {
    const unique = (key) => [...new Set(data.map(p => p[key]).filter(Boolean).sort())];

    const populate = (select, values, placeholder) => {
      select.innerHTML = `<option value="">${placeholder}</option>`;
      values.forEach(val => {
        const opt = document.createElement("option");
        opt.value = val;
        opt.textContent = val;
        select.appendChild(opt);
      });
    };

    populate(typeFilter, unique("type"), "All Types");
    populate(cityFilter, unique("city"), "All Cities");
    populate(stateFilter, unique("state"), "All States");
  }

  function renderProperties() {
    container.innerHTML = "";
    const start = (currentPage - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    const propertiesToDisplay = filteredProperties.slice(start, end);

    propertiesToDisplay.forEach(p => {
      const card = document.createElement("div");
      card.className = "col-md-4 mb-4";

      card.innerHTML = `
        <div class="card-box-a card-shadow">
          <div class="img-box-a">
            <img src="${(p.images && p.images[0]) || '/assets/img/default.jpg'}" alt="${p.title}" class="img-a img-fluid">
          </div>
          <div class="card-overlay">
            <div class="card-overlay-a-content">
              <div class="card-header-a">
                <h2 class="card-title-a">
                  <a href="/property-single.html?id=${p.id}">${p.title.replace(' - ', '<br/>')}</a>
                </h2>
              </div>
              <div class="card-body-a">
                <div class="price-box d-flex">
                  <span class="price-a">R$ ${p.minimumBid?.toLocaleString('pt-BR') || '-'}</span>
                </div>
                <a href="/property-single.html?id=${p.id}" class="link-a">Click here to view <span class="bi bi-chevron-right"></span></a>
              </div>
              <div class="card-footer-a">
                <ul class="card-info d-flex justify-content-around">
                  <li><h4 class="card-info-title">Area</h4><span>${p.area || "-"}</span></li>
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
  }

  function renderPagination() {
    const totalPages = Math.ceil(filteredProperties.length / itemsPerPage);
    pagination.innerHTML = "";
  
    const createPageItem = (page, label = page, active = false, disabled = false) => {
      const li = document.createElement("li");
      li.className = `page-item ${active ? "active" : ""} ${disabled ? "disabled" : ""}`;
      li.innerHTML = `<a class="page-link" href="#">${label}</a>`;
      if (!disabled) {
        li.addEventListener("click", e => {
          e.preventDefault();
          renderProperties(page);
        });
      }
      return li;
    };
  
    // Botão «
    pagination.appendChild(createPageItem(currentPage - 1, "«", false, currentPage === 0));
  
    const visibleRange = 2;
    const start = Math.max(0, currentPage - visibleRange);
    const end = Math.min(totalPages, currentPage + visibleRange + 1);
  
    if (start > 0) {
      pagination.appendChild(createPageItem(0, "1"));
      if (start > 1) pagination.appendChild(createPageItem(null, "...", false, true));
    }
  
    for (let i = start; i < end; i++) {
      pagination.appendChild(createPageItem(i, i + 1, i === currentPage));
    }
  
    if (end < totalPages) {
      if (end < totalPages - 1) pagination.appendChild(createPageItem(null, "...", false, true));
      pagination.appendChild(createPageItem(totalPages - 1, totalPages));
    }
  
    // Botão »
    pagination.appendChild(createPageItem(currentPage + 1, "»", false, currentPage >= totalPages - 1));
  }
  

<script>
  function renderPaginationControls(currentPage, totalPages, onPageChange) {
    const container = document.querySelector('.pagination-modern .pages');
    const firstBtn = document.querySelector('.pagination-modern .first');
    const prevBtn = document.querySelector('.pagination-modern .prev');
    const nextBtn = document.querySelector('.pagination-modern .next');
    const lastBtn = document.querySelector('.pagination-modern .last');
    const gotoInput = document.getElementById('goto-page');
    const gotoBtn = document.getElementById('goto-btn');

    container.innerHTML = '';
    const pageButtons = [];

    const range = (start, end) => Array.from({length: end - start + 1}, (_, i) => start + i);
    let pagesToShow = [];

    if (totalPages <= 7) {
      pagesToShow = range(1, totalPages);
    } else {
      if (currentPage <= 4) {
        pagesToShow = [...range(1, 5), '...', totalPages];
      } else if (currentPage >= totalPages - 3) {
        pagesToShow = [1, '...', ...range(totalPages - 4, totalPages)];
      } else {
        pagesToShow = [1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages];
      }
    }

    pagesToShow.forEach(p => {
      if (p === '...') {
        const span = document.createElement('span');
        span.className = 'dots';
        span.textContent = '...';
        container.appendChild(span);
      } else {
        const btn = document.createElement('button');
        btn.textContent = p;
        btn.className = (p === currentPage) ? 'active' : '';
        btn.addEventListener('click', () => onPageChange(p));
        container.appendChild(btn);
      }
    });

    firstBtn.onclick = () => onPageChange(1);
    prevBtn.onclick = () => onPageChange(Math.max(1, currentPage - 1));
    nextBtn.onclick = () => onPageChange(Math.min(totalPages, currentPage + 1));
    lastBtn.onclick = () => onPageChange(totalPages);

    gotoBtn.onclick = () => {
      const page = parseInt(gotoInput.value);
      if (page >= 1 && page <= totalPages) {
        onPageChange(page);
      }
    };
  }
</script>

  function applyFilters() {
    const keyword = keywordFilter.value.toLowerCase();
    const type = typeFilter.value;
    const city = cityFilter.value;
    const state = stateFilter.value;

    filteredProperties = allProperties.filter(p => {
      const matchesKeyword = keyword === '' ||
        (p.title && p.title.toLowerCase().includes(keyword)) ||
        (p.description && p.description.toLowerCase().includes(keyword));

      return (!type || p.type === type) &&
             (!city || p.city === city) &&
             (!state || p.state === state) &&
             matchesKeyword;
    });

    summary.innerHTML = keyword ? `<strong>${filteredProperties.length}</strong> result(s) found for "<em>${keyword}</em>"` : "";

    currentPage = 1;
    renderProperties();
    renderPagination();
  }

  clearBtn?.addEventListener("click", () => {
    typeFilter.value = "";
    cityFilter.value = "";
    stateFilter.value = "";
    keywordFilter.value = "";
    applyFilters();
  });

  fetchMultipleJSONs().then(data => {
    allProperties = data;
    populateFilters(data);
    applyFilters();

    [typeFilter, cityFilter, stateFilter].forEach(el => el.addEventListener("change", applyFilters));
    keywordFilter.addEventListener("input", applyFilters);
  });
});
