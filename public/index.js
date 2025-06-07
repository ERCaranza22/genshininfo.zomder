document.addEventListener('DOMContentLoaded', () => {
    const charactersGrid = document.getElementById('characters-grid');
    const loadingIndicator = document.getElementById('loadingIndicator');
    const imagePopup = document.getElementById('imagePopup');
    const popupImage = document.getElementById('popupImage');
    const closePopup = document.querySelector('.close-popup');

    // Load characters
    async function loadCharacters() {
        try {
            loadingIndicator.style.display = 'flex';
            const response = await fetch('/api/characters');
            const characters = await response.json();
            
            // Clear existing content
            charactersGrid.innerHTML = '';

            // Create character cards
            characters.forEach(character => {
                const card = createCharacterCard(character);
                charactersGrid.appendChild(card);
            });

        } catch (error) {
            console.error('Failed to load characters:', error);
            charactersGrid.innerHTML = '<p class="error-message">Failed to load characters. Please try again later.</p>';
        } finally {
            loadingIndicator.style.display = 'none';
        }
    }

    // Create character card
    function createCharacterCard(character) {
        const cardDiv = document.createElement('div');
        cardDiv.className = `card_${character.name.toLowerCase()}`;
        
        cardDiv.innerHTML = `
            <div class="character-card">
                <div class="image-container" onclick="toggleInfo(this)">
                    <img class="character-img" src="${character.iconPath}" alt="${character.name}">
                    <img class="element-icon" src="${character.elementIconPath}" alt="${character.element}">
                </div>
                <div class="character-info hidden">
                    <h2>${character.name}</h2>
                    <div class="five-stars">${'⭐'.repeat(character.rarity)}</div>
                    <p>Weapon: ${character.weapon}</p>
                    <button onclick="showPopup(event, '${character.wishArtPath}')">Full Image</button>
                </div>
            </div>
        `;

        // Toggle character info
        const info = cardDiv.querySelector('.character-info');
        info.addEventListener('click', () => {
            info.classList.toggle('hidden');
        });

        return cardDiv;
    }

    // Toggle character info
    window.toggleInfo = function(element) {
        const info = element.parentElement.querySelector('.character-info');
        info.classList.toggle('hidden');
    };

    // Show character image popup
    window.showPopup = function(event, imagePath) {
        event.stopPropagation();
        popupImage.src = imagePath;
        imagePopup.style.display = 'flex';
    };

    // Close popup on click
    closePopup.addEventListener('click', () => {
        imagePopup.style.display = 'none';
    });

    // Close popup on outside click
    imagePopup.addEventListener('click', (e) => {
        if (e.target === imagePopup) {
            imagePopup.style.display = 'none';
        }
    });

    // Initialize
    loadCharacters();
}); 