// searchPropertyAdjustments.js
document.addEventListener("DOMContentLoaded", async () => {
    const form = document.getElementById("search-form");
    const keywordInput = document.getElementById("keyword");
    const typeSelect = document.getElementById("type");
    const citySelect = document.getElementById("city");
    const bedroomsSelect = document.getElementById("bedrooms");
    const garagesSelect = document.getElementById("garages");
    const bathroomsSelect = document.getElementById("bathrooms");
    const minPriceSelect = document.getElementById("minprice");
  
    if (!form) return;
  
    async function loadPropertiesData() {
      const folderPath = "/data/";
      const jsonList = [
        "property_1_to_50.json",
        "property_51_to_100.json",
        "property_101_to_150.json",
        "property_151_to_200.json"
      ];
  
      const requests = jsonList.map(file => fetch(`${folderPath}${file}`).then(r => r.json()));
      const results = await Promise.all(requests);
      return results.flat();
    }
  
    function populateSelect(select, values, placeholder, isCurrency = false) {
      select.innerHTML = `<option value="">${placeholder}</option>`;
      values.forEach(val => {
        const opt = document.createElement("option");
        opt.value = val;
        opt.textContent = isCurrency ? `R$ ${parseFloat(val).toLocaleString("pt-BR")}` : val;
        select.appendChild(opt);
      });
    }
  
    const properties = await loadPropertiesData();
  
    const types = [...new Set(properties.map(p => p.type).filter(Boolean))].sort();
    const cities = [...new Set(properties.map(p => p.city).filter(Boolean))].sort();
    const bedrooms = [...new Set(properties.map(p => p.bedrooms).filter(Boolean))].sort((a, b) => a - b);
    const garages = [...new Set(properties.map(p => p.garages).filter(Boolean))].sort((a, b) => a - b);
    const bathrooms = [...new Set(properties.map(p => p.bathrooms).filter(Boolean))].sort((a, b) => a - b);
    const prices = [...new Set(properties.map(p => p.minimumBid).filter(v => typeof v === "number"))].sort((a, b) => a - b);
  
    populateSelect(typeSelect, types, "All Types");
    populateSelect(citySelect, cities, "All Cities");
    populateSelect(bedroomsSelect, bedrooms, "Any");
    populateSelect(garagesSelect, garages, "Any");
    populateSelect(bathroomsSelect, bathrooms, "Any");
    populateSelect(minPriceSelect, prices, "Unlimite", true);
  });
  