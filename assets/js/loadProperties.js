window.addEventListener("DOMContentLoaded", () => {
    const container = document.getElementById("properties-container");
    const pagination = document.getElementById("pagination");
    const itemsPerPage = 6;
    let allProperties = [
      {
        id: 1,
        title: "204 Mount Olive Road Two",
        image: "/assets/img/property-1.jpg",
        type: "For Rent",
        city: "São Paulo",
        state: "SP",
        valuation: 12000,
        area: "340m",
        bedrooms: 2,
        bathrooms: 4,
        garages: 1
      },
      // Adicione mais objetos para teste
    ];
    let filteredProperties = allProperties;
    let currentPage = 1;
  
    function renderProperties() {
      container.innerHTML = "";
      const start = (currentPage - 1) * itemsPerPage;
      const end = start + itemsPerPage;
      const display = filteredProperties.slice(start, end);
  
      display.forEach(property => {
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
  
      const totalPages = Math.ceil(filteredProperties.length / itemsPerPage);
      pagination.innerHTML = "";
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
  
    renderProperties();
  });