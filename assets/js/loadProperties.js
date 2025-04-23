document.addEventListener("DOMContentLoaded", function () {
    const container = document.getElementById("properties-container");
  
    if (!container) {
      console.error("Container de propriedades não encontrado!");
      return;
    }
  
    fetch("/data/properties.json")
      .then(response => response.json())
      .then(properties => {
        if (!properties || properties.length === 0) {
          container.innerHTML = "<p>No properties found.</p>";
          return;
        }
  
        container.innerHTML = ""; // Limpa conteúdo inicial
  
        properties.forEach(property => {
          const card = document.createElement("div");
          card.className = "col-md-4";
  
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
                        ${property.title}
                      </a>
                    </h2>
                  </div>
                  <div class="card-body-a">
                    <div class="price-box d-flex">
                      <span class="price-a">R$ ${property.valuation?.toLocaleString('pt-BR')}</span>
                    </div>
                    <a href="/property-single.html?id=${property.id}" class="link-a">Click here to view <span class="bi bi-chevron-right"></span></a>
                  </div>
                  <div class="card-footer-a">
                    <ul class="card-info d-flex justify-content-around">
                      <li>
                        <h4 class="card-info-title">City</h4>
                        <span>${property.city}</span>
                      </li>
                      <li>
                        <h4 class="card-info-title">State</h4>
                        <span>${property.state}</span>
                      </li>
                      <li>
                        <h4 class="card-info-title">Status</h4>
                        <span>${property.status}</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          `;
  
          container.appendChild(card);
        });
      })
      .catch(error => {
        console.error("Erro ao carregar propriedades:", error);
        container.innerHTML = "<p>Erro ao carregar os imóveis. Tente novamente mais tarde.</p>";
      });
  });
  