
document.addEventListener("DOMContentLoaded", async function () {
  const typeSelect = document.getElementById("filter-type");
  const citySelect = document.getElementById("filter-city");
  const stateSelect = document.getElementById("filter-state");

  if (!typeSelect || !citySelect || !stateSelect) return;

  const allProperties = [];

  async function fetchAllPropertyData() {
    const files = Array.from({ length: 50 }, (_, i) => `/data/property_${i * 50 + 1}_to_${(i + 1) * 50}.json`);
    for (const file of files) {
      try {
        const res = await fetch(file);
        if (!res.ok) throw new Error("Fetch failed");
        const data = await res.json();
        allProperties.push(...data);
      } catch (e) {
        console.warn("Could not load file:", file);
      }
    }
  }

  function populateFilter(select, values, defaultLabel) {
    select.innerHTML = `<option value="">${defaultLabel}</option>`;
    values.forEach(value => {
      const opt = document.createElement("option");
      opt.value = value;
      opt.textContent = value;
      select.appendChild(opt);
    });
  }

  await fetchAllPropertyData();

  const types = [...new Set(allProperties.map(p => p.type).filter(Boolean))].sort();
  const cities = [...new Set(allProperties.map(p => p.city).filter(Boolean))].sort();
  const states = [...new Set(allProperties.map(p => p.state).filter(Boolean))].sort();

  populateFilter(typeSelect, types, "All Types");
  populateFilter(citySelect, cities, "All Cities");
  populateFilter(stateSelect, states, "All States");
});
