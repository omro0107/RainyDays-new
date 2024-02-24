import { API_RAINYDAYS_URL } from "./constants.mjs";
import { doFetch } from "./utils/dofetch.mjs";

let currentIndex = 0;
const productsPerPage = 3; 
const products = []; 

function createCart() {
  const cart = localStorage.getItem('cart');
  if (!cart) {
    localStorage.setItem('cart', JSON.stringify([]));
  }
}

function addToCart(product) {
  const cart = JSON.parse(localStorage.getItem('cart'));
  const itemIndex = cart.findIndex(currentProduct => product.id === currentProduct.id);
  if (itemIndex === -1) {
    cart.push({ ...product, quantity: 1 });
  } else {
    cart[itemIndex].quantity += 1;
  }
  localStorage.setItem('cart', JSON.stringify(cart));
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

  const productPriceContainer = document.createElement('div');

  const productPrice = document.createElement('div');
  productPrice.textContent = product.price;

  const productDiscountedPrice = document.createElement('div');
  productDiscountedPrice.textContent = product.discountedPrice;

  const productBuyButton = document.createElement('button');
  productBuyButton.textContent = 'Buy';
  productBuyButton.classList.add('product-buy-button');
  productBuyButton.addEventListener('click', () => {
    addToCart(product);
  });

  productPriceContainer.append(productPrice, productDiscountedPrice);
  productContainer.append(heading, productImage, productPriceContainer, productBuyButton);
  productWrapper.appendChild(productContainer);

  return productWrapper;
}

function displayProducts(products) {
  const productsDisplayContainer = document.getElementById('products-display');
  console.log(products);
  products.forEach((product) => {
    const productHtml = generateProductHtml(product);
    productsDisplayContainer.appendChild(productHtml);
  });
}

function displayProductsInSlideshow() {
  const productsDisplayContainer = document.getElementById('products-display');
  productsDisplayContainer.innerHTML = '';
  const startIndex = currentIndex * productsPerPage;
  const endIndex = startIndex + productsPerPage;
  const currentProducts = products.slice(startIndex, endIndex);

  currentProducts.forEach((product) => {
    const productHtml = generateProductHtml(product);
    productsDisplayContainer.appendChild(productHtml);
  });
}

document.getElementById('prev-btn').addEventListener('click', () => {
  if (currentIndex > 0) {
    currentIndex--;
    displayProductsInSlideshow();
  }
});

document.getElementById('next-btn').addEventListener('click', () => {
  const totalPages = Math.ceil(products.length / productsPerPage);
  if (currentIndex < totalPages - 1) {
    currentIndex++;
    displayProductsInSlideshow();
  }
});


document.querySelectorAll('.product-buy-button').forEach(button => {
  button.addEventListener('click', (event) => {
    const productId = event.target.dataset.productId;
    const product = products.find(product => product.id === productId);
    if (product) {
      addToCart(product);
      console.log('Product added to cart:', product);
    } else {
      console.error('Product not found:', productId);
    }
  });
});


async function main() {
  createCart();
  const responseData = await doFetch(API_RAINYDAYS_URL);
  products.push(...responseData.data);
  displayProductsInSlideshow();
}

main();
