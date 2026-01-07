-- CreateTable
CREATE TABLE `customer` (
    `custID` INTEGER NOT NULL AUTO_INCREMENT,
    `firstFName` VARCHAR(191) NOT NULL,
    `lastLName` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`custID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `cashier` (
    `cashierID` INTEGER NOT NULL AUTO_INCREMENT,
    `cashierFName` VARCHAR(191) NOT NULL,
    `cashierLName` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`cashierID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `supplier` (
    `supplierID` INTEGER NOT NULL AUTO_INCREMENT,
    `supplierDesc` VARCHAR(191) NOT NULL,
    `supplierType` VARCHAR(191) NULL,

    PRIMARY KEY (`supplierID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `product` (
    `productID` INTEGER NOT NULL AUTO_INCREMENT,
    `ProdDesc` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`productID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `product_supplier` (
    `productSupplierID` INTEGER NOT NULL AUTO_INCREMENT,
    `productID` INTEGER NOT NULL,
    `supplierID` INTEGER NOT NULL,

    UNIQUE INDEX `product_supplier_productID_supplierID_key`(`productID`, `supplierID`),
    PRIMARY KEY (`productSupplierID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `sales` (
    `salesID` INTEGER NOT NULL AUTO_INCREMENT,
    `salesDate` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `custID` INTEGER NOT NULL,
    `cashierID` INTEGER NOT NULL,

    PRIMARY KEY (`salesID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `salesitem` (
    `salesItemID` INTEGER NOT NULL AUTO_INCREMENT,
    `salesID` INTEGER NOT NULL,
    `productID` INTEGER NOT NULL,
    `quantity` INTEGER NOT NULL,
    `unitPrice` DOUBLE NOT NULL,

    PRIMARY KEY (`salesItemID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `product_supplier` ADD CONSTRAINT `product_supplier_productID_fkey` FOREIGN KEY (`productID`) REFERENCES `product`(`productID`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `product_supplier` ADD CONSTRAINT `product_supplier_supplierID_fkey` FOREIGN KEY (`supplierID`) REFERENCES `supplier`(`supplierID`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `sales` ADD CONSTRAINT `sales_custID_fkey` FOREIGN KEY (`custID`) REFERENCES `customer`(`custID`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `sales` ADD CONSTRAINT `sales_cashierID_fkey` FOREIGN KEY (`cashierID`) REFERENCES `cashier`(`cashierID`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `salesitem` ADD CONSTRAINT `salesitem_salesID_fkey` FOREIGN KEY (`salesID`) REFERENCES `sales`(`salesID`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `salesitem` ADD CONSTRAINT `salesitem_productID_fkey` FOREIGN KEY (`productID`) REFERENCES `product`(`productID`) ON DELETE CASCADE ON UPDATE CASCADE;
