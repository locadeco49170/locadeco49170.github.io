//-----------------------------------------------------------------------
// Generation du Catalogue en partant du fichier Json : catalogue.json
//-----------------------------------------------------------------------

document.addEventListener('DOMContentLoaded', () => {
    fetch('../catalogue.json')
        .then(response => response.json())
        .then(data => {
            const catalogueSection = document.querySelector('.catalogue');
            data.forEach((article, index) => {
                const articleId = `article-${index + 1}`;
                const quantityId = `quantity-article-${index + 1}`;

                const item = document.createElement('div');
                item.className = 'item';

                item.innerHTML = `
                    <img src="../image/Catalogue/${article.image}" alt="${article.titre}">
                    <h3>${article.titre}</h3>
                    <p>${article.prix}</p>
                    ${article.description ? `<p>${article.description}</p>` : ''}
                    <div class="quantity-selector">
                        <button class="quantity-btn"
                            onclick="changeQuantity('${quantityId}', -1, '${articleId}', '${article.titre}', ${parseFloat(article.prix.replace(',', '.'))})">-</button>
                        <input type="number" id="${quantityId}" name="quantity" value="0" min="0">
                        <button class="quantity-btn"
                            onclick="changeQuantity('${quantityId}', 1, '${articleId}', '${article.titre}', ${parseFloat(article.prix.replace(',', '.'))})">+</button>
                    </div>
                `;

                catalogueSection.appendChild(item);
                
                //-----------------------------------------------------------------------
                // Ajout de l'écouteur pour la saisie manuelle
                //-----------------------------------------------------------------------
                const input = item.querySelector(`#${quantityId}`);

                // Quand l'utilisateur écrit
                input.addEventListener('input', () => {
                    // Ne garder que les chiffres
                    input.value = input.value.replace(/\D/g, '');

                    // Supprimer les zéros inutiles
                    input.value = input.value.replace(/^0+(?=\d)/, '');

                    const quantity = parseInt(input.value) || 0;

                    if (quantity > 0) {
                        cart[articleId] = {
                            name: article.titre,
                            price: parseFloat(article.prix.replace(',', '.')),
                            quantity: quantity
                        };
                    } else {
                        delete cart[articleId];
                    }

                    displayCart();
                });

                // Quand il quitte le champ
                input.addEventListener('blur', () => {
                    if (input.value === '') {
                        input.value = 0;
                        delete cart[articleId];
                        displayCart();
                    }
                });

                // Bonus : Empêcher les touches non numériques
                input.addEventListener('keypress', (e) => {
                    if (!/[0-9]/.test(e.key)) {
                        e.preventDefault();
                    }
                });

                input.addEventListener('paste', (e) => {
                    const pasted = (e.clipboardData || window.clipboardData).getData('text');
                    if (!/^\d+$/.test(pasted)) {
                        e.preventDefault();
                    }
                });

            });
        })
        .catch(error => console.error('Erreur lors du chargement du catalogue:', error));
});
