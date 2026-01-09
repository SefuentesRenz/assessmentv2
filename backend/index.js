import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client';

dotenv.config();

const app = express();
const prisma = new PrismaClient();

app.use(cors());
app.use(express.json());

// ========== CUSTOMER ROUTES ==========
app.get('/api/customers', async (req, res) => {
  try {
    const customers = await prisma.customer.findMany({
      orderBy: { custID: 'desc' }
    });
    res.json(customers);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/customers/:id', async (req, res) => {
  try {
    const customer = await prisma.customer.findUnique({
      where: { custID: parseInt(req.params.id) }
    });
    res.json(customer);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/customers', async (req, res) => {
  try {
    const { firstFName, lastLName } = req.body;
    const customer = await prisma.customer.create({
      data: { firstFName, lastLName }
    });
    res.json(customer);
  } catch (error) {
    if (error.code === 'P2002') {
      return res.status(400).json({ error: 'A customer with this first name and last name already exists.' });
    }
    res.status(500).json({ error: error.message });
  }
});

app.put('/api/customers/:id', async (req, res) => {
  try {
    const { firstFName, lastLName } = req.body;
    const customer = await prisma.customer.update({
      where: { custID: parseInt(req.params.id) },
      data: { firstFName, lastLName }
    });
    res.json(customer);
  } catch (error) {
    if (error.code === 'P2002') {
      return res.status(400).json({ error: 'A customer with this first name and last name already exists.' });
    }
    res.status(500).json({ error: error.message });
  }
});

app.delete('/api/customers/:id', async (req, res) => {
  try {
    await prisma.customer.delete({
      where: { custID: parseInt(req.params.id) }
    });
    res.json({ message: 'Customer deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ========== CASHIER ROUTES ==========
app.get('/api/cashiers', async (req, res) => {
  try {
    const cashiers = await prisma.cashier.findMany({
      orderBy: { cashierID: 'desc' }
    });
    res.json(cashiers);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/cashiers', async (req, res) => {
  try {
    const { cashierFName, cashierLName } = req.body;
    const cashier = await prisma.cashier.create({
      data: { cashierFName, cashierLName }
    });
    res.json(cashier);
  } catch (error) {
    if (error.code === 'P2002') {
      return res.status(400).json({ error: 'A cashier with this first name and last name already exists.' });
    }
    res.status(500).json({ error: error.message });
  }
});

app.put('/api/cashiers/:id', async (req, res) => {
  try {
    const { cashierFName, cashierLName } = req.body;
    const cashier = await prisma.cashier.update({
      where: { cashierID: parseInt(req.params.id) },
      data: { cashierFName, cashierLName }
    });
    res.json(cashier);
  } catch (error) {
    if (error.code === 'P2002') {
      return res.status(400).json({ error: 'A cashier with this first name and last name already exists.' });
    }
    res.status(500).json({ error: error.message });
  }
});

app.delete('/api/cashiers/:id', async (req, res) => {
  try {
    await prisma.cashier.delete({
      where: { cashierID: parseInt(req.params.id) }
    });
    res.json({ message: 'Cashier deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ========== SUPPLIER ROUTES ==========
app.get('/api/suppliers', async (req, res) => {
  try {
    const suppliers = await prisma.supplier.findMany({
      orderBy: { supplierID: 'desc' }
    });
    res.json(suppliers);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/suppliers', async (req, res) => {
  try {
    const { supplierDesc, supplierType } = req.body;
    
    // Check if supplier with same description already exists
    const existingSupplier = await prisma.supplier.findFirst({
      where: { supplierDesc: supplierDesc }
    });
    
    if (existingSupplier) {
      return res.status(400).json({ error: 'A supplier with this description already exists.' });
    }
    
    const supplier = await prisma.supplier.create({
      data: { supplierDesc, supplierType }
    });
    res.json(supplier);
  } catch (error) {
    if (error.code === 'P2002') {
      return res.status(400).json({ error: 'A supplier with this description already exists.' });
    }
    res.status(500).json({ error: error.message });
  }
});

app.put('/api/suppliers/:id', async (req, res) => {
  try {
    const { supplierDesc, supplierType } = req.body;
    const supplier = await prisma.supplier.update({
      where: { supplierID: parseInt(req.params.id) },
      data: { supplierDesc, supplierType }
    });
    res.json(supplier);
  } catch (error) {
    if (error.code === 'P2002') {
      return res.status(400).json({ error: 'A supplier with this description already exists.' });
    }
    res.status(500).json({ error: error.message });
  }
});

app.delete('/api/suppliers/:id', async (req, res) => {
  try {
    await prisma.supplier.delete({
      where: { supplierID: parseInt(req.params.id) }
    });
    res.json({ message: 'Supplier deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ========== PRODUCT ROUTES ==========
app.get('/api/products', async (req, res) => {
  try {
    const products = await prisma.product.findMany({
      include: {
        suppliers: {
          include: {
            supplier: true
          }
        }
      },
      orderBy: { productID: 'desc' }
    });
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/products', async (req, res) => {
  try {
    const { ProdDesc, supplierIDs } = req.body;
    
    // Check if a product with the same description exists with any of the selected suppliers
    const existingProducts = await prisma.product.findMany({
      where: {
        ProdDesc: ProdDesc,
        suppliers: {
          some: {
            supplierID: {
              in: supplierIDs
            }
          }
        }
      },
      include: {
        suppliers: {
          include: {
            supplier: true
          }
        }
      }
    });
    
    if (existingProducts.length > 0) {
      const conflictingSuppliers = existingProducts[0].suppliers
        .filter(ps => supplierIDs.includes(ps.supplierID))
        .map(ps => ps.supplier.supplierDesc);
      return res.status(400).json({ 
        error: `A product with description "${ProdDesc}" already exists with supplier(s): ${conflictingSuppliers.join(', ')}` 
      });
    }
    
    const product = await prisma.product.create({
      data: {
        ProdDesc,
        suppliers: {
          create: supplierIDs?.map(id => ({
            supplierID: id
          })) || []
        }
      },
      include: {
        suppliers: {
          include: {
            supplier: true
          }
        }
      }
    });
    res.json(product);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put('/api/products/:id', async (req, res) => {
  try {
    const { ProdDesc, supplierIDs } = req.body;
    const productId = parseInt(req.params.id);
    
    // Check if another product with the same description exists with any of the selected suppliers
    const existingProducts = await prisma.product.findMany({
      where: {
        ProdDesc: ProdDesc,
        productID: {
          not: productId  // Exclude the current product being edited
        },
        suppliers: {
          some: {
            supplierID: {
              in: supplierIDs
            }
          }
        }
      },
      include: {
        suppliers: {
          include: {
            supplier: true
          }
        }
      }
    });
    
    if (existingProducts.length > 0) {
      const conflictingSuppliers = existingProducts[0].suppliers
        .filter(ps => supplierIDs.includes(ps.supplierID))
        .map(ps => ps.supplier.supplierDesc);
      return res.status(400).json({ 
        error: `A product with description "${ProdDesc}" already exists with supplier(s): ${conflictingSuppliers.join(', ')}` 
      });
    }
    
    // Delete existing suppliers
    await prisma.productSupplier.deleteMany({
      where: { productID: productId }
    });
    
    // Update product and add new suppliers
    const product = await prisma.product.update({
      where: { productID: productId },
      data: {
        ProdDesc,
        suppliers: {
          create: supplierIDs?.map(id => ({
            supplierID: id
          })) || []
        }
      },
      include: {
        suppliers: {
          include: {
            supplier: true
          }
        }
      }
    });
    res.json(product);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete('/api/products/:id', async (req, res) => {
  try {
    await prisma.product.delete({
      where: { productID: parseInt(req.params.id) }
    });
    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ========== SALES ROUTES ==========
app.get('/api/sales', async (req, res) => {
  try {
    const sales = await prisma.sales.findMany({
      include: {
        customer: true,
        cashier: true,
        salesItems: {
          include: {
            product: {
              include: {
                suppliers: {
                  include: {
                    supplier: true
                  }
                }
              }
            }
          }
        }
      },
      orderBy: { salesID: 'desc' }
    });
    res.json(sales);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/sales/:id', async (req, res) => {
  try {
    const sale = await prisma.sales.findUnique({
      where: { salesID: parseInt(req.params.id) },
      include: {
        customer: true,
        cashier: true,
        salesItems: {
          include: {
            product: {
              include: {
                suppliers: {
                  include: {
                    supplier: true
                  }
                }
              }
            }
          }
        }
      }
    });
    res.json(sale);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/sales', async (req, res) => {
  try {
    const { custID, cashierID, salesDate, items, status } = req.body;
    
    const sale = await prisma.sales.create({
      data: {
        custID: parseInt(custID),
        cashierID: parseInt(cashierID),
        salesDate: salesDate ? new Date(salesDate) : new Date(),
        status: status || 'Active',
        salesItems: {
          create: items.map(item => ({
            productID: parseInt(item.productID),
            quantity: parseInt(item.quantity),
            unitPrice: parseFloat(item.unitPrice)
          }))
        }
      },
      include: {
        customer: true,
        cashier: true,
        salesItems: {
          include: {
            product: true
          }
        }
      }
    });
    res.json(sale);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put('/api/sales/:id', async (req, res) => {
  try {
    const { custID, cashierID, salesDate, items, status } = req.body;
    
    // Delete existing items
    await prisma.salesItem.deleteMany({
      where: { salesID: parseInt(req.params.id) }
    });
    
    // Update sale
    const sale = await prisma.sales.update({
      where: { salesID: parseInt(req.params.id) },
      data: {
        custID: parseInt(custID),
        cashierID: parseInt(cashierID),
        salesDate: salesDate ? new Date(salesDate) : undefined,
        status: status || 'Active',
        salesItems: {
          create: items.map(item => ({
            productID: parseInt(item.productID),
            quantity: parseInt(item.quantity),
            unitPrice: parseFloat(item.unitPrice)
          }))
        }
      },
      include: {
        customer: true,
        cashier: true,
        salesItems: {
          include: {
            product: true
          }
        }
      }
    });
    res.json(sale);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete('/api/sales/:id', async (req, res) => {
  try {
    // Instead of deleting, set status to Inactive
    await prisma.sales.update({
      where: { salesID: parseInt(req.params.id) },
      data: { status: 'Inactive' }
    });
    res.json({ message: 'Sale status updated to Inactive' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ========== REPORT ROUTE ==========
app.get('/api/sales-report', async (req, res) => {
  try {
    const sales = await prisma.sales.findMany({
      include: {
        customer: true,
        cashier: true,
        salesItems: {
          include: {
            product: {
              include: {
                suppliers: {
                  include: {
                    supplier: true
                  }
                }
              }
            }
          }
        }
      },
      orderBy: { salesDate: 'desc' }
    });
    
    // Flatten the data for report format
    const report = sales.flatMap(sale => 
      sale.salesItems.map(item => ({
        salesID: sale.salesID,
        custID: sale.customer.custID,
        custFName: sale.customer.firstFName,
        custLName: sale.customer.lastLName,
        productID: item.product.productID,
        prodDesc: item.product.ProdDesc,
        salesDate: sale.salesDate,
        cashierID: sale.cashier.cashierID,
        cashierFName: sale.cashier.cashierFName,
        cashierLName: sale.cashier.cashierLName,
        supplierID: item.product.suppliers[0]?.supplier.supplierID || null,
        supplierDesc: item.product.suppliers[0]?.supplier.supplierDesc || null,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
        status: sale.status
      }))
    );
    
    res.json(report);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});

process.on('SIGINT', async () => {
  await prisma.$disconnect();
  process.exit();
});
