document.addEventListener('DOMContentLoaded', function () {
  renderBoughtProductsSummary();
});

function renderBoughtProductsSummary() {
  const cartItems = JSON.parse(localStorage.getItem('cart')) || [];
  const boughtProductsSummary = document.getElementById('bought-products-summary');

  boughtProductsSummary.innerHTML = '';

  if (cartItems.length === 0) {
      boughtProductsSummary.textContent = 'No products purchased';
      return;
  }

  let totalCost = 0;

  cartItems.forEach(item => {
      const itemSummary = document.createElement('div');
      itemSummary.classList.add('bought-product-summary');
      itemSummary.innerHTML = `
        <div class="product-details">
          <img src="${item.image.url}" alt="${item.title}" class="product-image">
          <div class="text-details">
              <h3>${item.title}</h3>
              <p>Quantity: ${item.quantity}</p>
              <p>Price: £${(item.quantity * item.price).toFixed(2)}</p>
          </div>
        </div>
      `;

      boughtProductsSummary.appendChild(itemSummary);

      totalCost += item.quantity * item.price;
  });

  const totalCostElement = document.createElement('div');
  totalCostElement.classList.add('total-cost');
  totalCostElement.textContent = `Total Cost: £${totalCost.toFixed(2)}`;
  boughtProductsSummary.appendChild(totalCostElement);


  clearCart();
  }

function clearCart() {
  localStorage.removeItem('cart');
}