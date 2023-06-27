-- Database: Bookshop

-- DROP DATABASE IF EXISTS "Bookshop";

CREATE DATABASE "Bookshop"
    WITH
    OWNER = postgres
    ENCODING = 'UTF8'
    LC_COLLATE = 'English_United States.1252'
    LC_CTYPE = 'English_United States.1252'
    TABLESPACE = pg_default
    CONNECTION LIMIT = -1
    IS_TEMPLATE = False;

	
DROP TABLE IF EXISTS "Accounts";
CREATE TABLE "Accounts" (
	"accountID" int4 NOT NULL,
	"username" varchar(255) NOT NULL,
	"fullname" varchar(255) NOT NULL,
  	"password" varchar(255) NOT NULL,
	"address" varchar(255) NOT NULL,
	"email" varchar(255) NOT NULL,
	"phone" varchar(255) NOT NULL
);

DROP TABLE IF EXISTS "Customers";
CREATE TABLE "Customers" (
	"customerID" int4 NOT NULL,
	"fullname" varchar(255) NOT NULL,
	"address" varchar(255) NOT NULL,
	"email" varchar(255) NOT NULL,
	"phone" varchar(255) NOT NULL,
	"unpaidAmount" int4 NOT NULL
);

DROP TABLE IF EXISTS "Books";
CREATE TABLE "Books" (
	"bookID" int4 NOT NULL,
	"bookname" varchar(255) NOT NULL,
	"category" varchar(255) NOT NULL,
	"author" varchar(255) NOT NULL,
	"quantity" int4 NOT NULL,
	"price" int4 NOT NULL	
);

DROP TABLE IF EXISTS "Imports";
CREATE TABLE "Imports" (
	"importID" int4 NOT NULL,
 	"importDate" date NOT NULL	
);

DROP TABLE IF EXISTS "ImportDetails";
CREATE TABLE "ImportDetails" (
	"importDetailID" int4 NOT NULL,
 	"bookID" int4 NOT NULL,
	"importID" int4 NOT NULL,
	"bookname" varchar(255) NOT NULL,
	"quantity" int4 NOT NULL
);

DROP TABLE IF EXISTS "Invoices";
CREATE TABLE "Invoices" (
	"invoiceID" int4 NOT NULL,
	"customerID" int4 NOT NULL,
	"fullname" varchar(255) NOT NULL,
 	"invoiceDate" date NOT NULL	
);

DROP TABLE IF EXISTS "InvoiceDetails";
CREATE TABLE "InvoiceDetails" (
	"invoiceDetailID" int4 NOT NULL,
	"bookID" int4 NOT NULL,
	"invoiceID" int4 NOT NULL,
 	"quantity" int4 NOT NULL,
	"price" int4 NOT NULL
);

DROP TABLE IF EXISTS "Receipts";
CREATE TABLE "Receipts" (
	"receiptID" int4 NOT NULL,
	"customerID" int4 NOT NULL,
	"amountPaid" int4 NOT NULL,
	"paymentDate" date NOT NULL
);

DROP TABLE IF EXISTS "InventoryReports";
CREATE TABLE "InventoryReports" (
	"inventoryReportID" int4 NOT NULL,
	"bookID" int4 NOT NULL,
	"bookname" varchar(255) NOT NULL,
	"beginningInventory" int4 NOT NULL,
	"endingInventory" int4 NOT NULL,
	"inventoryChanges" int4 NOT NULL
);

DROP TABLE IF EXISTS "DebtReports";
CREATE TABLE "DebtReports" (
	"debtReportID" int4 NOT NULL,
	"customerID" int4 NOT NULL,
	"fullname" varchar(255) NOT NULL,	
	"initialDebt" int4 NOT NULL,
	"finalDebt" int4 NOT NULL,
	"debtChanges" int4 NOT NULL
);

DROP TABLE IF EXISTS "Regulations";
CREATE TABLE "Regulations" (
	"regulationID" int4 NOT NULL,
	"regulationName" varchar(255) NOT NULL,	
	"content" varchar(255) NOT NULL,	
	"status" boolean NOT NULL,
	"type" varchar(255) NOT NULL,
	"value" int4 NOT NULL
);

-- ----------------------------------------------------------------------------------------------------------------------------
ALTER TABLE "Accounts" ADD CONSTRAINT "PK_Accounts" PRIMARY KEY ("accountID");
ALTER TABLE "Customers" ADD CONSTRAINT "PK_Customers" PRIMARY KEY ("customerID");
ALTER TABLE "Books" ADD CONSTRAINT "PK_Books" PRIMARY KEY ("bookID");
ALTER TABLE "Imports" ADD CONSTRAINT "PK_Imports" PRIMARY KEY ("importID");
ALTER TABLE "ImportDetails" ADD CONSTRAINT "PK_ImportDetails" PRIMARY KEY ("importDetailID");
ALTER TABLE "Invoices" ADD CONSTRAINT "PK_Invoices" PRIMARY KEY ("invoiceID");
ALTER TABLE "InvoiceDetails" ADD CONSTRAINT "PK_InvoiceDetails" PRIMARY KEY ("invoiceDetailID");
ALTER TABLE "Receipts" ADD CONSTRAINT "PK_Receipts" PRIMARY KEY ("receiptID");
ALTER TABLE "InventoryReports" ADD CONSTRAINT "PK_InventoryReports" PRIMARY KEY ("inventoryReportID");
ALTER TABLE "DebtReports" ADD CONSTRAINT "PK_DebtReports" PRIMARY KEY ("debtReportID");
ALTER TABLE "Regulations" ADD CONSTRAINT "PK_Regulations" PRIMARY KEY ("regulationID");

-- ------------------------------------------------------------------------------------------------------------------------------------
ALTER TABLE "Invoices" ADD CONSTRAINT "FK_Invoices_Customers" FOREIGN KEY ("customerID") REFERENCES "Customers" ("customerID");
ALTER TABLE "Receipts" ADD CONSTRAINT "FK_Receipts_Customers" FOREIGN KEY ("customerID") REFERENCES "Customers" ("customerID");
ALTER TABLE "DebtReports" ADD CONSTRAINT "FK_DebtReports_Customers" FOREIGN KEY ("customerID") REFERENCES "Customers" ("customerID");

ALTER TABLE "InvoiceDetails" ADD CONSTRAINT "FK_InvoiceDetails_Invoices" FOREIGN KEY ("invoiceID") REFERENCES "Invoices" ("invoiceID");

ALTER TABLE "InvoiceDetails" ADD CONSTRAINT "FK_InvoiceDetails_Books" FOREIGN KEY ("bookID") REFERENCES "Books" ("bookID");
ALTER TABLE "ImportDetails" ADD CONSTRAINT "FK_ImportDetails_Books" FOREIGN KEY ("bookID") REFERENCES "Books" ("bookID");
ALTER TABLE "InventoryReports" ADD CONSTRAINT "FK_InventoryReports_Books" FOREIGN KEY ("bookID") REFERENCES "Books" ("bookID");

ALTER TABLE "ImportDetails" ADD CONSTRAINT "FK_ImportDetails_Imports" FOREIGN KEY ("importID") REFERENCES "Imports" ("importID");
	
	
