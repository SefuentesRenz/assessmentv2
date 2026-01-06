# Product Sales System

A comprehensive web-based Product Sales Management System built with React, Node.js, Express, Prisma, and MySQL.

## Features

- **Customer Management**: Add, edit, delete, and search customer records
- **Cashier Management**: Manage cashier information
- **Supplier Management**: Maintain supplier database
- **Product Management**: Manage products with multiple supplier associations
- **Sales Transactions**: Process sales with multiple items per transaction
- **Sales Reports**: Generate comprehensive sales reports with export to CSV
- **Professional UI**: Modern, responsive design with Tailwind CSS
- **Full CRUD Operations**: Complete Create, Read, Update, Delete functionality
- **Database**: MySQL with normalized 3NF structure using Prisma ORM

## Technology Stack

### Frontend
- React 19
- React Router v6
- Tailwind CSS v4
- Vite

### Backend
- Node.js
- Express
- Prisma ORM
- MySQL 8.0

## Database Schema (3NF)

The database follows Third Normal Form (3NF) with the following entities:
- **Customer**: Customer information
- **Cashier**: Cashier details
- **Supplier**: Supplier information
- **Product**: Product catalog
- **Product_Supplier**: Many-to-many relationship between products and suppliers
- **Sales**: Sales transaction header
- **SalesItem**: Sales transaction line items

## Setup Instructions

### Prerequisites
- Node.js (v14 or higher)
- Docker Desktop (for MySQL)

### 1. Start MySQL Database

```cmd
docker compose up -d
```

This will start MySQL on `localhost:3306` with:
- Database: `samplesystem`
- User: `appuser`
- Password: `apppassword`

### 2. Setup Backend

```cmd
cd backend
npm install
npx prisma migrate dev --name init
npx prisma generate
```

### 3. Start Backend Server

```cmd
npm run dev
```

Backend will run on `http://localhost:4000`

### 4. Setup Frontend (in a new terminal)

```cmd
npm run dev
```

Frontend will run on `http://localhost:5173`

## Usage

1. **Add Suppliers** first - Navigate to Suppliers page and add supplier records
2. **Add Products** - Navigate to Products page and create products, associating them with suppliers
3. **Add Customers** - Navigate to Customers page and add customer records
4. **Add Cashiers** - Navigate to Cashiers page and add cashier information
5. **Create Sales** - Navigate to Sales page to process transactions
6. **View Reports** - Navigate to Report page to view and export sales data

## Database Management

### Prisma Studio
Access Prisma Studio to view/edit database directly:
```cmd
cd backend
npm run db:studio
```

## License

This project is for educational purposes - SET B: Product Sales coursework.
