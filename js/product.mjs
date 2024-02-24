import { API_RAINYDAYS_URL } from "./constants.mjs";
import { doFetch } from "./utils/dofetch.mjs";

document.addEventListener('DOMContentLoaded', function () {
    const productId = getProductIdFromUrl();
    fetchProductDetails(productId);
});

async function fetchProductDetails(productId) {
    try {
        const product = await getProductById(productId);
        renderProductDetails(product);
    } catch (error) {
        console.error('Error fetching product details:', error);
    }
}

async function getProductById(productId) {
    const response = await doFetch(`${API_RAINYDAYS_URL}/${productId}`);
    return response.data;
}

function renderProductDetails(product) {
    const productDetailsContainer = document.getElementById('product-details');
    productDetailsContainer.innerHTML = `
        <h1>${product.title}</h1>
        <img src="${product.image.url}" alt="${product.image.alt}">
        <p>Description: ${product.description}</p>
        <p>Gender: ${product.gender}</p>
        <label for="size">Size:</label>
        <select id="size">
            ${product.sizes.map(size => `<option value="${size}">${size}</option>`).join('')}
        </select>
        <p>Base Color: ${product.baseColor}</p>
        <p>Price: ${product.price}</p>
        ${product.onSale ? `<p>Discounted Price: ${product.discountedPrice}</p>` : ''}
        <button id="add-to-basket">Add to Basket</button>
    `;

    const addToBasketButton = document.getElementById('add-to-basket');
    addToBasketButton.addEventListener('click', () => addToCart(product));
}

function getProductIdFromUrl() {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('id');
}

function addToCart(product) {
    const selectedSize = document.getElementById('size').value;
    if (!selectedSize) {
      alert('Please select a size before adding to basket.');
      return;
    }

    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const existingItem = cart.find(item => item.id === product.id && item.size === selectedSize);

    if (existingItem) {
        existingItem.quantity++;
    } else {
        cart.push({ ...product, size: selectedSize, quantity: 1 });
    }

    localStorage.setItem('cart', JSON.stringify(cart));
    alert('Product added to basket!');
}
