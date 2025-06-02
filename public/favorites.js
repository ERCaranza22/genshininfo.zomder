// Utility to get favorites from localStorage
function getFavorites() {
    const favs = localStorage.getItem('favorites');
    return favs ? JSON.parse(favs) : [];
}

// Character data mapping for rendering favorite cards
const characterData = {
    "Albedo": {
        icon: "assets/characters/icon/Albedo_Icon.png",
        element: "assets/elements/geo-element.png",
        elementAlt: "Geo",
        stars: "⭐⭐⭐⭐⭐",
        weapon: "Sword",
        fullImage: "assets/characters/wish/Albedo.png"
    },

    "Amber": {
        icon: "assets/characters/icon/Amber_Icon.png",
        element: "assets/elements/pyro-element.png",
        elementAlt: "Pyro",
        stars: "⭐⭐⭐⭐",
        weapon: "Bow",
        fullImage: "assets/characters/wish/Amber.png"
    },

    "Arlecchino": {
        icon: "assets/characters/icon/Arlecchino_Icon.png",
        element: "assets/elements/hydro-element.png",
        elementAlt: "Hydro",
        stars: "⭐⭐⭐⭐⭐",
        weapon: "Polearm",
        fullImage: "assets/characters/wish/Arlecchino.png"
    },

    "Bennett": {
        icon: "assets/characters/icon/Bennett_Icon.png",
        element: "assets/elements/pyro-element.png",
        elementAlt: "Pyro",
        stars: "⭐⭐⭐⭐⭐",
        weapon: "Sword",
        fullImage: "assets/characters/wish/Bennett.png"
    },

    "Diluc": {
        icon: "assets/characters/icon/Diluc_Icon.png",
        element: "assets/elements/pyro-element.png",
        elementAlt: "Pyro",
        stars: "⭐⭐⭐⭐⭐",
        weapon: "Claymore",
        fullImage: "assets/characters/wish/Diluc.png"
    },

    "Diona": {
        icon: "assets/characters/icon/Diona_Icon.png",
        element: "assets/elements/cryo-element.png",
        elementAlt: "Cryo",
        stars: "⭐⭐⭐⭐",
        weapon: "Bow",
        fullImage: "assets/characters/wish/Diona.png"
    },

    "Eula": {
        icon: "assets/characters/icon/Eula_Icon.png",
        element: "assets/elements/cryo-element.png",
        elementAlt: "Cryo",
        stars: "⭐⭐⭐⭐⭐",
        weapon: "Claymore",
        fullImage: "assets/characters/wish/Eula.png"
    },

    "Fischl": {
        icon: "assets/characters/icon/Fischl_Icon.png",
        element: "assets/elements/electro-element.png",
        elementAlt: "Electro",
        stars: "⭐⭐⭐⭐",
        weapon: "Bow",
        fullImage: "assets/characters/wish/Fischl.png"
    },

    "Ganyu": {
        icon: "assets/characters/icon/Ganyu_Icon.png",
        element: "assets/elements/cryo-element.png",
        elementAlt: "Cryo",
        stars: "⭐⭐⭐⭐⭐",
        weapon: "Bow",
        fullImage: "assets/characters/wish/Ganyu.png"
    },

    "Gorou": {
        icon: "assets/characters/icon/Gorou_Icon.png",
        element: "assets/elements/geo-element.png",
        elementAlt: "Geo",
        stars: "⭐⭐⭐⭐",
        weapon: "Bow",
        fullImage: "assets/characters/wish/Gorou.png"
    },

    "Hu Tao": {
        icon: "assets/characters/icon/HuTao_Icon.png",
        element: "assets/elements/pyro-element.png",
        elementAlt: "Pyro",
        stars: "⭐⭐⭐⭐⭐",
        weapon: "Polearm",
        fullImage: "assets/characters/wish/HuTao.png"
    },

    "Kaedehara Kazuha": {
        icon: "assets/characters/icon/KaedeharaKazuha_Icon.png",
        element: "assets/elements/anemo-element.png",
        elementAlt: "Anemo",
        stars: "⭐⭐⭐⭐⭐",
        weapon: "Sword",
        fullImage: "assets/characters/wish/KaedeharaKazuha.png"
    },

    "Kamisato Ayaka": {
        icon: "assets/characters/icon/KamisatoAyaka_Icon.png",
        element: "assets/elements/cryo-element.png",
        elementAlt: "Cryo",
        stars: "⭐⭐⭐⭐⭐",
        weapon: "Sword",
        fullImage: "assets/characters/wish/KamisatoAyaka.png"
    },

    "Kamisato Ayato": {
        icon: "assets/characters/icon/KamisatoAyato_Icon.png",
        element: "assets/elements/hydro-element.png",
        elementAlt: "Hydro",
        stars: "⭐⭐⭐⭐⭐",
        weapon: "Sword",
        fullImage: "assets/characters/wish/KamisatoAyato.png"
    },

    "Keqing": {
        icon: "assets/characters/icon/Keqing_Icon.png",
        element: "assets/elements/electro-element.png",
        elementAlt: "Electro",
        stars: "⭐⭐⭐⭐⭐",
        weapon: "Sword",
        fullImage: "assets/characters/wish/Keqing.png"
    },

    "Klee": {
        icon: "assets/characters/icon/Klee_Icon.png",
        element: "assets/elements/pyro-element.png",
        elementAlt: "Pyro",
        stars: "⭐⭐⭐⭐⭐",
        weapon: "Catalyst",
        fullImage: "assets/characters/wish/Klee.png"
    },

    "Kuki Shinobu": {
        icon: "assets/characters/icon/KukiShinobu_Icon.png",
        element: "assets/elements/electro-element.png",
        elementAlt: "Electro",
        stars: "⭐⭐⭐⭐",
        weapon: "Sword",
        fullImage: "assets/characters/wish/KukiShinobu.png"
    },

    "Mavuika": {
        icon: "assets/characters/icon/Mavuika_Icon.png",
        element: "assets/elements/dendro-element.png",
        elementAlt: "Dendro",
        stars: "⭐⭐⭐⭐⭐",
        weapon: "Sword",
        fullImage: "assets/characters/wish/Mavuika.png"
    },

    "Mika": {
        icon: "assets/characters/icon/Mika_Icon.png",
        element: "assets/elements/cryo-element.png",
        elementAlt: "Cryo",
        stars: "⭐⭐⭐⭐",
        weapon: "Polearm",
        fullImage: "assets/characters/wish/Mika.png"
    },

    "Mona": {
        icon: "assets/characters/icon/Mona_Icon.png",
        element: "assets/elements/hydro-element.png",
        elementAlt: "Hydro",
        stars: "⭐⭐⭐⭐⭐",
        weapon: "Catalyst",
        fullImage: "assets/characters/wish/Mona.png"
    },

    "Nilou": {
        icon: "assets/characters/icon/Nilou_Icon.png",
        element: "assets/elements/hydro-element.png",
        elementAlt: "Hydro",
        stars: "⭐⭐⭐⭐⭐",
        weapon: "Sword",
        fullImage: "assets/characters/wish/Nilou.png"
    },

    "Ningguang": {
        icon: "assets/characters/icon/Ningguang_Icon.png",
        element: "assets/elements/geo-element.png",
        elementAlt: "Geo",
        stars: "⭐⭐⭐⭐",
        weapon: "Catalyst",
        fullImage: "assets/characters/wish/Ningguang.png"
    },

    "Noelle": {
        icon: "assets/characters/icon/Noelle_Icon.png",
        element: "assets/elements/geo-element.png",
        elementAlt: "Geo",
        stars: "⭐⭐⭐⭐",
        weapon: "Claymore",
        fullImage: "assets/characters/wish/Noelle.png"
    },

    "Raiden Shogun": {
        icon: "assets/characters/icon/RaidenShogun_Icon.png",
        element: "assets/elements/electro-element.png",
        elementAlt: "Electro",
        stars: "⭐⭐⭐⭐⭐",
        weapon: "Polearm",
        fullImage: "assets/characters/wish/RaidenShogun.png"
    },

    "Sangonomiya Kokomi": {
        icon: "assets/characters/icon/Kokomi_Icon.png",
        element: "assets/elements/hydro-element.png",
        elementAlt: "Hydro",
        stars: "⭐⭐⭐⭐⭐",
        weapon: "Catalyst",
        fullImage: "assets/characters/wish/Kokomi.png"
    },

    "Shikanoin Heizou": {
        icon: "assets/characters/icon/ShikanoinHeizou_Icon.png",
        element: "assets/elements/anemo-element.png",
        elementAlt: "Anemo",
        stars: "⭐⭐⭐⭐",
        weapon: "Sword",
        fullImage: "assets/characters/wish/ShikanoinHeizou.png"
    },

    "Sucrose": {
        icon: "assets/characters/icon/Sucrose_Icon.png",
        element: "assets/elements/anemo-element.png",
        elementAlt: "Anemo",
        stars: "⭐⭐⭐⭐",
        weapon: "Catalyst",
        fullImage: "assets/characters/wish/Sucrose.png"
    },

    "Tartaglia": {
        icon: "assets/characters/icon/Tartaglia_Icon.png",
        element: "assets/elements/hydro-element.png",
        elementAlt: "Hydro",
        stars: "⭐⭐⭐⭐⭐",
        weapon: "Bow",
        fullImage: "assets/characters/wish/Tartaglia.png"
    },

    "Thoma": {
        icon: "assets/characters/icon/Thoma_Icon.png",
        element: "assets/elements/pyro-element.png",
        elementAlt: "Pyro",
        stars: "⭐⭐⭐⭐",
        weapon: "Polearm",
        fullImage: "assets/characters/wish/Thoma.png"
    },

    "Tighnari": {
        icon: "assets/characters/icon/Tighnari_Icon.png",
        element: "assets/elements/dendro-element.png",
        elementAlt: "Dendro",
        stars: "⭐⭐⭐⭐⭐",
        weapon: "Bow",
        fullImage: "assets/characters/wish/Tighnari.png"
    },

    "Venti": {
        icon: "assets/characters/icon/Venti_Icon.png",
        element: "assets/elements/anemo-element.png",
        elementAlt: "Anemo",
        stars: "⭐⭐⭐⭐⭐",
        weapon: "Bow",
        fullImage: "assets/characters/wish/Venti.png"
    },

    "Wanderer": {
        icon: "assets/characters/icon/Wanderer_Icon.png",
        element: "assets/elements/anemo-element.png",
        elementAlt: "Anemo",
        stars: "⭐⭐⭐⭐⭐",
        weapon: "Catalyst",
        fullImage: "assets/characters/wish/Wanderer.png"
    },

    "Xiangling": {
        icon: "assets/characters/icon/Xiangling_Icon.png",
        element: "assets/elements/pyro-element.png",
        elementAlt: "Pyro",
        stars: "⭐⭐⭐⭐",
        weapon: "Polearm",
        fullImage: "assets/characters/wish/Xiangling.png"
    },

    "Xiao": {
        icon: "assets/characters/icon/Xiao_Icon.png",
        element: "assets/elements/anemo-element.png",
        elementAlt: "Anemo",
        stars: "⭐⭐⭐⭐⭐",
        weapon: "Polearm",
        fullImage: "assets/characters/wish/Xiao.png"
    },

    "Xingqiu": {
        icon: "assets/characters/icon/Xingqiu_Icon.png",
        element: "assets/elements/hydro-element.png",
        elementAlt: "Hydro",
        stars: "⭐⭐⭐⭐",
        weapon: "Sword",
        fullImage: "assets/characters/wish/Xingqiu.png"
    },

    "Yae Miko": {
        icon: "assets/characters/icon/YaeMiko_Icon.png",
        element: "assets/elements/electro-element.png",
        elementAlt: "Electro",
        stars: "⭐⭐⭐⭐⭐",
        weapon: "Catalyst",
        fullImage: "assets/characters/wish/YaeMiko.png"
    },

    "Yanfei": {
        icon: "assets/characters/icon/Yanfei_Icon.png",
        element: "assets/elements/pyro-element.png",
        elementAlt: "Pyro",
        stars: "⭐⭐⭐⭐",
        weapon: "Catalyst",
        fullImage: "assets/characters/wish/Yanfei.png"
    },
    
    "Yelan": {
        icon: "assets/characters/icon/Yelan_Icon.png",
        element: "assets/elements/hydro-element.png",
        elementAlt: "Hydro",
        stars: "⭐⭐⭐⭐⭐",
        weapon: "Bow",
        fullImage: "assets/characters/wish/Yelan.png"
    },

    "Yoimiya": {
        icon: "assets/characters/icon/Yoimiya_Icon.png",
        element: "assets/elements/pyro-element.png",
        elementAlt: "Pyro",
        stars: "⭐⭐⭐⭐⭐",
        weapon: "Bow",
        fullImage: "assets/characters/wish/Yoimiya.png"
    },

    "Yun Jin": {
        icon: "assets/characters/icon/YunJin_Icon.png",
        element: "assets/elements/geo-element.png",
        elementAlt: "Geo",
        stars: "⭐⭐⭐⭐",
        weapon: "Polearm",
        fullImage: "assets/characters/wish/YunJin.png"
    },

    "Zhongli": {
        icon: "assets/characters/icon/Zhongli_Icon.png",
        element: "assets/elements/geo-element.png",
        elementAlt: "Geo",
        stars: "⭐⭐⭐⭐⭐",
        weapon: "Polearm",
        fullImage: "assets/characters/wish/Zhongli.png"
    }
};

// Function to create a character card element
function createCharacterCard(name, data) {
    const cardDiv = document.createElement('div');
    cardDiv.className = `card_${name.toLowerCase().replace(/\s+/g, '_')}`;

    cardDiv.innerHTML = `
        <div class="character-card">
            <div class="image-container" onclick="toggleInfo(this)">
                <img class="character-img" src="${data.icon}" alt="${name}">
                <img class="element-icon" src="${data.element}" alt="${data.elementAlt}">
            </div>
            <div class="character-info hidden">
                <h2>${name}</h2>
                <div class="stars">${data.stars}</div>
                <p>Weapon: ${data.weapon}</p>
                <button onclick="showPopup(event, '${data.fullImage}')">Full Image</button>
                <button class="favorite-button active">❤️</button>
            </div>
        </div>
    `;
    return cardDiv;
}

// Toggle character info on image click
function toggleInfo(imageContainer) {
    const card = imageContainer.closest('.character-card');
    const info = card.querySelector('.character-info');
    info.classList.toggle('hidden');
}

// Show full image popup
function showPopup(event, imageUrl) {
    event.stopPropagation();
    const popup = document.getElementById('popup');
    const popupImg = document.getElementById('popup-img');
    popupImg.src = imageUrl;
    popup.style.display = 'flex';
    document.body.classList.add('no-scroll');
}

// Hide the popup
function hidePopup() {
    const popup = document.getElementById('popup');
    const popupImg = document.getElementById('popup-img');
    popup.style.display = 'none';
    popupImg.src = '';
    document.body.classList.remove('no-scroll');
}

// Close popup when clicking outside the image
document.addEventListener('click', (e) => {
    const popup = document.getElementById('popup');
    if (popup.style.display === 'flex' && !e.target.closest('.popup-content')) {
        hidePopup();
    }
});

// Load favorite characters and render cards
document.addEventListener('DOMContentLoaded', () => {
    const favoritesGrid = document.getElementById('favorites-grid');
    const favorites = getFavorites();

    if (favorites.length === 0) {
        favoritesGrid.innerHTML = '<p>No favorite characters yet.</p>';
        return;
    }

    favorites.forEach(name => {
        const data = characterData[name];
        if (data) {
            const card = createCharacterCard(name, data);
            favoritesGrid.appendChild(card);
        }
    });

    // Add event listeners for favorite buttons to allow removing from favorites
    const favoriteButtons = document.querySelectorAll('.favorite-button');
    favoriteButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            e.stopPropagation();
            const card = button.closest('.character-card');
            const charName = card.querySelector('h2').textContent;

            // Remove from favorites in localStorage
            let favorites = getFavorites();
            favorites = favorites.filter(name => name !== charName);
            localStorage.setItem('favorites', JSON.stringify(favorites));

            // Remove card from DOM
            card.parentNode.removeChild(card);

            // If no favorites left, show message
            if (favorites.length === 0) {
                favoritesGrid.innerHTML = '<p>No favorite characters yet.</p>';
            }
        });
    });
});