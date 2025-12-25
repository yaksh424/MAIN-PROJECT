const API_BASE = 'http://localhost:3000/api';

// ==================== ПОЛУЧЕНИЕ ДАННЫХ ====================

async function fetchProducts() {
  try {
    const response = await fetch(`${API_BASE}/products`);
    return await response.json();
  } catch (error) {
    console.error('Ошибка загрузки товаров:', error);
    return [];
  }
}

async function fetchProductById(id) {
  try {
    const response = await fetch(`${API_BASE}/products/${id}`);
    return await response.json();
  } catch (error) {
    console.error('Ошибка загрузки товара:', error);
    return null;
  }
}

// ==================== СОЗДАНИЕ БРОНИРОВАНИЯ ====================

async function createBooking(data) {
  try {
    const response = await fetch(`${API_BASE}/bookings`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    });

    if (!response.ok) {
      throw new Error('Ошибка при создании бронирования');
    }

    const result = await response.json();
    return result;
  } catch (error) {
    console.error('Ошибка:', error);
    throw error;
  }
}

// ==================== СОЗДАНИЕ ЗАКАЗА ====================

async function createOrder(data) {
  try {
    const response = await fetch(`${API_BASE}/orders`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    });

    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      throw new Error(err.error || 'Ошибка при создании заказа');
    }

    const result = await response.json();
    return result;
  } catch (error) {
    console.error('Ошибка:', error);
    throw error;
  }
}

// ==================== РЕНДЕРИНГ КАТАЛОГА ====================

async function renderCatalog() {
  const products = await fetchProducts();
  const catalogGrid = document.querySelector('.catalog-grid');
  if (!catalogGrid) return;

  catalogGrid.innerHTML = products.map(p => `
    <div class="card">
      <div class="product-img">${p.image ? `<img src="${p.image}" alt="${p.name}" />` : '🪄'}</div>
      <h3>${p.name}</h3>
      <p class="muted">${p.category}</p>
      <p class="desc">${p.description}</p>
      <p class="price">${p.price} ₽</p>
      <a href="product.html?id=${p.id}" class="btn btn-primary">Подробнее</a>
    </div>
  `).join('');
}

// ==================== РЕНДЕРИНГ СТРАНИЦЫ МАШИНЫ ====================

async function renderProductDetail() {
  const urlParams = new URLSearchParams(window.location.search);
  const id = urlParams.get('id');
  if (!id) {
    document.body.innerHTML = '<p>Товар не найден</p>';
    return;
  }

  const product = await fetchProductById(id);
  if (!product) {
    document.body.innerHTML = '<p>Ошибка загрузки данных</p>';
    return;
  }

  const detail = document.querySelector('.product-detail');
  if (detail) {
    detail.innerHTML = `
      <div class="product-image">${product.image ? `<img src="${product.image}" alt="${product.name}" />` : '🪄'}</div>
      <div class="product-info">
        <h1>${product.name}</h1>
        <p class="muted">${product.category}</p>
        <p class="desc">${product.description}</p>
        <p class="price">${product.price} ₽</p>
        <p><strong>В наличии:</strong> ${product.stock}</p>

        <label>Количество: <input type="number" id="orderQty" value="1" min="1" max="${product.stock}" /></label>
        <div style="margin-top:1rem;">
          <button class="btn btn-primary" onclick="buyNow(${product.id}, '${product.name.replace(/'/g, "\\'")}', ${product.price})">Купить</button>
        </div>
      </div>
    `;
  }
}

// ==================== ФУНКЦИЯ ПОКУПКИ ====================

function buyNow(productId, name, price) {
  const qty = parseInt(document.getElementById('orderQty')?.value || '1');
  localStorage.setItem('selectedProduct', JSON.stringify({ id: productId, name, price, quantity: qty }));
  window.location.href = '../order/checkout.html';
}

// ==================== ОБРАБОТКА ФОРМЫ БРОНИРОВАНИЯ ====================

document.addEventListener('DOMContentLoaded', function() {
  // Форма бронирования услуги
  const bookingForm = document.querySelector('form[action*="booking"]');
  if (bookingForm) {
    bookingForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      const data = {
        name: document.querySelector('input[name="name"]')?.value,
        phone: document.querySelector('input[name="phone"]')?.value,
        email: document.querySelector('input[name="email"]')?.value,
        serviceType: document.querySelector('select[name="serviceType"]')?.value,
        date: document.querySelector('input[name="date"]')?.value,
        description: document.querySelector('textarea[name="description"]')?.value
      };

      try {
        const result = await createBooking(data);
        alert(`✅ Бронирование успешно создано! ID: ${result.booking.id}`);
        bookingForm.reset();
      } catch (error) {
        alert('❌ Ошибка при создании бронирования');
      }
    });
  }

  // Форма заказа
  const orderForm = document.querySelector('form[action*="order"]');
  if (orderForm) {
    orderForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const selected = JSON.parse(localStorage.getItem('selectedProduct') || '{}');

      const data = {
        name: document.querySelector('input[name="name"]')?.value,
        email: document.querySelector('input[name="email"]')?.value,
        phone: document.querySelector('input[name="phone"]')?.value,
        address: document.querySelector('input[name="address"]')?.value,
        productId: selected.id || null,
        quantity: selected.quantity || 1
      };

      try {
        const result = await createOrder(data);
        alert(`✅ Заказ успешно создан! ID: ${result.order.id}\nСумма: ${result.order.total} ₽`);
        localStorage.removeItem('selectedProduct');
        orderForm.reset();
        setTimeout(() => window.location.href = '../', 1500);
      } catch (error) {
        alert('❌ Ошибка при создании заказа: ' + (error.message || ''));
      }
    });
  }

  // Загрузка каталога
  if (document.querySelector('.catalog-grid')) {
    renderCatalog();
  }

  // Загрузка деталей товара
  if (document.querySelector('.product-detail')) {
    renderProductDetail();
  }
});
