# Copilot Instructions — Лафка у Оливандера

## Project Overview
**Лафка у Оливандера** (Olivander's Shop) is an educational e-commerce project for magical items. It combines a Node.js/Express backend with client-side HTML/CSS/JavaScript frontend. The system manages products, orders, and service bookings with an admin panel and Swagger API documentation.

## Architecture

### Backend (server.js)
- **Framework**: Express.js (v4.18.2) with CORS enabled
- **API Structure**: RESTful endpoints at `/api/*`
- **Data Storage**: In-memory arrays (products, orders, bookings) — no database
- **Documentation**: Swagger/OpenAPI specs embedded in server.js via swagger-jsdoc

### Frontend Organization
- **Public Pages**: index.html (home), catalog/*, order/*, service/* — served as static files
- **Admin Panel**: admin/ folder — login.html (dummy auth), catalog-manage.html, orders.html
- **Shared Assets**: assets/css/style.css, assets/js/main.js, assets/img/

## API Endpoints Summary

| Method | Path | Purpose |
|--------|------|---------|
| GET | /api/products | List all products |
| GET | /api/products/:id | Fetch single product |
| POST | /api/orders | Create order (validates stock, deducts inventory) |
| GET | /api/orders | List all orders |
| POST | /api/bookings | Create service booking |
| GET | /api/bookings | List all bookings |
| GET | /api/health | Health check |

### Request/Response Pattern
- **Content-Type**: application/json
- **Error Responses**: `{ error: "message" }` with status codes (400, 404)
- **Success Responses**: `{ success: true, order/booking }` (201 for POST)

## Key Workflows

### Starting Development
```bash
npm install
npm start          # Runs server on http://localhost:3000
npm run dev        # Runs with nodemon (auto-restart on changes)
```

### Adding New API Endpoints
1. Define Swagger JSDoc block before route handler (see products endpoints in server.js as template)
2. Implement route handler with validation
3. For data persistence: manually manage in-memory arrays or add database layer
4. Test via `/api-docs` Swagger UI or curl

### Frontend-to-Backend Integration
- All client code uses `API_BASE = 'http://localhost:3000/api'` in assets/js/main.js
- Fetch calls must handle JSON responses and errors (see fetchProducts, createBooking as patterns)
- Forms submit via `createOrder()` or `createBooking()` helper functions in main.js

## Code Patterns & Conventions

### Product Data Structure
```javascript
{ id, name, category, description, price, stock, image }
```
- Stock is decremented on order creation (no actual payment processing)
- Must validate productId exists and stock >= quantity before order creation

### Order/Booking Tracking
- Auto-increment IDs: `orders.length + 1`, `bookings.length + 1`
- Include timestamps: `createdAt: new Date()`
- Track status: orders use 'processing', bookings use 'pending'

### Admin Panel Authentication
- **No real authentication** — login.html redirects directly to catalog-manage.html
- Admin pages fetch data client-side from `/api/orders` and `/api/bookings`
- Future: add token-based auth with middleware

## Common Tasks

### Fetch Products in Frontend
Use `fetchProducts()` from main.js — returns array or empty on error.

### Modify Product Stock
Edit the in-memory `products` array in server.js (lines 35-40). Persist changes by adding database or file storage.

### Add New Service Type
Create form in service/book.html, add serviceType validation in `/api/bookings` POST handler, update Swagger docs.

### Debug API Calls
- Swagger UI: http://localhost:3000/api-docs
- Browser DevTools Network tab to inspect requests
- Server console logs all requests

## Project Structure Notes
- No build step required — static files served directly
- Path resolution: all relative links assume root is project directory
- Images in assets/img/ referenced as `/assets/img/filename.svg`
- Styling centralized in assets/css/style.css (grid, card, button utilities defined there)

## Tech Stack
- **Node**: 14+ required (check with `node --version`)
- **Dependencies**: express, cors, swagger-ui-express, swagger-jsdoc
- **DevDependencies**: nodemon (optional, for auto-reload)
- **Compatibility**: Windows PowerShell paths must use quotes for paths with spaces/Cyrillic

## Limitations & Notes
- In-memory data resets on server restart
- No input sanitization or XSS protection
- Admin access unrestricted (for learning purposes)
- CORS enabled for all origins
- Single-threaded (Node processes one request at a time sequentially)
