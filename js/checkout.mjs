function renderCheckoutSummary() {
  const cartItems = JSON.parse(localStorage.getItem('cart')) || [];

  const cartSummary = document.getElementById('cart-summary');
  cartSummary.innerHTML = ''; // Clear previous summary

  let totalPrice = 0;

  cartItems.forEach(item => {
    const itemTotalPrice = item.quantity * item.price;
    totalPrice += itemTotalPrice;

    const itemSummary = document.createElement('div');
    itemSummary.classList.add('item-summary');
    itemSummary.innerHTML = `
      <h3>${item.title}</h3>
      <p>Quantity: ${item.quantity}</p>
      <p>Price: £${itemTotalPrice.toFixed(2)}</p>
    `;
    cartSummary.appendChild(itemSummary);
  });

  // Display total price
  const totalElement = document.createElement('div');
  totalElement.classList.add('total');
  totalElement.textContent = `Total: £${totalPrice.toFixed(2)}`;
  cartSummary.appendChild(totalElement);
}

document.addEventListener('DOMContentLoaded', function () {
  renderCheckoutSummary();

  const checkoutButton = document.getElementById('checkout-button');
  checkoutButton.addEventListener('click', () => {
    window.location.href = '../html/checkout-success.html'; // Redirect to checkout success page
  });
});

