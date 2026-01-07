import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function resetDatabase() {
  console.log('🗑️  Dropping all tables...');
  
  try {
    // Disable foreign key checks
    await prisma.$executeRawUnsafe('SET FOREIGN_KEY_CHECKS = 0');
    
    // Drop all tables
    await prisma.$executeRawUnsafe('DROP TABLE IF EXISTS `salesitem`');
    await prisma.$executeRawUnsafe('DROP TABLE IF EXISTS `sales`');
    await prisma.$executeRawUnsafe('DROP TABLE IF EXISTS `product_supplier`');
    await prisma.$executeRawUnsafe('DROP TABLE IF EXISTS `product`');
    await prisma.$executeRawUnsafe('DROP TABLE IF EXISTS `supplier`');
    await prisma.$executeRawUnsafe('DROP TABLE IF EXISTS `cashier`');
    await prisma.$executeRawUnsafe('DROP TABLE IF EXISTS `customer`');
    await prisma.$executeRawUnsafe('DROP TABLE IF EXISTS `_prisma_migrations`');
    
    // Re-enable foreign key checks
    await prisma.$executeRawUnsafe('SET FOREIGN_KEY_CHECKS = 1');
    
    console.log('✅ All tables dropped successfully');
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

resetDatabase();
