
// searchPropertyAdjustments.js
document.addEventListener("DOMContentLoaded", () => {
  const typeField = document.querySelector('#type');
  const cityField = document.querySelector('#city');
  const bedroomsField = document.querySelector('#bedrooms');
  const garagesField = document.querySelector('#garages');
  const bathroomsField = document.querySelector('#bathrooms');
  const minpriceField = document.querySelector('#minprice');

  if (!typeField || !cityField) return;

  const uniqueValues = (data, key) =>
    [...new Set(data.map(item => item[key]).filter(v => v !== null && v !== undefined && v !== ""))];

  fetch('/data/properties.json')
    .then(res => res.json())
    .then(data => {
      const types = uniqueValues(data, "type");
      const cities = uniqueValues(data, "city");
      const bedrooms = uniqueValues(data, "bedrooms");
      const garages = uniqueValues(data, "garages");
      const bathrooms = uniqueValues(data, "bathrooms");
      const prices = uniqueValues(data, "minimumBid").filter(p => typeof p === "number").sort((a, b) => a - b);

      const populate = (select, values, label, isCurrency = false) => {
        select.innerHTML = `<option value="">${label}</option>`;
        values.forEach(value => {
          const opt = document.createElement("option");
          opt.value = value;
          opt.textContent = isCurrency ? `R$ ${value.toLocaleString('pt-BR')}` : value;
          select.appendChild(opt);
        });
      };

      populate(typeField, types, "All Type");
      populate(cityField, cities, "All City");
      if (bedroomsField) populate(bedroomsField, bedrooms, "Any");
      if (garagesField) populate(garagesField, garages, "Any");
      if (bathroomsField) populate(bathroomsField, bathrooms, "Any");
      if (minpriceField) populate(minpriceField, prices, "Unlimite", true);
    });
});
