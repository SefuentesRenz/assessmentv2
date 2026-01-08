/*
  Warnings:

  - A unique constraint covering the columns `[cashierFName,cashierLName]` on the table `cashier` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[firstFName,lastLName]` on the table `customer` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[supplierDesc]` on the table `supplier` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `cashier_cashierFName_cashierLName_key` ON `cashier`(`cashierFName`, `cashierLName`);

-- CreateIndex
CREATE UNIQUE INDEX `customer_firstFName_lastLName_key` ON `customer`(`firstFName`, `lastLName`);

-- CreateIndex
CREATE UNIQUE INDEX `supplier_supplierDesc_key` ON `supplier`(`supplierDesc`);
