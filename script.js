const inputEl = document.getElementById("country-input");
const btnEl = document.getElementById("search-btn");
const spinnerEl = document.getElementById("spinner");
const errorEl = document.getElementById("error");
const countryInfoEl = document.getElementById("country-info");
const bordersTitleEl = document.getElementById("borders-title");
const borderCountriesEl = document.getElementById("border-countries");

function showSpinner() {
    spinnerEl.style.display = "block";
}

function hideSpinner() {
    spinnerEl.style.display = "none";
}
function showError(message) {
    errorEl.textContent = message;
    errorEl.style.display = "block";
}
function hideError() {
    errorEl.style.display = "none";
    errorEl.textContent = "";
}


async function searchCountry(countryName) {
    const country = countryName.trim();

    if (!country) {
        showError("Please enter a country name.");
        return;
    }
    hideError();
    showSpinner();
    

    try{
        //show loading spinner
        //fetch country data
        //update dom
        //fetch bordering counries
        //update bordering countries section
    } catch(error){
        showError("An error occurred while fetching country data. Please try again.");
        //show error message

    } finally{
        hideSpinner();
        //hide loading spinner
    }
}

btnEl.addEventListener("click", () => {
    searchCountry(inputEl.value);
});

inputEl.addEventListener("keypress", (e) => {
    if(e.key === "Enter"){
        searchCountry(inputEl.value);
    }
});