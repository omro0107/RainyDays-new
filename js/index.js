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
    addToCart(product);
  });

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


async function main() {
  createCart();
  const responseData = await doFetch(API_RAINYDAYS_URL);
  products.push(...responseData.data);
  displayProductsInSlideshow();
}

main();
