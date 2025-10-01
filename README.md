# 🚀 NeoX.js

<div align="center">

![NeoX.js Logo](https://img.shields.io/badge/NeoX.js-v1.0.1-blue?style=for-the-badge&logo=node.js&logoColor=white)
[![NPM Version](https://img.shields.io/npm/v/neox.js?style=for-the-badge&logo=npm)](https://www.npmjs.com/package/neox.js)
[![create-neox-app](https://img.shields.io/npm/v/create-neox-app?style=for-the-badge&logo=npm&label=create-neox-app)](https://www.npmjs.com/package/create-neox-app)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](https://opensource.org/licenses/MIT)
[![Node.js](https://img.shields.io/badge/Node.js->=14.0.0-green.svg?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org/)

**The Smartest Node Backend Framework!**

Create production-ready Node.js backend applications in seconds.

</div>

---

## ✨ Quick Start

Get started with NeoX.js in just one command:

```bash
# Using create-neox-app (recommended)
npx create-neox-app my-app

# Or using neox.js directly
npx neox.js my-app

# Interactive mode (prompts for project name)
npx create-neox-app
```

That's it! Your backend is ready to go! 🎉

---

## 📦 What You Get

A complete, production-ready backend with:

- ✅ **Express.js** server with best practices
- ✅ **PostgreSQL** + Sequelize ORM integration
- ✅ **JWT Authentication** with refresh tokens
- ✅ **Role-based Access Control** (RBAC)
- ✅ **Passport.js** for OAuth (Google, LinkedIn)
- ✅ **Swagger/OpenAPI** documentation
- ✅ **File uploads** (Multer + Cloudinary)
- ✅ **Email service** with templates
- ✅ **Security** (Helmet, CORS, Rate limiting)
- ✅ **Git initialized** with initial commit
- ✅ **ESLint + Prettier** configured
- ✅ **Environment config** for local/dev/prod

---

## 🎯 Features

### 🔐 Authentication Out of the Box

- JWT access & refresh token system
- Multiple user types (SuperAdmin, Admin, Seller, Buyer)
- OAuth integration (Google, LinkedIn)
- Email verification
- Password reset functionality
- Session management

### 🗄️ Database Ready

- Sequelize ORM configured
- PostgreSQL support
- Auto-discovery of models
- Migration system ready
- Seeding support

### 📖 API Documentation

- Swagger UI at `/api-docs`
- Auto-generated from code
- Interactive API testing

### 🛡️ Enterprise Security

- Helmet.js security headers
- CORS configuration
- Rate limiting
- Input sanitization
- HPP protection

### 🧩 Modular Architecture

```
your-app/
├── configs/          # Configuration files
├── server/
│   ├── core/        # Core authentication
│   ├── lib/         # Libraries (JWT, DB, etc.)
│   ├── middlewares/ # Custom middlewares
│   └── utils/       # Utilities
└── src/
    └── modules/     # Your feature modules
```

---

## 🚀 Getting Started

### Prerequisites

- Node.js >= 14.0.0
- PostgreSQL database
- npm or yarn

### Create Your App

```bash
# Using npx (recommended - no installation required)
npx create-neox-app my-backend-app

# Or use neox.js directly
npx neox.js my-backend-app

# Interactive mode
npx create-neox-app

# You'll be prompted for:
# - Project name (if not provided as argument)
# - Description
# - Author name
```

### Configure Environment

```bash
cd my-backend-app

# Copy the example environment file
cp .env.example .env.local

# Edit .env.local with your database credentials
# and other configuration
```

### Run Your App

```bash
# Development mode
npm run dev:local

# Production mode
npm start
```

Your API will be running at `http://localhost:4000` 🎉

---

## 📚 Documentation

### Available Scripts

```bash
# Development
npm run dev:local          # Run with nodemon (local env)
npm run dev:server         # Run on dev server

# Production
npm start                  # Production mode

# Database
npm run migration:generate # Create new migration
npm run migration:run      # Run migrations
npm run seed:run          # Run seeders

# Code Quality
npm run lint              # Lint and fix code
```

### Environment Variables

Key environment variables you need to configure:

```env
# Server
PORT=4000
NODE_ENV=local

# Database
POSTGRES_HOST=localhost
POSTGRES_PORT=5432
POSTGRES_USER=your_user
POSTGRES_PASSWORD=your_password
POSTGRES_DATABASE=your_database

# JWT
ACCESS_TOKEN_SECRET=your_secret_here
REFRESH_TOKEN_SECRET=your_secret_here

# Email
MAIL_USER=your_email@gmail.com
MAIL_PASSWORD=your_app_password
```

See `.env.example` in your project for complete configuration.

---

## 🧩 Creating Modules

Add new features easily with the modular structure:

```javascript
// src/modules/blog/blog.model.js
export default (sequelize, DataTypes) => {
  const Blog = sequelize.define("blog", {
    title: DataTypes.STRING,
    content: DataTypes.TEXT,
  });
  return Blog;
};

// src/modules/blog/blog.route.js
export default (router) => {
  router.get("/blogs", BlogController.getAll);
  router.post("/blogs", BlogController.create);
};
```

NeoX.js automatically discovers and loads your modules!

---

## 🔐 Authentication API

Built-in authentication endpoints:

```bash
POST /api/signup/:userType    # Register new user
POST /api/signin/:userType    # Login
GET  /api/me                  # Get current user
POST /api/refresh-token       # Refresh access token
GET  /api/signout             # Logout
POST /api/forgot-password     # Password reset
```

---

## 🌟 Why NeoX.js?

| Feature        | NeoX.js       | Express Generator | Other Frameworks |
| -------------- | ------------- | ----------------- | ---------------- |
| Authentication | ✅ Built-in   | ❌ Manual         | ⚠️ Varies        |
| Database ORM   | ✅ Sequelize  | ❌ None           | ⚠️ Varies        |
| API Docs       | ✅ Swagger    | ❌ None           | ⚠️ Manual        |
| Security       | ✅ Complete   | ⚠️ Basic          | ⚠️ Varies        |
| File Upload    | ✅ Configured | ❌ Manual         | ⚠️ Manual        |
| OAuth          | ✅ Ready      | ❌ Manual         | ⚠️ Manual        |
| Git Init       | ✅ Auto       | ❌ Manual         | ❌ Manual        |

---

## 🤝 Contributing

Contributions are welcome! Please check out our [Contributing Guide](CONTRIBUTING.md).

---

## 📄 License

MIT © [Pushkar Kumar Sah](https://github.com/Pushkarcdn)

---

## 🙏 Support

- ⭐ Star this repo
- 🐛 Report bugs via [Issues](https://github.com/Pushkarcdn/neox.js/issues)
- 💡 Request features
- 📖 Read the [full documentation](https://github.com/Pushkarcdn/neox.js)

---

<div align="center">

Made with ❤️ by [Pushkar Kumar Sah](https://pushkar.live)

[NPM](https://www.npmjs.com/package/neox.js) • [GitHub](https://github.com/Pushkarcdn/neox.js) • [Documentation](https://github.com/Pushkarcdn/neox.js)

</div>
