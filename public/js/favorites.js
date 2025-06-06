// Function to load favorites
async function loadFavorites() {
    const favoritesGrid = document.getElementById('favorites-grid');
    const noFavoritesMessage = document.getElementById('no-favorites');
    
    try {
        // Get favorites from localStorage
        const favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
        
        if (favorites.length === 0) {
            noFavoritesMessage.style.display = 'block';
            return;
        }

        noFavoritesMessage.style.display = 'none';
        
        // Clear existing content
        favoritesGrid.innerHTML = '';
        
        // Add each favorite character
        favorites.forEach(characterName => {
            const characterCard = createCharacterCard(characterName);
            favoritesGrid.appendChild(characterCard);
        });
    } catch (error) {
        console.error('Error loading favorites:', error);
        showMessage('Error loading favorites', true);
    }
}

// Function to create a character card
function createCharacterCard(characterName) {
    const cardDiv = document.createElement('div');
    cardDiv.className = `card_${characterName.toLowerCase().replace(/\s+/g, '-')}`;
    
    // Get character data (you would typically get this from your character data source)
    const characterData = getCharacterData(characterName);
    
    cardDiv.innerHTML = `
        <div class="character-card">
            <div class="image-container" onclick="toggleInfo(this)">
                <img class="character-img" src="assets/characters/icon/${characterName.replace(/\s+/g, '')}_Icon.png" alt="${characterName}">
                <img class="element-icon" src="assets/elements/${characterData.element}-element.png" alt="${characterData.element}">
            </div>
            <div class="character-info">
                <h2>${characterName}</h2>
                <div class="${characterData.rarity}-stars">${'⭐'.repeat(characterData.rarity)}</div>
                <p>Weapon: ${characterData.weapon}</p>
                <button onclick="showPopup(event, 'assets/characters/wish/${characterName.replace(/\s+/g, '')}.png')">Full Image</button>
                <button class="favorite-button active" onclick="removeFavorite('${characterName}')">❤️</button>
            </div>
        </div>
    `;
    
    return cardDiv;
}

// Function to get character data
function getCharacterData(characterName) {
    // This would typically come from your database or a data file
    // For now, we'll return some default data
    const defaultData = {
        element: 'pyro',
        rarity: 5,
        weapon: 'Sword'
    };
    
    // Add character-specific data here
    const characterData = {
        'Albedo': { element: 'geo', rarity: 5, weapon: 'Sword' },
        'Amber': { element: 'pyro', rarity: 4, weapon: 'Bow' },
        'Arlecchino': { element: 'pyro', rarity: 5, weapon: 'Polearm' },
        // Add more characters as needed
    };
    
    return characterData[characterName] || defaultData;
}

// Function to remove a favorite
function removeFavorite(characterName) {
    try {
        let favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
        favorites = favorites.filter(name => name !== characterName);
        localStorage.setItem('favorites', JSON.stringify(favorites));
        
        showMessage(`${characterName} removed from favorites`);
        loadFavorites(); // Reload the favorites grid
    } catch (error) {
        console.error('Error removing favorite:', error);
        showMessage('Error removing favorite', true);
    }
}

// Function to show popup message
function showMessage(message, isError = false) {
    const messageElement = document.getElementById('favorite-message');
    messageElement.textContent = message;
    messageElement.style.backgroundColor = isError ? '#e74c3c' : '#333';
    messageElement.style.display = 'block';
    messageElement.style.opacity = '1';
    
    setTimeout(() => {
        messageElement.style.opacity = '0';
        setTimeout(() => {
            messageElement.style.display = 'none';
        }, 500);
    }, 2000);
}

// Function to toggle character info
function toggleInfo(element) {
    const info = element.nextElementSibling;
    info.classList.toggle('hidden');
}

// Function to show character popup
function showPopup(event, imageSrc) {
    event.stopPropagation();
    const popup = document.getElementById('popup');
    const popupImg = document.getElementById('popup-img');
    popupImg.src = imageSrc;
    popup.style.display = 'flex';
}

// Function to hide character popup
function hidePopup() {
    const popup = document.getElementById('popup');
    const popupImg = document.getElementById('popup-img');
    popup.style.display = 'none';
    popupImg.src = '';
}

// Close popup when clicking outside
document.addEventListener('click', (e) => {
    const popup = document.getElementById('popup');
    if (e.target === popup) {
        hidePopup();
    }
}); 