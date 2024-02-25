/*cart*/
function renderCartCount() {
  const cart = JSON.parse(localStorage.getItem('cart')) || [];
  const cartCountElement = document.getElementById('basket-count');
  cartCountElement.textContent = cart.reduce((total, item) => total + item.quantity, 0);
}

document.addEventListener('DOMContentLoaded', function () {
  renderCartCount();
});
