const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');

const app = express();
const PORT = 3000;
const DB_FILE = path.join(__dirname, 'database.json');

// Middleware
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());
app.use(express.static(path.join(__dirname)));

// Swagger configuration
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Лафка у Оливандера - API',
      version: '1.0.0',
      description: 'API для учебного проекта интернет-магазина "Лафка у Оливандера"'
    },
    servers: [
      {
        url: `http://localhost:${PORT}`,
        description: 'Development server'
      },
      {
        url: '/',
        description: 'Relative URL'
      }
    ],
    components: {
      schemas: {
        Product: {
          type: 'object',
          properties: {
            id: { type: 'integer' },
            name: { type: 'string' },
            category: { type: 'string' },
            description: { type: 'string' },
            price: { type: 'number' },
            stock: { type: 'integer' },
            image: { type: 'string' }
          }
        },
        Order: {
          type: 'object',
          properties: {
            id: { type: 'integer' },
            name: { type: 'string' },
            email: { type: 'string' },
            phone: { type: 'string' },
            address: { type: 'string' },
            productId: { type: 'integer' },
            productName: { type: 'string' },
            quantity: { type: 'integer' },
            total: { type: 'number' },
            status: { type: 'string', enum: ['processing', 'completed', 'cancelled'] },
            createdAt: { type: 'string', format: 'date-time' }
          }
        },
        Booking: {
          type: 'object',
          properties: {
            id: { type: 'integer' },
            name: { type: 'string' },
            phone: { type: 'string' },
            email: { type: 'string' },
            serviceType: { type: 'string' },
            date: { type: 'string', format: 'date' },
            description: { type: 'string' },
            status: { type: 'string', enum: ['pending', 'confirmed', 'cancelled'] },
            createdAt: { type: 'string', format: 'date-time' }
          }
        }
      }
    }
  },
  apis: [__filename]
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Database helper functions
function loadDatabase() {
  if (fs.existsSync(DB_FILE)) {
    try {
      const data = fs.readFileSync(DB_FILE, 'utf-8');
      return JSON.parse(data);
    } catch (e) {
      console.error('Ошибка при загрузке БД:', e.message);
      return getDefaultDatabase();
    }
  }
  return getDefaultDatabase();
}

function getDefaultDatabase() {
  return {
    products: [
      { id: 1, name: 'Волшебная палочка №1', category: 'Палочки', description: 'Кленовая палочка, 11 дюймов, с сердцевиной из пера феникса.', price: 1200, stock: 5, image: '/assets/img/wand1.svg' },
      { id: 2, name: 'Масло для метлы', category: 'Средства', description: 'Специальное масло для улучшения скольжения метлы.', price: 250, stock: 12, image: '/assets/img/oil.svg' },
      { id: 3, name: 'Метла «Сквиббы»', category: 'Транспорт', description: 'Легкая спортивная метла для гонок.', price: 4500, stock: 2, image: '/assets/img/broom.svg' },
      { id: 4, name: 'Набор зелий (3 шт.)', category: 'Зелья', description: 'Мини-набор популярных зелий для начинающих магов.', price: 800, stock: 7, image: '/assets/img/potions.svg' },
      { id: 5, name: 'Шляпа-коробка', category: 'Аксессуары', description: 'Скромная шляпа для вечерних прогулок по Хогсмиду.', price: 300, stock: 20, image: '/assets/img/hat.svg' }
    ],
    orders: [],
    bookings: []
  };
}

function saveDatabase(db) {
  fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2), 'utf-8');
}

// Load database
let db = loadDatabase();
let products = db.products;
let orders = db.orders;
let bookings = db.bookings;

/**
 * @swagger
 * /api/products:
 *   get:
 *     summary: Получить список всех товаров
 *     tags: [Товары]
 *     responses:
 *       200:
 *         description: Список товаров
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Product'
 */
app.get('/api/products', (req, res) => {
  res.json(products);
});

/**
 * @swagger
 * /api/products/{id}:
 *   get:
 *     summary: Получить товар по ID
 *     tags: [Товары]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID товара
 *     responses:
 *       200:
 *         description: Информация о товаре
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 *       404:
 *         description: Товар не найден
 */
app.get('/api/products/:id', (req, res) => {
  const product = products.find(p => p.id === parseInt(req.params.id));
  if (!product) return res.status(404).json({ error: 'Товар не найден' });
  res.json(product);
});

/**
 * @swagger
 * /api/orders:
 *   post:
 *     summary: Оформить заказ
 *     tags: [Заказы]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - phone
 *               - address
 *               - productId
 *               - quantity
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *                 format: email
 *               phone:
 *                 type: string
 *               address:
 *                 type: string
 *               productId:
 *                 type: integer
 *               quantity:
 *                 type: integer
 *     responses:
 *       201:
 *         description: Заказ создан
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 order:
 *                   $ref: '#/components/schemas/Order'
 *       400:
 *         description: Ошибка валидации
 *       404:
 *         description: Товар не найден
 *   get:
 *     summary: Получить список заказов
 *     tags: [Заказы]
 *     responses:
 *       200:
 *         description: Список заказов
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Order'
 */
app.post('/api/orders', (req, res) => {
  const { name, email, phone, address, productId, quantity } = req.body;
  if (!name || !email || !phone || !productId || !quantity) {
    return res.status(400).json({ error: 'Поля name, email, phone, productId и quantity обязательны' });
  }

  const product = products.find(p => p.id === parseInt(productId));
  if (!product) return res.status(404).json({ error: 'Товар не найден' });
  if (product.stock < quantity) return res.status(400).json({ error: 'Недостаточно товара на складе' });

  product.stock -= quantity;
  const total = product.price * quantity;
  const order = {
    id: orders.length + 1,
    name,
    email,
    phone,
    address,
    productId: product.id,
    productName: product.name,
    quantity,
    total,
    status: 'processing',
    createdAt: new Date()
  };
  orders.push(order);
  
  // Сохранить в БД
  db.products = products;
  db.orders = orders;
  saveDatabase(db);
  
  res.status(201).json({ success: true, order });
});

app.get('/api/orders', (req, res) => {
  res.json(orders);
});

/**
 * @swagger
 * /api/bookings:
 *   post:
 *     summary: Создать запись на мастер-класс
 *     tags: [Бронирования]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - phone
 *               - email
 *               - serviceType
 *               - date
 *             properties:
 *               name:
 *                 type: string
 *               phone:
 *                 type: string
 *               email:
 *                 type: string
 *                 format: email
 *               serviceType:
 *                 type: string
 *               date:
 *                 type: string
 *                 format: date
 *               description:
 *                 type: string
 *     responses:
 *       201:
 *         description: Запись создана
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 booking:
 *                   $ref: '#/components/schemas/Booking'
 *       400:
 *         description: Ошибка валидации
 *   get:
 *     summary: Получить список записей
 *     tags: [Бронирования]
 *     responses:
 *       200:
 *         description: Список записей
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Booking'
 */
app.post('/api/bookings', (req, res) => {
  const { name, phone, email, serviceType, date, description } = req.body;
  if (!name || !phone || !email || !serviceType || !date) {
    return res.status(400).json({ error: 'Поля name, phone, email, serviceType и date обязательны' });
  }

  const booking = {
    id: bookings.length + 1,
    name,
    phone,
    email,
    serviceType,
    date,
    description: description || '',
    status: 'pending',
    createdAt: new Date()
  };
  bookings.push(booking);
  
  // Сохранить в БД
  db.bookings = bookings;
  saveDatabase(db);
  
  res.status(201).json({ success: true, booking });
});

app.get('/api/bookings', (req, res) => {
  res.json(bookings);
});

/**
 * @swagger
 * /api/health:
 *   get:
 *     summary: Проверка здоровья сервера
 *     tags: [Система]
 *     responses:
 *       200:
 *         description: Сервер работает
 */
app.get('/api/health', (req, res) => res.json({ status: 'OK' }));

app.listen(PORT, () => {
  console.log(`🪄 Лафка API запущена на http://localhost:${PORT}`);
  console.log(`📚 Документация: http://localhost:${PORT}/api-docs`);
  console.log(`💾 База данных: ${DB_FILE}`);
});
