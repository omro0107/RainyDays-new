/*cart*/
function renderBasketCount() {
  const cart = JSON.parse(localStorage.getItem('cart')) || [];
  const basketCountElement = document.getElementById('basket-count');
  basketCountElement.textContent = cart.reduce((total, item) => total + item.quantity, 0);
}

document.addEventListener('DOMContentLoaded', function () {
  renderBasketCount();
});

function addToCart(product) {
  renderBasketCount();
}

function removeCartItem(productId) {
  renderBasketCount();
}

