import { API_RAINYDAYS_URL } from "./utils/constants.mjs";
import { doFetch } from "./utils/dofetch.mjs";

function createCart() {
  const cart = localStorage.getItem('cart');
  if (!cart) {
    localStorage.setItem('cart', JSON.stringify([]));
  }
}

function renderCart() {
  const cartItems = JSON.parse(localStorage.getItem('cart')) || [];
  const cartItemsList = document.getElementById('cart-items');
  cartItemsList.innerHTML = ''; // Clear previous items

  cartItems.forEach(item => {
    const li = document.createElement('li');
    li.textContent = `${item.title} - Quantity: ${item.quantity}`;
    const removeButton = document.createElement('button');
    removeButton.textContent = 'Remove';
    removeButton.addEventListener('click', () => removeCartItem(item.id));
    li.appendChild(removeButton);
    cartItemsList.appendChild(li);
  });
}

function generateProductHtml(product) {
  const productWrapper = document.createElement('div');
  productWrapper.classList.add('product-wrapper');

  const productContainer = document.createElement('div');
  productContainer.classList.add('product-container');

  const heading = document.createElement('h3');
  heading.textContent = product.title;

  const productImage = document.createElement('img');
  productImage.src = product.image.url;
  productImage.alt = product.title;
  productImage.classList.add('product-image');

  const productPriceContainer = document.createElement('div');

  if (product.onSale) {
    const saleText = document.createElement('div');
    saleText.textContent = 'On Sale!';
    saleText.classList.add('sale-text');
    productContainer.appendChild(saleText);
  }
  
  if (product.discountedPrice < product.price) {
    const productPrice = document.createElement('div');
    productPrice.textContent = product.price;
    productPriceContainer.appendChild(productPrice);
  }
 
  const productPrice = document.createElement('div');
  productPrice.textContent = product.onSale ? product.discountedPrice : product.price;

  if (product.onSale) {
    productPrice.style.color = 'red';
  }  

  const addToCartButton = document.createElement('button');
  addToCartButton.textContent = 'Add to Cart';
  addToCartButton.classList.add('add-to-cart-button');
  addToCartButton.addEventListener('click', () => {
    Event.preventDefault();
    addToCart(product);
  });
  console.log(addToCartButton);

  const viewProductButton = document.createElement('button');
  viewProductButton.textContent = 'View Product';
  viewProductButton.classList.add('view-product-button');
  viewProductButton.addEventListener('click', () => {
    window.location.href = `../html/product.html?id=${product.id}`;
  });

  productPriceContainer.append(productPrice);
  productContainer.append(heading, productImage, productPriceContainer, addToCartButton, viewProductButton);
  productWrapper.appendChild(productContainer);

  return productWrapper;
}


function addToCart(product) {
  const cart = JSON.parse(localStorage.getItem('cart')) || [];
  const existingItem = cart.find(item => item.id === product.id);

  if (existingItem) {
    existingItem.quantity++;
  } else {
    cart.push({ ...product, quantity: 1 });
  }

  localStorage.setItem('cart', JSON.stringify(cart));
  renderCart();
}

function removeCartItem(productId) {
  let cart = JSON.parse(localStorage.getItem('cart')) || [];
  cart = cart.filter(item => item.id !== productId);
  localStorage.setItem('cart', JSON.stringify(cart));
  renderCart();
}


function displayProducts(products) {
  const productsDisplayContainer = document.getElementById('products-display');
  productsDisplayContainer.innerHTML = ''; // Clear previous products
  products.forEach((product) => {
    const productHtml = generateProductHtml(product);
    productHtml.addEventListener('click', () => {
      navigateToProductPage(product.id);
    });
    productsDisplayContainer.appendChild(productHtml);
  });
}

function navigateToProductPage(productId) {
  window.location.href = `../html/product.html?id=${productId}`;
}

// Function to filter products by gender
function filterProducts(gender) {
  const filteredProducts = window.products.filter(product => product.gender.toLowerCase() === gender.toLowerCase());
  displayProducts(filteredProducts);
}

function resetFilter() {
  displayProducts(window.products);
}

async function main() {
  createCart();
  const responseData = await doFetch(API_RAINYDAYS_URL);
  window.products = responseData.data;
  renderCart();
  displayProducts(window.products);

  //gender filters
  const genderFilterButtons = document.querySelectorAll('.genderFilterButton');
  genderFilterButtons.forEach(button => {
    button.addEventListener('click', function() {
      const gender = this.dataset.gender; // Get the gender from data-gender attribute
      filterProducts(gender);
    });
  });

  //buttons
  const resetFilterButton = document.getElementById('resetFilterButton');
  resetFilterButton.addEventListener('click', resetFilter);

  const clearCartButton = document.getElementById('clear-cart');
  clearCartButton.addEventListener('click', () => {
    localStorage.removeItem('cart');
    renderCart();
  });

  const goToCheckoutButton = document.getElementById('go-to-checkout');
  goToCheckoutButton.addEventListener('click', () => {
    window.location.href = '../html/checkout.html'; // Redirect to checkout page
  });
}

main();
