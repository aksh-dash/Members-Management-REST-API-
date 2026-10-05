# StoreRate — Store Rating Platform

A full-stack web application for submitting and managing store ratings. Built with Express.js, PostgreSQL, and React.

## Tech Stack

| Layer      | Technology                     |
| ---------- | ------------------------------ |
| Backend    | Express.js + Node.js           |
| Database   | PostgreSQL + Sequelize ORM     |
| Auth       | JWT (jsonwebtoken + bcryptjs)  |
| Frontend   | React 18 + Vite                |
| Styling    | Vanilla CSS (dark theme)       |

## Prerequisites

- **Node.js** v18+
- **PostgreSQL** v14+
- **npm** v9+

## Setup Instructions

### 1. Database Setup

Create a PostgreSQL database:
```sql
CREATE DATABASE store_rating_db;
```

### 2. Backend Setup

```bash
cd backend

# Configure environment variables
# Edit .env with your PostgreSQL credentials

# Install dependencies
npm install

# Seed demo data
npm run seed

# Start development server
npm run dev
```

Backend runs at: `http://localhost:5000`

### 3. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

Frontend runs at: `http://localhost:3000`

## Demo Credentials

| Role         | Email              | Password     |
| ------------ | ------------------ | ------------ |
| Admin        | admin@admin.com    | Admin@1234   |
| Store Owner  | owner1@store.com   | Owner@1234   |
| Store Owner  | owner2@store.com   | Owner@1234   |
| Normal User  | user1@user.com     | User@12345   |
| Normal User  | user2@user.com     | User@12345   |
| Normal User  | user3@user.com     | User@12345   |

## User Roles & Features

### System Administrator
- Dashboard with total users, stores, and ratings
- Add new users (any role) and stores
- View/filter user and store listings
- View user details (with store rating for owners)

### Normal User
- Sign up and log in
- Browse all stores with search (name, address)
- Submit ratings (1-5) for stores
- Modify existing ratings
- Change password

### Store Owner
- Dashboard with store info and average rating
- View list of users who rated their store
- Change password

## Form Validations

| Field    | Rules                                                    |
| -------- | -------------------------------------------------------- |
| Name     | Min 20 characters, Max 60 characters                     |
| Email    | Standard email format                                    |
| Password | 8-16 characters, ≥1 uppercase, ≥1 special character     |
| Address  | Required, Max 400 characters                             |

## API Endpoints

### Auth
- `POST /api/auth/register` — User registration
- `POST /api/auth/login` — Login (all roles)
- `PUT /api/auth/password` — Change password

### Admin (requires admin role)
- `GET /api/admin/dashboard` — Dashboard stats
- `POST /api/admin/users` — Create user
- `GET /api/admin/users` — List users (with filters & sorting)
- `GET /api/admin/users/:id` — User details
- `POST /api/admin/stores` — Create store
- `GET /api/admin/stores` — List stores (with filters & sorting)

### Stores (requires user role)
- `GET /api/stores` — List stores (with search)
- `POST /api/stores/:id/rate` — Submit/update rating

### Owner (requires store_owner role)
- `GET /api/owner/dashboard` — Owner dashboard

## Project Structure

```
├── backend/
│   ├── config/database.js       # PostgreSQL connection
│   ├── controllers/             # Business logic
│   ├── middleware/               # Auth & validation
│   ├── models/                  # Sequelize models
│   ├── routes/                  # API routes
│   ├── seeders/seed.js          # Demo data
│   └── server.js                # Express entry point
├── frontend/
│   └── src/
│       ├── api/axios.js         # API client
│       ├── components/          # Reusable components
│       ├── context/             # Auth context
│       └── pages/               # Route pages
└── README.md
```
