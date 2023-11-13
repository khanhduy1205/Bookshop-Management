const initOption = {};
const pgp = require('pg-promise')(initOption);

const cn = {
    host: 'localhost',
    port: '5432',
    database: 'Bookshop',
    user: 'postgres',
    password: '20120275',
};

const db = pgp(cn);

module.exports = {
    getAll: async () => {
        const result = await db.any('SELECT * FROM "Invoices" ORDER BY "invoiceID" ASC');
        return result;
    },
    add: async (invoice) => {
        const result = await db.one(
            'INSERT INTO "Invoices"("invoiceID", "customerID", "invoiceDate") VALUES($1, $2, $3) RETURNING *',
            [invoice.invoiceID, invoice.customerID, invoice.invoiceDate],
        );
        return result;
    },
    byInvoiceID: async (invoiceID) => {
        const result = await db.one(
            'SELECT * FROM "Invoices" invoice JOIN "Customers" customer on invoice."customerID" = customer."customerID" WHERE "invoiceID"=$1',
            [invoiceID],
        );
        return result;
    },
    editInvoice: async (invoice) => {
        const result = await db.none('UPDATE "Invoices" SET "customerID"=$1, "invoiceDate"=$3 WHERE "invoiceID"=$4', [
            invoice.customerID,
            invoice.invoiceDate,
            customer.invoiceID,
        ]);
        return result;
    },
    deleteInvoiceByID: async (id) => {
        const result = await db.none('DELETE FROM "Invoices" WHERE "invoiceID"=$1', [id]);
        return result;
    },
};
