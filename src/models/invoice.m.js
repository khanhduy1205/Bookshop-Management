const initOption = {};
const pgp = require('pg-promise')(initOption);

const cn = {
    host: 'localhost',
    port: '5432',
    database: 'Bookshop',
    user: 'postgres',
    password: '20120275'
};

const db = pgp(cn);

module.exports = {
    getAll: async () => {
        const result = await db.any('SELECT * FROM "Invoices" ORDER BY "invoiceID" ASC');
        return result;
    },
    add: async invoice => {
        const result = await db.one('INSERT INTO "Invoices"("invoiceID", "customerID", "fullname", "invoiceDate") VALUES($1, $2, $3, $4) RETURNING *',
            [invoice.invoiceID, invoice.customerID, invoice.fullname, invoice.invoiceDate]);
        return result;
    },
    byInvoiceID: async invoiceID => {
        const result = await db.one('SELECT * FROM "Invoices" WHERE "invoiceID"=$1',
            [invoiceID]);
        return result;
    },
    editInvoice: async invoice => {
        const result = await db.none('UPDATE "Invoices" SET "customerID"=$1, "fullname"=$2, "invoiceDate"=$3 WHERE "invoiceID"=$4',
            [invoice.customerID, invoice.fullname, invoice.invoiceDate, customer.invoiceID]);
        return result;
    },
    deleteInvoiceByID: async (id) => {
        const result = await db.none('DELETE FROM "Invoices" WHERE "invoiceID"=$1',
            [id]);
        return result;
    }
}