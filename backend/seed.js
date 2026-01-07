import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seeding...');

  // Clear existing data (in reverse order due to foreign keys)
  await prisma.salesItem.deleteMany();
  await prisma.sales.deleteMany();
  await prisma.productSupplier.deleteMany();
  await prisma.product.deleteMany();
  await prisma.supplier.deleteMany();
  await prisma.customer.deleteMany();
  await prisma.cashier.deleteMany();

  console.log('✓ Cleared existing data');

  // Create Customers
  const customers = await Promise.all([
    prisma.customer.create({
      data: { firstFName: 'Allen', lastLName: 'Danao' }
    }),
    prisma.customer.create({
      data: { firstFName: 'Mike', lastLName: 'Cheq' }
    }),
    prisma.customer.create({
      data: { firstFName: 'Nakuhra', lastLName: 'Tan' }
    }),
    prisma.customer.create({
      data: { firstFName: 'Sarah', lastLName: 'Johnson' }
    }),
    prisma.customer.create({
      data: { firstFName: 'David', lastLName: 'Smith' }
    })
  ]);
  console.log(`✓ Created ${customers.length} customers`);

  // Create Cashiers
  const cashiers = await Promise.all([
    prisma.cashier.create({
      data: { cashierFName: 'John', cashierLName: 'Doe' }
    }),
    prisma.cashier.create({
      data: { cashierFName: 'Jean', cashierLName: 'Barquin' }
    }),
    prisma.cashier.create({
      data: { cashierFName: 'Maria', cashierLName: 'Garcia' }
    }),
    prisma.cashier.create({
      data: { cashierFName: 'Robert', cashierLName: 'Lee' }
    })
  ]);
  console.log(`✓ Created ${cashiers.length} cashiers`);

  // Create Suppliers
  const suppliers = await Promise.all([
    prisma.supplier.create({
      data: { supplierDesc: 'ACS', supplierType: 'Wholesale' }
    }),
    prisma.supplier.create({
      data: { supplierDesc: 'ABC Plastics', supplierType: 'Manufacturer' }
    }),
    prisma.supplier.create({
      data: { supplierDesc: 'Global Supplies Inc', supplierType: 'Distributor' }
    }),
    prisma.supplier.create({
      data: { supplierDesc: 'Best Products Co', supplierType: 'Wholesale' }
    })
  ]);
  console.log(`✓ Created ${suppliers.length} suppliers`);

  // Create Products with Suppliers
  const products = await Promise.all([
    prisma.product.create({
      data: {
        ProdDesc: 'Tide Bar',
        suppliers: {
          create: [
            { supplierID: suppliers[0].supplierID }
          ]
        }
      }
    }),
    prisma.product.create({
      data: {
        ProdDesc: 'Surf 150ML',
        suppliers: {
          create: [
            { supplierID: suppliers[0].supplierID }
          ]
        }
      }
    }),
    prisma.product.create({
      data: {
        ProdDesc: 'Plastic Cup',
        suppliers: {
          create: [
            { supplierID: suppliers[1].supplierID }
          ]
        }
      }
    }),
    prisma.product.create({
      data: {
        ProdDesc: 'Paper Plate',
        suppliers: {
          create: [
            { supplierID: suppliers[1].supplierID }
          ]
        }
      }
    }),
    prisma.product.create({
      data: {
        ProdDesc: 'Dish Soap 500ML',
        suppliers: {
          create: [
            { supplierID: suppliers[0].supplierID },
            { supplierID: suppliers[2].supplierID }
          ]
        }
      }
    }),
    prisma.product.create({
      data: {
        ProdDesc: 'Paper Towels',
        suppliers: {
          create: [
            { supplierID: suppliers[3].supplierID }
          ]
        }
      }
    }),
    prisma.product.create({
      data: {
        ProdDesc: 'Shampoo 200ML',
        suppliers: {
          create: [
            { supplierID: suppliers[0].supplierID }
          ]
        }
      }
    }),
    prisma.product.create({
      data: {
        ProdDesc: 'Hand Sanitizer',
        suppliers: {
          create: [
            { supplierID: suppliers[2].supplierID }
          ]
        }
      }
    })
  ]);
  console.log(`✓ Created ${products.length} products`);

  // Create Sales with Items (matching your sample report format)
  // Sale 1 - Allen Danao, John Doe
  const sale1 = await prisma.sales.create({
    data: {
      custID: customers[0].custID,
      cashierID: cashiers[0].cashierID,
      salesDate: new Date('2016-09-01'),
      salesItems: {
        create: [
          { productID: products[1].productID, quantity: 2, unitPrice: 45.50 }, // Surf 150ML
          { productID: products[0].productID, quantity: 3, unitPrice: 35.00 }, // Tide Bar
          { productID: products[2].productID, quantity: 10, unitPrice: 12.75 }  // Plastic Cup
        ]
      }
    }
  });

  // Sale 2 - Mike Cheq, Jean Barquin
  const sale2 = await prisma.sales.create({
    data: {
      custID: customers[1].custID,
      cashierID: cashiers[1].cashierID,
      salesDate: new Date('2016-07-17'),
      salesItems: {
        create: [
          { productID: products[1].productID, quantity: 1, unitPrice: 45.50 }, // Surf 150ML
          { productID: products[0].productID, quantity: 5, unitPrice: 35.00 }  // Tide Bar
        ]
      }
    }
  });

  // Sale 3 - Nakuhra Tan, Jean Barquin
  const sale3 = await prisma.sales.create({
    data: {
      custID: customers[2].custID,
      cashierID: cashiers[1].cashierID,
      salesDate: new Date('2016-02-29'),
      salesItems: {
        create: [
          { productID: products[3].productID, quantity: 20, unitPrice: 8.50 }  // Paper Plate
        ]
      }
    }
  });

  // Sale 4 - Sarah Johnson, Maria Garcia
  const sale4 = await prisma.sales.create({
    data: {
      custID: customers[3].custID,
      cashierID: cashiers[2].cashierID,
      salesDate: new Date('2016-10-15'),
      salesItems: {
        create: [
          { productID: products[4].productID, quantity: 4, unitPrice: 65.00 }, // Dish Soap
          { productID: products[5].productID, quantity: 6, unitPrice: 22.50 }  // Paper Towels
        ]
      }
    }
  });

  // Sale 5 - David Smith, Robert Lee
  const sale5 = await prisma.sales.create({
    data: {
      custID: customers[4].custID,
      cashierID: cashiers[3].cashierID,
      salesDate: new Date('2016-11-20'),
      salesItems: {
        create: [
          { productID: products[6].productID, quantity: 2, unitPrice: 85.00 }, // Shampoo
          { productID: products[7].productID, quantity: 8, unitPrice: 55.00 }, // Hand Sanitizer
          { productID: products[2].productID, quantity: 15, unitPrice: 12.75 }  // Plastic Cup
        ]
      }
    }
  });

  console.log(`✓ Created 5 sales transactions with multiple items`);

  console.log('\n🎉 Database seeding completed successfully!\n');
  console.log('Summary:');
  console.log(`  - ${customers.length} customers`);
  console.log(`  - ${cashiers.length} cashiers`);
  console.log(`  - ${suppliers.length} suppliers`);
  console.log(`  - ${products.length} products`);
  console.log(`  - 5 sales transactions with multiple items\n`);
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
