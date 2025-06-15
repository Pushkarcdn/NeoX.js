# 🚀 NeoX.js

<div align="center">

![NeoX.js Logo](https://img.shields.io/badge/NeoX.js-v0.0.1-blue?style=for-the-badge&logo=node.js&logoColor=white)
[![License: ISC](https://img.shields.io/badge/License-ISC-yellow.svg?style=for-the-badge)](https://opensource.org/licenses/ISC)
[![Node.js](https://img.shields.io/badge/Node.js->=22.14.0-green.svg?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org/)
[![NPM](https://img.shields.io/badge/NPM->=10.9.2-red.svg?style=for-the-badge&logo=npm&logoColor=white)](https://www.npmjs.com/)

**A modern, fast, and secure JavaScript framework for building robust Node.js backend applications**

[Documentation](https://github.com/Pushkarcdn/neoX.js) • [Examples](#-quick-start) • [API Reference](#-api-documentation) • [Contributing](#-contributing)

</div>

---

## 📋 Table of Contents

- [Features](#-features)
- [Architecture](#-architecture)
- [Quick Start](#-quick-start)
- [Installation](#-installation)
- [Configuration](#-configuration)
- [Module System](#-module-system)
- [Authentication & Authorization](#-authentication--authorization)
- [Database](#-database)
- [API Documentation](#-api-documentation)
- [Scripts](#-available-scripts)
- [Security](#-security)
- [File Upload](#-file-upload)
- [Environment Variables](#-environment-variables)
- [Contributing](#-contributing)
- [License](#-license)

---

## ✨ Features

### 🏗️ **Modular Architecture**

- **Module-based structure** for organized and scalable code
- **Auto-discovery** of routes and modules
- **Dynamic loading** of components

### 🔐 **Advanced Authentication**

- **JWT-based authentication** with access and refresh tokens
- **Multi-user type support** (SuperAdmin, Admin, Seller, Buyer)
- **Role-based access control** (RBAC)
- **Passport.js integration** for authentication strategies

### 🛡️ **Enterprise Security**

- **Helmet.js** for security headers
- **Rate limiting** protection
- **CORS** configuration
- **Input sanitization** and validation
- **HPP** protection against parameter pollution

### 🗄️ **Database Integration**

- **Sequelize ORM** with PostgreSQL support
- **Automatic model discovery** and loading
- **Database migrations** and seeding
- **Transaction support** with CLS (Continuation Local Storage)

### 📁 **File Management**

- **Multer** for file uploads
- **Cloudinary** integration for cloud storage
- **Multiple storage options**

### 📖 **API Documentation**

- **Swagger/OpenAPI** integration
- **Interactive API explorer**
- **Automatic documentation generation**

### 🚀 **Performance & Monitoring**

- **Compression** middleware for response optimization
- **Morgan** logging with environment-specific configurations
- **Winston** logger with daily rotation
- **Request context tracking**

---

## 🏛️ Architecture

NeoX.js follows a **modular monolithic architecture** with clear separation of concerns:

```
├── 📁 configs/           # Configuration files
│   ├── env.js           # Environment variables
│   ├── permission.js    # Role-based permissions
│   └── common.entities.js
├── 📁 server/           # Core server components
│   ├── 📁 core/        # Core modules (auth, tokens)
│   ├── 📁 lib/         # Libraries (JWT, Sequelize, etc.)
│   ├── 📁 middlewares/ # Custom middlewares
│   ├── 📁 passport/    # Authentication strategies
│   ├── 📁 utils/       # Utility functions
│   └── server.js       # Express app configuration
├── 📁 src/
│   └── 📁 modules/     # Feature modules
│       ├── 📁 user/    # User management
│       ├── 📁 product/ # Product management
│       └── ...         # Other modules
└── index.js            # Application entry point
```

---

## 🚀 Quick Start

### Prerequisites

- **Node.js** >= 22.14.0
- **NPM** >= 10.9.2
- **PostgreSQL** database

### 1. Clone the Repository

```bash
git clone https://github.com/Pushkarcdn/neoX.js.git
cd neoX.js
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Environment Setup

Create environment files for different stages:

```bash
# Local development
cp .env.example .env.local

# Development server
cp .env.example .env.development

# Production
cp .env.example .env.production
```

### 4. Configure Database

Update your environment file with database credentials:

```env
# Database Configuration
DATABASE_DIALECT=postgres
POSTGRES_HOST=localhost
POSTGRES_PORT=5432
POSTGRES_USER=your_username
POSTGRES_PASSWORD=your_password
POSTGRES_DATABASE=neox_db
```

### 5. Run Database Migrations

```bash
npm run migration:run
```

### 6. Start the Server

```bash
# Development (local)
npm run dev:local

# Development (server)
npm run dev:server

# Production
npm start
```

Your server will be running at `http://localhost:3000` 🎉

---

## 📦 Installation

### Using NPM

```bash
npm install neox.js
```

### Using Yarn

```bash
yarn add neox.js
```

### Development Installation

```bash
# Clone repository
git clone https://github.com/Pushkarcdn/neoX.js.git

# Install dependencies
npm install

# Install development tools
npm install -g nodemon sequelize-cli
```

---

## ⚙️ Configuration

### Environment Variables

NeoX.js uses environment-specific configuration files:

- `.env.local` - Local development
- `.env.development` - Development server
- `.env.production` - Production environment

Key configuration categories:

#### Server Configuration

```env
APP_NAME=NeoX API
NODE_ENV=local
PORT=3000
REQUEST_BODY_SIZE_LIMIT=10mb
RATE_LIMIT_TIME_WINDOW_IN_MINUTE=15
RATE_LIMIT_MAX_AMOUNT=100
```

#### JWT Configuration

```env
ACCESS_TOKEN_SECRET=your_access_token_secret
ACCESS_TOKEN_EXPIRES_IN=15m
REFRESH_TOKEN_SECRET=your_refresh_token_secret
REFRESH_TOKEN_EXPIRES_IN=7d
```

#### Database Configuration

```env
DATABASE_DIALECT=postgres
DATABASE_SYNC_MODE=sync
POSTGRES_HOST=localhost
POSTGRES_PORT=5432
POSTGRES_USER=username
POSTGRES_PASSWORD=password
POSTGRES_DATABASE=database_name
```

---

## 🧩 Module System

### Creating a New Module

NeoX.js uses a **convention-based module system**. Each module follows this structure:

```
src/modules/your-module/
├── your-module.model.js      # Sequelize model
├── your-module.route.js      # Route definitions
├── your-module.controller.js # Business logic
└── your-module.permissions.js # Access permissions
```

### Example Module

```javascript
// src/modules/product/product.model.js
export default (sequelize, DataTypes) => {
  const Product = sequelize.define("product", {
    productId: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
  });

  return Product;
};
```

```javascript
// src/modules/product/product.route.js
import ProductController from "./product.controller.js";

export default (router) => {
  router
    .route("/products")
    .get(ProductController.getAllProducts)
    .post(ProductController.createProduct);

  router
    .route("/products/:id")
    .get(ProductController.getProduct)
    .put(ProductController.updateProduct)
    .delete(ProductController.deleteProduct);
};
```

---

## 🔐 Authentication & Authorization

### User Types

NeoX.js supports four user types with hierarchical permissions:

1. **SuperAdmin** - Full system access
2. **Admin** - Administrative functions
3. **Seller** - Product and order management
4. **Buyer** - Customer functions

### JWT Token System

```javascript
// Token structure
{
  "sub": "user-id",
  "userType": "admin",
  "iat": 1234567890,
  "exp": 1234567890
}
```

### Permission System

Each user type has its own permission file:

```javascript
// src/modules/user/admin/admin.permissions.js
export default [
  {
    methods: ["GET", "POST", "PUT", "DELETE"],
    route: "/api/products",
  },
  {
    methods: ["GET"],
    route: "/api/users",
  },
];
```

### Authentication Flow

1. **Sign Up**: `POST /api/signup/:userType`
2. **Sign In**: `POST /api/signin/:userType`
3. **Get Current User**: `GET /api/me`
4. **Sign Out**: `GET /api/signout`

---

## 🗄️ Database

### Sequelize Integration

NeoX.js uses **Sequelize ORM** with automatic model discovery:

- **Auto-loading** of models from modules
- **Association setup** between models
- **Migration** and seeding support
- **Transaction management** with CLS

### Database Operations

```bash
# Generate migration
npm run migration:generate -- --name create-users-table

# Run migrations
npm run migration:run

# Rollback migration
npm run migration:revert

# Generate seed
npm run seed:generate

# Run seeds
npm run seed:run
```

---

## 📖 API Documentation

NeoX.js includes **Swagger/OpenAPI** documentation:

- **Interactive API Explorer**: Available at `/api-docs`
- **JSON Schema**: Available at `/api-docs.json`
- **Auto-generated** from JSDoc comments

### Example API Documentation

```javascript
/**
 * @swagger
 * /api/products:
 *   get:
 *     summary: Get all products
 *     tags: [Products]
 *     responses:
 *       200:
 *         description: List of products
 */
```

---

## 📜 Available Scripts

### Development Scripts

```bash
# Local development with nodemon
npm run dev:local

# Local development with absolute imports
npm run dev:local:absolute

# Development server
npm run dev:server

# Development server with absolute imports
npm run dev:server:absolute
```

### Production Scripts

```bash
# Start production server
npm start

# Start with absolute imports
npm start:absolute
```

### Database Scripts

```bash
# Generate migration
npm run migration:generate -- --name migration_name

# Run migrations
npm run migration:run

# Rollback last migration
npm run migration:revert

# Generate seed file
npm run seed:generate

# Run all seeds
npm run seed:run

# Rollback last seed
npm run seed:revert
```

### Code Quality Scripts

```bash
# Run ESLint and fix issues
npm run lint

# Run tests (placeholder)
npm test
```

---

## 🛡️ Security

### Built-in Security Features

- **Helmet.js**: Security headers
- **CORS**: Cross-origin resource sharing
- **Rate Limiting**: Request throttling
- **Input Sanitization**: MongoDB query injection prevention
- **HPP**: HTTP parameter pollution protection
- **JWT**: Secure token-based authentication

### Security Configuration

```javascript
// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
});
```

---

## 📁 File Upload

### Multer Integration

```javascript
// File upload configuration
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
});
```

### Cloudinary Integration

```javascript
// Cloudinary configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});
```

---

## 🌍 Environment Variables

<details>
<summary>Click to expand complete environment variables list</summary>

```env
# Server Configuration
APP_NAME=NeoX API
NODE_ENV=local
PORT=3000
NUMBER_OF_PROXIES=1
REQUEST_BODY_SIZE_LIMIT=10mb

# Frontend & Backend URLs
FRONTEND_URL=http://localhost:3000
BACKEND_URL=http://localhost:8000

# JWT Configuration
ACCESS_TOKEN_SECRET=your_access_token_secret
ACCESS_TOKEN_EXPIRES_IN=15m
REFRESH_TOKEN_SECRET=your_refresh_token_secret
REFRESH_TOKEN_EXPIRES_IN=7d
GENERAL_TOKEN_SECRET=your_general_token_secret
GENERAL_TOKEN_EXPIRES_IN=1d

# Database Configuration
DATABASE_DIALECT=postgres
DATABASE_SYNC_MODE=sync
POSTGRES_HOST=localhost
POSTGRES_PORT=5432
POSTGRES_USER=username
POSTGRES_PASSWORD=password
POSTGRES_DATABASE=database_name
POSTGRES_SSL=false

# Super Admin
SUPER_ADMIN_NAME=Super Admin
SUPER_ADMIN_EMAIL=admin@example.com
SUPER_ADMIN_PASSWORD=password

# Mail Configuration
MAIL_SERVICE=gmail
MAIL_HOST=smtp.gmail.com
MAIL_PORT=587
MAIL_USER=your_email@gmail.com
MAIL_PASSWORD=your_app_password

# Email Addresses
NO_REPLY_EMAIL=noreply@example.com
HELP_EMAIL=help@example.com
SUPPORT_EMAIL=support@example.com

# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# OAuth Configuration
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

# Rate Limiting
RATE_LIMIT_TIME_WINDOW_IN_MINUTE=15
RATE_LIMIT_MAX_AMOUNT=100
```

</details>

---

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. **Fork** the repository
2. **Create** a feature branch (`git checkout -b feature/amazing-feature`)
3. **Commit** your changes (`git commit -m 'Add amazing feature'`)
4. **Push** to the branch (`git push origin feature/amazing-feature`)
5. **Open** a Pull Request

### Development Guidelines

- Follow **ESLint** configuration
- Write **comprehensive tests**
- Update **documentation**
- Follow **conventional commits**

---

## 📄 License

This project is licensed under the **ISC License** - see the [LICENSE](LICENSE) file for details.

---

## 👨‍💻 Author

**Pushkar Kumar Sah**  
🌐 [www.pushkar.live](https://www.pushkar.live)  
📧 Contact via [GitHub Issues](https://github.com/Pushkarcdn/neoX.js/issues)

---

## 🙏 Acknowledgments

- **Express.js** - Fast, unopinionated web framework
- **Sequelize** - Modern ORM for Node.js
- **Passport.js** - Authentication middleware
- **JWT** - JSON Web Tokens for secure authentication
- All the amazing **open-source contributors**

---

<div align="center">

**⭐ Star this repository if you find it helpful!**

[Report Bug](https://github.com/Pushkarcdn/neoX.js/issues) • [Request Feature](https://github.com/Pushkarcdn/neoX.js/issues) • [Documentation](https://github.com/Pushkarcdn/neoX.js)

Made with ❤️ by [Pushkar Kumar Sah](https://www.pushkar.live)

</div>
