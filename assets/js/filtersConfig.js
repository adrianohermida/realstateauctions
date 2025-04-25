
document.addEventListener("DOMContentLoaded", () => {
  const filterElements = {
    type: document.getElementById("type") || document.getElementById("filter-type"),
    city: document.getElementById("city") || document.getElementById("filter-city"),
    state: document.getElementById("state") || document.getElementById("filter-state"),
    bedrooms: document.getElementById("bedrooms"),
    garages: document.getElementById("garages"),
    bathrooms: document.getElementById("bathrooms"),
    minprice: document.getElementById("minprice")
  };

  const populateSelect = (element, items, defaultLabel) => {
    if (!element) return;
    element.innerHTML = `<option value="">${defaultLabel}</option>`;
    [...new Set(items.filter(Boolean))].sort().forEach(item => {
      const option = document.createElement("option");
      option.value = item;
      option.textContent = typeof item === 'number' ? item.toLocaleString("en-US", {style: "currency", currency: "USD"}) : item;
      element.appendChild(option);
    });
  };

  const fetchDataFiles = async () => {
    const files = [
      "/data/property_1_to_50.json",
      "/data/property_51_to_100.json",
      "/data/property_101_to_150.json",
      "/data/property_151_to_152.json"
    ];
    const allData = [];
    for (const file of files) {
      try {
        const res = await fetch(file);
        const data = await res.json();
        allData.push(...data);
      } catch (e) {
        console.warn("Erro ao carregar:", file);
      }
    }
    return allData;
  };

  fetchDataFiles().then(data => {
    populateSelect(filterElements.type, data.map(p => p.type), "All Types");
    populateSelect(filterElements.city, data.map(p => p.city), "All Cities");
    populateSelect(filterElements.state, data.map(p => p.state), "All States");
    populateSelect(filterElements.bedrooms, data.map(p => p.bedrooms), "Any");
    populateSelect(filterElements.garages, data.map(p => p.garages), "Any");
    populateSelect(filterElements.bathrooms, data.map(p => p.bathrooms), "Any");
    populateSelect(filterElements.minprice, data.map(p => p.minimumBid).filter(v => typeof v === "number" && v > 0), "Min Price");
  });
});
