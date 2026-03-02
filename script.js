const countryInput = document.getElementById('country-input');
const searchBtn = document.getElementById('search-btn');
const spinner = document.getElementById('loading-spinner');
const countryInfo = document.getElementById('country-info');
const borderingCountries = document.getElementById('bordering-countries');
const errorMessage = document.getElementById('error-message');

function show(el) {
  el.classList.remove('hidden');
}

function hide(el) {
  el.classList.add('hidden');
}

function clearUI() {
  countryInfo.innerHTML = '';
  borderingCountries.innerHTML = '';
  errorMessage.textContent = '';

  hide(countryInfo);
  hide(borderingCountries);
  hide(errorMessage);
}

async function fetchJSON(url) {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Request failed (${response.status})`);
  }
  return response.json();
}

async function searchCountry(countryName) {
  try {
    const trimmed = countryName.trim();
    clearUI();

    if (!trimmed) {
      throw new Error("Please enter a country name.");
    }

  
    show(spinner);

    
    const data = await fetchJSON(`https://restcountries.com/v3.1/name/${encodeURIComponent(trimmed)}`);

    
    const country = data[0];
    if (!country) {
      throw new Error("Country not found. Try a different name.");
    }

    const capital = Array.isArray(country.capital) && country.capital.length > 0 ? country.capital[0] : "N/A";
    const borders = Array.isArray(country.borders) ? country.borders : [];

    
    countryInfo.innerHTML = `
      <h2>${country.name.common}</h2>
      <p><strong>Capital:</strong> ${capital}</p>
      <p><strong>Population:</strong> ${country.population.toLocaleString()}</p>
      <p><strong>Region:</strong> ${country.region}</p>
      <img src="${country.flags.svg}" alt="${country.name.common} flag">
    `;
    show(countryInfo);

    
    if (borders.length === 0) {
      borderingCountries.innerHTML = `<p><strong>No bordering countries found.</strong></p>`;
      show(borderingCountries);
      return;
    }

   
    const neighborPromises = borders.map(code =>
      fetchJSON(`https://restcountries.com/v3.1/alpha/${encodeURIComponent(code)}`)
    );

    const neighborsData = await Promise.all(neighborPromises);

    
    const neighbors = neighborsData
      .map(arr => Array.isArray(arr) ? arr[0] : null)
      .filter(Boolean);

    borderingCountries.innerHTML = neighbors.map(n => `
      <div class="border-card">
        <img src="${n.flags.svg}" alt="${n.name.common} flag">
        <div>
          <strong>${n.name.common}</strong>
        </div>
      </div>
    `).join('');

    show(borderingCountries);

  } catch (error) {
    errorMessage.textContent = error.message || "Something went wrong. Please try again.";
    show(errorMessage);
  } finally {
    
    hide(spinner);
  }
}


searchBtn.addEventListener('click', () => {
  searchCountry(countryInput.value);
});


countryInput.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') {
    searchCountry(countryInput.value);
  }
});
