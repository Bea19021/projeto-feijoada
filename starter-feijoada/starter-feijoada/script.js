const botoes = document.querySelectorAll('.btn-add');
const contador = document.getElementById('contador-pedido');
const cartToggle = document.querySelector('.cart-toggle');
const cartPanel = document.getElementById('cart-panel');
const cartOverlay = document.getElementById('cart-overlay');
const cartItemsList = document.getElementById('cart-items');
const cartCount = document.getElementById('cart-count');
const cartQuantity = document.getElementById('cart-quantity');
const cartTotal = document.getElementById('cart-total');
const cartEmptyMsg = document.getElementById('cart-empty');
const cartClose = document.getElementById('cart-close');
const cartCheckout = document.getElementById('cart-checkout');
const form = document.querySelector('.form');
const feedback = document.getElementById('form-feedback');

let cart = {};

const formatCurrency = (value) => value.toLocaleString('pt-BR', {
  style: 'currency',
  currency: 'BRL'
});

const parsePrice = (priceText) => {
  if (!priceText) return 0;
  return Number(priceText.replace(/\./g, '').replace(',', '.')) || 0;
};

const updateCartDisplay = () => {
  const items = Object.values(cart);
  const quantity = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalValue = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  contador.textContent = String(quantity);
  cartCount.textContent = String(quantity);
  cartQuantity.textContent = `${quantity} item${quantity !== 1 ? 's' : ''}`;
  cartTotal.textContent = formatCurrency(totalValue);
  cartCheckout.disabled = quantity === 0;

  if (items.length === 0) {
    cartEmptyMsg.style.display = 'block';
    cartItemsList.style.display = 'none';
  } else {
    cartEmptyMsg.style.display = 'none';
    cartItemsList.style.display = 'grid';
    cartItemsList.innerHTML = items.map((item) => `
      <li class="cart-item">
        <div class="cart-item-info">
          <span class="cart-item-name">${item.name}</span>
          <span class="cart-item-price">${formatCurrency(item.price)}</span>
        </div>
        <div class="cart-item-controls">
          <button type="button" class="cart-btn-link cart-remove" data-name="${item.name}" aria-label="Remover ${item.name}">Remover</button>
          <span class="cart-item-qty">x${item.quantity}</span>
        </div>
      </li>
    `).join('');
  }
};

const openCart = () => {
  cartPanel.hidden = false;
  cartOverlay.hidden = false;
  cartPanel.setAttribute('aria-hidden', 'false');
  cartOverlay.classList.add('active');
  document.body.style.overflow = 'hidden';
};

const closeCart = () => {
  cartPanel.hidden = true;
  cartOverlay.hidden = true;
  cartPanel.setAttribute('aria-hidden', 'true');
  cartOverlay.classList.remove('active');
  document.body.style.overflow = '';
};

const addToCart = (event) => {
  const card = event.currentTarget.closest('.card');
  if (!card) return;

  const name = card.querySelector('h3')?.textContent.trim() || 'Item';
  const priceText = card.querySelector('.price span')?.textContent.trim();
  const price = parsePrice(priceText);

  if (!cart[name]) {
    cart[name] = {
      name,
      price,
      quantity: 0
    };
  }

  cart[name].quantity += 1;
  updateCartDisplay();
  openCart();
};

botoes.forEach((btn) => btn.addEventListener('click', addToCart));

cartToggle.addEventListener('click', openCart);
cartClose.addEventListener('click', closeCart);
cartOverlay.addEventListener('click', closeCart);

cartItemsList.addEventListener('click', (event) => {
  const target = event.target;
  if (!target.matches('.cart-remove')) return;

  const name = target.dataset.name;
  if (cart[name]) {
    delete cart[name];
    updateCartDisplay();
  }
});

cartCheckout.addEventListener('click', () => {
  if (Object.keys(cart).length === 0) return;
  alert(`Pedido finalizado! Total: ${cartTotal.textContent}`);
  cart = {};
  updateCartDisplay();
  closeCart();
});

updateCartDisplay();

window.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && !cartPanel.hidden) {
    closeCart();
  }
});

document.getElementById('ano').textContent = new Date().getFullYear();

form.addEventListener('submit', (e) => {
  e.preventDefault();
  const nome = form.nome.value.trim();
  const email = form.email.value.trim();
  const mensagem = form.mensagem.value.trim();

  feedback.classList.remove('success', 'error');

  if (!nome || !email || !mensagem) {
    feedback.textContent = 'Por favor, preencha todos os campos.';
    feedback.classList.add('error');
    return;
  }

  if (!email.includes('@')) {
    feedback.textContent = 'Informe um e-mail válido.';
    feedback.classList.add('error');
    return;
  }

  feedback.textContent = `Obrigado, ${nome}! Sua mensagem foi enviada.`;
  feedback.classList.add('success');
  form.reset();
});
