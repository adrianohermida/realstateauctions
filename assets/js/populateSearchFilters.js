
document.addEventListener("DOMContentLoaded", function () {
    const typeSelect = document.getElementById("type");
    const citySelect = document.getElementById("city");
    const bedroomsSelect = document.getElementById("bedrooms");
    const garagesSelect = document.getElementById("garages");
    const bathroomsSelect = document.getElementById("bathrooms");
    const minPriceSelect = document.getElementById("minprice");
  
    const fileCount = 10; // ajustar conforme necessário
    const filePrefix = "/data/property_";
    const fileSuffix = ".json";
  
    async function loadAllData() {
      const allData = [];
      for (let i = 0; i < fileCount; i++) {
        const start = i * 50 + 1;
        const end = start + 49;
        const filePath = `${filePrefix}${start}_to_${end}${fileSuffix}`;
        try {
          const response = await fetch(filePath);
          if (response.ok) {
            const json = await response.json();
            allData.push(...json);
          }
        } catch (error) {
          console.warn("Erro ao carregar:", filePath);
        }
      }
      return allData;
    }
  
    function populateSelect(select, values, defaultOption, isCurrency = false) {
      select.innerHTML = `<option value="">${defaultOption}</option>`;
      values.forEach(val => {
        const opt = document.createElement("option");
        opt.value = val;
        opt.textContent = isCurrency ? `R$ ${Number(val).toLocaleString("pt-BR")}` : val;
        select.appendChild(opt);
      });
    }
  
    loadAllData().then(data => {
      const types = [...new Set(data.map(p => p.type).filter(Boolean))].sort();
      const cities = [...new Set(data.map(p => p.city).filter(Boolean))].sort();
      const bedrooms = [...new Set(data.map(p => p.bedrooms).filter(v => v !== undefined && v !== null))].sort((a, b) => a - b);
      const garages = [...new Set(data.map(p => p.garages).filter(v => v !== undefined && v !== null))].sort((a, b) => a - b);
      const bathrooms = [...new Set(data.map(p => p.bathrooms).filter(v => v !== undefined && v !== null))].sort((a, b) => a - b);
      const prices = [...new Set(data.map(p => p.minimumBid).filter(v => typeof v === "number" && v > 0))].sort((a, b) => a - b);
  
      if (typeSelect) populateSelect(typeSelect, types, "All Type");
      if (citySelect) populateSelect(citySelect, cities, "All City");
      if (bedroomsSelect) populateSelect(bedroomsSelect, bedrooms, "Any");
      if (garagesSelect) populateSelect(garagesSelect, garages, "Any");
      if (bathroomsSelect) populateSelect(bathroomsSelect, bathrooms, "Any");
      if (minPriceSelect) populateSelect(minPriceSelect, prices, "Unlimite", true);
    });
  });
  