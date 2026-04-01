# Carbon Cases Frontend

Modern React e-commerce frontend for Carbon Cases - premium carbon fiber accessories.

## Features

- 🛍️ Product catalog with categories
- 🔐 User authentication (email + Google OAuth)
- 📧 Email verification system
- 🛒 Shopping cart functionality
- ❤️ Wishlist management
- 💳 Checkout process
- 👤 User profile management
- 🎨 Luxury dark theme with Tailwind CSS
- 📱 Fully responsive design

## Admin Features

- 📊 Admin dashboard
- 📦 Product management (CRUD)
- 👥 User management
- 📋 Order management
- 📈 Analytics overview

## Tech Stack

- React 18
- React Router DOM
- Tailwind CSS
- Axios for API calls
- Context API for state management

## Environment Variables

Create a `.env` file:

```
REACT_APP_API_URL=https://carboncases-back.vercel.app/api
```

## Getting Started

```bash
npm install
npm start
```

## Deployment

This app is configured for Vercel deployment. The backend API is hosted at:
https://carboncases-back.vercel.app/

## API Integration

The frontend connects to the Carbon Cases backend API for:
- User authentication and management
- Product catalog and management
- Shopping cart and orders
- Email verification
- Google OAuth integration