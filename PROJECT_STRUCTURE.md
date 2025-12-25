# Структура проекта "Лафка у Оливандера"

## 📁 Корневые файлы

### Основные файлы приложения
- **`server.js`** - Express.js сервер с REST API (8 эндпоинтов), Swagger документация, обработка запросов к базе данных
- **`database.json`** - JSON база данных в 3НФ с товарами (12), заказами (2), бронированиями (2)
- **`package.json`** - Зависимости Node.js проекта (express, cors, swagger-ui-express, swagger-jsdoc)
- **`package-lock.json`** - Закрепленные версии зависимостей
- **`index.html`** - Главная страница сайта, точка входа для пользователей

### Документация
- **`README.md`** - Основная документация проекта, инструкция по запуску и использованию
- **`QUICK_START.md`** - Краткая инструкция для быстрого старта проекта
- **`INSTRUKCIYA_SCREENSHOTS.md`** - Подробная инструкция по созданию скриншотов для отчета
- **`todo.md`** - Список задач и планов развития проекта
- **`OTCHET_FINAL.rtf`** - **Готовый отчет по лабораторной работе** (разделы 2.1-2.11, Times New Roman, 1.5 интервал)

### Системные файлы
- **`.gitignore`** - Исключения для Git (node_modules, .env, логи)

---

## 📂 Директории

### `/admin` - Административная панель
- **`login.html`** - Страница входа для администратора (упрощенная авторизация)
- **`catalog-manage.html`** - Управление каталогом товаров
- **`orders.html`** - Просмотр и управление заказами
- **`service-appointments.html`** - Управление бронированиями мастер-классов

### `/catalog` - Каталог товаров
- **`index.html`** - Страница списка всех товаров с карточками
- **`product.html`** - Детальная страница конкретного товара

### `/order` - Оформление заказов
- **`checkout.html`** - Форма оформления заказа с валидацией

### `/service` - Услуги и бронирование
- **`book.html`** - Форма бронирования мастер-классов и консультаций

### `/assets` - Статические ресурсы

#### `/assets/css`
- **`style.css`** - Основные стили приложения (grid, карточки товаров, формы, кнопки)

#### `/assets/js`
- **`main.js`** - Клиентский JavaScript (fetch API, обработка форм, валидация, взаимодействие с бэкендом)

#### `/assets/img`
- Изображения товаров, логотипы, иконки (SVG/PNG)

### `/includes`
- **`header.html`** - Переиспользуемый хедер сайта (навигация, логотип)

### `/.github`
- **`copilot-instructions.md`** - Инструкции для GitHub Copilot по работе с проектом

### `/node_modules`
- Установленные npm пакеты (express, cors, swagger и их зависимости)

---

## 🔌 API Endpoints (server.js)

| Метод | Путь | Описание |
|-------|------|----------|
| GET | `/api/products` | Получить список всех товаров |
| GET | `/api/products/:id` | Получить один товар по ID |
| POST | `/api/orders` | Создать заказ (с проверкой stock) |
| GET | `/api/orders` | Получить все заказы |
| POST | `/api/bookings` | Создать бронирование |
| GET | `/api/bookings` | Получить все бронирования |
| GET | `/api/health` | Проверка работоспособности сервера |
| GET | `/api-docs` | Swagger UI документация |

---

## 🗄️ База данных (database.json)

### Структура в 3НФ:

**Таблица `products`:**
- id (PK), name, category, description, price, stock, image

**Таблица `orders`:**
- id (PK), productId (FK → products), quantity, customerName, customerEmail, customerAddress, status, createdAt

**Таблица `bookings`:**
- id (PK), serviceType, date, customerName, customerEmail, status, createdAt

---

## 🚀 Запуск проекта

```bash
# Установка зависимостей
npm install

# Запуск сервера
npm start

# Сервер доступен на http://localhost:3000
# Swagger UI: http://localhost:3000/api-docs
```

---

## 📋 Основные технологии

- **Backend:** Node.js v14+, Express.js v4.18.2
- **Database:** JSON файл (персистентное хранилище)
- **API Documentation:** Swagger/OpenAPI 3.0
- **Frontend:** HTML5, CSS3, Vanilla JavaScript
- **HTTP Client:** Fetch API

---

## 🎯 Назначение файлов по типу

### Конфигурация проекта
- `package.json`, `package-lock.json`, `.gitignore`

### Серверная логика
- `server.js`, `database.json`

### Пользовательский интерфейс
- `index.html`, `/catalog/*`, `/order/*`, `/service/*`, `/admin/*`

### Стили и скрипты
- `/assets/css/style.css`, `/assets/js/main.js`

### Документация
- `README.md`, `QUICK_START.md`, `INSTRUKCIYA_SCREENSHOTS.md`, `todo.md`

### Отчет
- **`OTCHET_FINAL.rtf`** - Готовый отчет для сдачи (открыть в Word, добавить скриншоты)

---

## ✅ Готовность проекта

- ✅ REST API с 8 эндпоинтами
- ✅ Swagger документация
- ✅ JSON база данных в 3НФ
- ✅ Фронтенд с 11 HTML страницами
- ✅ Полная документация
- ✅ **Готовый отчет OTCHET_FINAL.rtf**

---

**Проект готов к демонстрации и сдаче отчета.**
