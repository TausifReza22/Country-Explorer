const apiUrl = 'https://restcountries.com/v3.1/all';
let countries = [];
let favorites = JSON.parse(localStorage.getItem('favorites')) || [];

// Fetch all countries
async function fetchCountries() {
    const response = await fetch(apiUrl);
    countries = await response.json();
    displayCountries(countries.slice(0, 20)); // Display the first 20 countries
}

// Display country cards
function displayCountries(countries) {
    const countryList = document.getElementById('countries');
    countryList.innerHTML = '';
    
    countries.forEach(country => {
        const countryCard = document.createElement('div');
        countryCard.className = 'country-card';
        countryCard.innerHTML = `
            <img src="${country.flags.svg}" alt="${country.name.common}" width="100">
            <h3>${country.name.common}</h3>
            <button class="favorite-button" data-country="${country.name.common}">
                ${favorites.includes(country.name.common) ? 'Unfavorite' : 'Favorite'}
            </button>
        `;
        countryList.appendChild(countryCard);
    });
    addFavoriteEventListeners();
}

// Search functionality
document.getElementById('search').addEventListener('input', (e) => {
    const searchTerm = e.target.value.toLowerCase();
    const filteredCountries = countries.filter(country =>
        country.name.common.toLowerCase().includes(searchTerm)
    );
    displayCountries(filteredCountries.slice(0, 5)); // Show up to 5 results
    showSuggestions(filteredCountries);
});

// Show suggestions for search
function showSuggestions(filteredCountries) {
    const suggestions = document.getElementById('suggestions');
    suggestions.innerHTML = '';

    filteredCountries.forEach(country => {
        const suggestionItem = document.createElement('div');
        suggestionItem.textContent = country.name.common;
        suggestionItem.addEventListener('click', () => {
            document.getElementById('search').value = country.name.common;
            displayCountries([country]);
            suggestions.innerHTML = '';
        });
        suggestions.appendChild(suggestionItem);
    });
}

// Load more countries
document.getElementById('load-more').addEventListener('click', () => {
    const currentCount = document.querySelectorAll('.country-card').length;
    displayCountries(countries.slice(currentCount, currentCount + 20));
});

// Add event listeners for favorite buttons
function addFavoriteEventListeners() {
    const favoriteButtons = document.querySelectorAll('.favorite-button');
    favoriteButtons.forEach(button => {
        button.addEventListener('click', () => {
            const countryName = button.getAttribute('data-country');
            if (favorites.includes(countryName)) {
                favorites = favorites.filter(fav => fav !== countryName);
                button.textContent = 'Favorite';
            } else {
                if (favorites.length < 5) {
                    favorites.push(countryName);
                    button.textContent = 'Unfavorite';
                } else {
                    alert('You can only favorite up to 5 countries.');
                }
            }
            localStorage.setItem('favorites', JSON.stringify(favorites));
            updateFavoritesDisplay();
        });
    });
}

// Update favorites display
function updateFavoritesDisplay() {
    const favoritesList = document.getElementById('favorites-list');
    favoritesList.innerHTML = '';
    favorites.forEach(country => {
        const listItem = document.createElement('li');
        listItem.textContent = country;
        
        // Create a delete button
        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Delete';
        deleteButton.addEventListener('click', () => {
            deleteFavorite(country);
        });

        listItem.appendChild(deleteButton);
        favoritesList.appendChild(listItem);
    });
}

// Delete favorite country
function deleteFavorite(countryName) {
    favorites = favorites.filter(fav => fav !== countryName);
    localStorage.setItem('favorites', JSON.stringify(favorites));
    updateFavoritesDisplay();
}

// Initial fetch of countries
fetchCountries();
updateFavoritesDisplay();
