import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function checkDuplicates() {
  const suppliers = await prisma.supplier.findMany();
  
  const descs = {};
  suppliers.forEach(s => {
    descs[s.supplierDesc] = (descs[s.supplierDesc] || 0) + 1;
  });
  
  const dupes = Object.entries(descs).filter(([k, v]) => v > 1);
  
  if (dupes.length > 0) {
    console.log('Found duplicate supplier descriptions:');
    dupes.forEach(([desc, count]) => {
      console.log(`  "${desc}" appears ${count} times`);
    });
  } else {
    console.log('No duplicate supplier descriptions found.');
  }
  
  await prisma.$disconnect();
}

checkDuplicates();
