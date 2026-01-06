-- CreateTable
CREATE TABLE "customer" (
    "custID" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "firstFName" TEXT NOT NULL,
    "lastLName" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "cashier" (
    "cashierID" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "cashierFName" TEXT NOT NULL,
    "cashierLName" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "supplier" (
    "supplierID" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "supplierDesc" TEXT NOT NULL,
    "supplierType" TEXT
);

-- CreateTable
CREATE TABLE "product" (
    "productID" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "ProdDesc" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "product_supplier" (
    "productSupplierID" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "productID" INTEGER NOT NULL,
    "supplierID" INTEGER NOT NULL,
    CONSTRAINT "product_supplier_productID_fkey" FOREIGN KEY ("productID") REFERENCES "product" ("productID") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "product_supplier_supplierID_fkey" FOREIGN KEY ("supplierID") REFERENCES "supplier" ("supplierID") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "sales" (
    "salesID" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "salesDate" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "custID" INTEGER NOT NULL,
    "cashierID" INTEGER NOT NULL,
    CONSTRAINT "sales_custID_fkey" FOREIGN KEY ("custID") REFERENCES "customer" ("custID") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "sales_cashierID_fkey" FOREIGN KEY ("cashierID") REFERENCES "cashier" ("cashierID") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "salesitem" (
    "salesItemID" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "salesID" INTEGER NOT NULL,
    "productID" INTEGER NOT NULL,
    "quantity" INTEGER NOT NULL,
    "unitPrice" REAL NOT NULL,
    CONSTRAINT "salesitem_salesID_fkey" FOREIGN KEY ("salesID") REFERENCES "sales" ("salesID") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "salesitem_productID_fkey" FOREIGN KEY ("productID") REFERENCES "product" ("productID") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "product_supplier_productID_supplierID_key" ON "product_supplier"("productID", "supplierID");
