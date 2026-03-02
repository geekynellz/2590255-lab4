
async function searchCountry(countryName) {
  const input = countryName.trim();

  if (!input) {
    document.getElementById("error").textContent = "Please enter a country name.";
    document.getElementById("error").style.display = "block";
    return;
  }

  
  const spinner = document.getElementById("spinner");
  const countryInfo = document.getElementById("country-info");
  const bordersSection = document.getElementById("border-countries");
  const errorBox = document.getElementById("error");

  try {
    // Show loading spinner
    spinner.style.display = "block";

    // Clear previous UI
    errorBox.style.display = "none";
    errorBox.textContent = "";
    countryInfo.innerHTML = "";
    bordersSection.innerHTML = "";

    // Fetch country data
    const response = await fetch(
      `https://restcountries.com/v3.1/name/${encodeURIComponent(input)}`
    );

    if (!response.ok) {
      throw new Error("Country not found");
    }

    const data = await response.json();


    const country = data[0];

  
    countryInfo.innerHTML = `
      <h2>${country.name.common}</h2>
      <p><strong>Capital:</strong> ${country.capital ? country.capital[0] : "N/A"}</p>
      <p><strong>Population:</strong> ${country.population.toLocaleString()}</p>
      <p><strong>Region:</strong> ${country.region || "N/A"}</p>
      <img src="${country.flags.svg}" alt="${country.name.common} flag" style="max-width:220px; height:auto;">
    `;

    // Fetch bordering countries
    const borders = country.borders || [];

    if (borders.length === 0) {
      
      bordersSection.innerHTML = `<p>No bordering countries found.</p>`;
      return;
    }

    
    const borderPromises = borders.map(async (code) => {
      const borderRes = await fetch(`https://restcountries.com/v3.1/alpha/${code}`);
      if (!borderRes.ok) throw new Error("Failed to load bordering countries");
      const borderData = await borderRes.json();
      return borderData[0];
    });

    const borderCountries = await Promise.all(borderPromises);

    
    bordersSection.innerHTML = borderCountries
      .map(
        (b) => `
        <div style="display:flex; align-items:center; gap:10px; margin:8px 0; padding:8px; border:1px solid #ddd; border-radius:10px;">
          <img src="${b.flags.svg}" alt="${b.name.common} flag" style="width:50px; height:auto; border-radius:4px;">
          <span>${b.name.common}</span>
        </div>
      `
      )
      .join("");

  } catch (error) {

    errorBox.style.display = "block";
    errorBox.textContent =
      error.message === "Country not found"
        ? "Country not found. Please check the spelling and try again."
        : "Something went wrong. Please try again.";
  } finally {
    spinner.style.display = "none";
  }
}

// Event listeners
document.getElementById('search-btn').addEventListener('click', () => {
  const country = document.getElementById('country-input').value;
  searchCountry(country);
});

// Enter key trigger (required)
document.getElementById("country-input").addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    const country = document.getElementById("country-input").value;
    searchCountry(country);
  }
});