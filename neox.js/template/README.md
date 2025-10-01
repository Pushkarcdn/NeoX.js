# {{app-name}}

A modern Node.js backend application built with **NeoX.js** framework.

## 🚀 Getting Started

### Prerequisites

- **Node.js** >= 22.14.0
- **NPM** >= 10.9.2
- **PostgreSQL** database

### Installation

1. **Install dependencies:**
```bash
npm install
```

2. **Configure environment variables:**
```bash
cp .env.example .env.local
```

Edit `.env.local` with your configuration:
- Database credentials
- JWT secrets
- Mail service configuration
- OAuth credentials (if needed)

3. **Set up database:**
```bash
# Make sure PostgreSQL is running
# Create your database
# Then run migrations
npm run migration:run
```

### Running the Application

**Development (Local):**
```bash
npm run dev:local
```

**Development (Server):**
```bash
npm run dev:server
```

**Production:**
```bash
npm start
```

The server will run on `http://localhost:4000` by default.

## 📁 Project Structure

```
├── configs/           # Configuration files
│   ├── env.config.js  # Environment variables
│   ├── permission.js  # Role-based permissions
│   └── ...
├── server/            # Core server components
│   ├── core/          # Core authentication modules
│   ├── lib/           # Libraries (JWT, Sequelize, etc.)
│   ├── middlewares/   # Custom middlewares
│   ├── passport/      # Authentication strategies
│   └── utils/         # Utility functions
├── src/
│   └── modules/       # Your application modules
├── public/            # Static files and uploads
└── index.js           # Application entry point
```

## 🔐 Authentication

NeoX.js supports multiple user types with role-based access control:

- **SuperAdmin** - Full system access
- **Admin** - Administrative functions
- **Seller** - Product and order management
- **Buyer** - Customer functions

### API Endpoints

- `POST /api/signup/:userType` - Register a new user
- `POST /api/signin/:userType` - Sign in
- `GET /api/me` - Get current user
- `GET /api/signout` - Sign out

## 🗄️ Database

This project uses **Sequelize ORM** with PostgreSQL.

**Available Commands:**
```bash
# Generate migration
npm run migration:generate -- --name create-table-name

# Run migrations
npm run migration:run

# Rollback migration
npm run migration:revert

# Generate seed
npm run seed:generate

# Run seeds
npm run seed:run
```

## 📖 API Documentation

Swagger documentation is available at:
```
http://localhost:4000/api-docs
```

## 🧩 Creating New Modules

Create a new module in `src/modules/`:

```
src/modules/your-module/
├── your-module.model.js      # Sequelize model
├── your-module.route.js      # Route definitions
├── your-module.controller.js # Business logic
└── your-module.permissions.js # Access permissions
```

## 📜 Available Scripts

- `npm run dev:local` - Run in local development mode
- `npm run dev:server` - Run in development server mode
- `npm start` - Run in production mode
- `npm run migration:generate` - Generate a new migration
- `npm run migration:run` - Run pending migrations
- `npm run seed:run` - Run database seeds
- `npm run lint` - Lint and fix code

## 🛡️ Security Features

- Helmet.js for security headers
- CORS configuration
- Rate limiting
- Input sanitization
- JWT-based authentication
- HPP protection

## 📄 License

ISC

## 🙏 Built With

- [NeoX.js](https://github.com/Pushkarcdn/neoX.js) - The backend framework
- [Express.js](https://expressjs.com/) - Web framework
- [Sequelize](https://sequelize.org/) - ORM
- [Passport.js](http://www.passportjs.org/) - Authentication

