# Readify Backend API

Production-ready backend for Readify E-Book Store built with Node.js, Express, and MongoDB.

## Features

- ✅ User Authentication (JWT)
- ✅ Book Management (CRUD)
- ✅ Order Management
- ✅ UPI QR Code Payment Integration
- ✅ Order History
- ✅ Ad Tracking for Facebook Pixel/Google Ads
- ✅ Admin Dashboard APIs
- ✅ Security (Helmet, CORS, Rate Limiting)
- ✅ MVC Architecture

## Tech Stack

- Node.js
- Express.js
- MongoDB + Mongoose
- JWT Authentication
- bcryptjs for password hashing

## Installation

1. **Install Dependencies**

```bash
cd backend
npm install
```

2. **Environment Setup**

Create a `.env` file in the backend directory:

```env
PORT=5000
NODE_ENV=development

MONGO_URI=mongodb://localhost:27017/readify

JWT_SECRET=your_jwt_secret_key_here

UPI_QR_CODE_URL=https://your-domain.com/uploads/upi-qr.png
UPI_ID=yourname@paytm

CLIENT_URL=http://localhost:3000

ADMIN_EMAIL=admin@readify.com
ADMIN_PASSWORD=admin123
```

3. **Start MongoDB**

Make sure MongoDB is running on your system.

4. **Run Server**

```bash
# Development mode
npm run dev

# Production mode
npm start
```

Server will run on `http://localhost:5000`

## API Endpoints

### Authentication (`/api/auth`)

```
POST   /register           - Register new user
POST   /login              - Login user
GET    /profile            - Get user profile (Protected)
PUT    /profile            - Update user profile (Protected)
```

### Books (`/api/books`)

```
GET    /                   - Get all books
GET    /categories         - Get book categories
GET    /:id                - Get single book
POST   /                   - Create book (Admin only)
PUT    /:id                - Update book (Admin only)
DELETE /:id                - Delete book (Admin only)
```

### Orders (`/api/orders`)

```
POST   /                   - Create new order (Protected)
GET    /my-orders          - Get user orders (Protected)
GET    /:id                - Get single order (Protected)
PUT    /:id                - Update order (Protected)
```

### Payment (`/api/payment`)

```
POST   /create-order       - Create payment order (Protected)
POST   /verify             - Verify payment (Protected)
GET    /status/:orderId    - Get payment status (Protected)
```

### Ad Tracking (`/api/ads`)

```
POST   /track              - Track ad event (Public)
GET    /analytics          - Get ad analytics (Admin only)
```

### Admin (`/api/admin`)

```
GET    /dashboard          - Get dashboard stats (Admin only)
GET    /orders             - Get all orders (Admin only)
GET    /users              - Get all users (Admin only)
PUT    /orders/:id         - Update order status (Admin only)
```

## Payment Flow (UPI QR Code)

Since you don't have Razorpay API, this uses UPI QR code:

1. **Create Payment Order**
   - POST `/api/payment/create-order`
   - Returns QR code URL and UPI ID

2. **User Scans QR Code**
   - User scans QR with any UPI app
   - Completes payment
   - Takes screenshot

3. **Verify Payment**
   - POST `/api/payment/verify`
   - User submits transaction ID and screenshot
   - Order status updated to "pending verification"

4. **Admin Verification**
   - Admin reviews payment screenshot
   - Updates order status via admin panel

## Models

### User
```javascript
{
  name: String,
  email: String (unique),
  password: String (hashed),
  role: String (user/admin),
  timestamps
}
```

### Book
```javascript
{
  title: String,
  author: String,
  description: String,
  price: Number,
  image: String,
  category: String,
  rating: Number,
  pages: Number,
  isActive: Boolean,
  timestamps
}
```

### Order
```javascript
{
  user: ObjectId,
  customerDetails: Object,
  books: Array,
  totalAmount: Number,
  paymentId: String,
  transactionId: String,
  paymentScreenshot: String,
  status: String,
  timestamps
}
```

### AdEvent
```javascript
{
  user: ObjectId,
  sessionId: String,
  eventType: String,
  book: ObjectId,
  metadata: Object,
  ipAddress: String,
  userAgent: String,
  timestamps
}
```

## Security Features

- Password hashing with bcryptjs
- JWT authentication
- Helmet for security headers
- CORS configuration
- Rate limiting (100 requests per 15 minutes)
- MongoDB sanitization

## Admin Dashboard Stats

The `/api/admin/dashboard` endpoint provides:

- Total users count
- Total books count
- Total orders count
- Total revenue
- Recent orders
- Orders by status
- Sales by month (last 6 months)

## Ad Tracking Events

Track these events for Facebook Pixel/Google Ads:

- `view` - Book page view
- `click` - Book card click
- `add_to_cart` - Add to cart
- `purchase` - Order completed
- `page_view` - General page view

## Error Handling

All errors return JSON response:

```json
{
  "success": false,
  "message": "Error message here"
}
```

## Testing with Postman/Thunder Client

1. Register a user
2. Login to get JWT token
3. Add token to Authorization header: `Bearer <token>`
4. Test protected routes

## Production Deployment

1. Set `NODE_ENV=production`
2. Use proper MongoDB Atlas URI
3. Change JWT_SECRET
4. Set up proper CORS origins
5. Use process manager like PM2

```bash
npm install -g pm2
pm2 start server.js --name readify-api
```

## License

MIT
