document.addEventListener('DOMContentLoaded', function () {
  renderBoughtProductsSummary();
});

function renderBoughtProductsSummary() {
  const cartItems = JSON.parse(localStorage.getItem('cart')) || [];
  const boughtProductsSummary = document.getElementById('bought-products-summary');

  // Clear previous summary
  boughtProductsSummary.innerHTML = '';

  // Check if there are items in the cart
  if (cartItems.length === 0) {
      boughtProductsSummary.textContent = 'No products purchased';
      return;
  }

  cartItems.forEach(item => {
      const itemSummary = document.createElement('div');
      itemSummary.classList.add('bought-product-summary');
      itemSummary.innerHTML = `
          <h3>${item.title}</h3>
          <p>Quantity: ${item.quantity}</p>
          <p>Price: £${(item.quantity * item.price).toFixed(2)}</p>
      `;
      boughtProductsSummary.appendChild(itemSummary);
  });
}