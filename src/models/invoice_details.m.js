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
        const result = await db.any('SELECT * FROM "InvoiceDetails" ORDER BY "invoiceDetailID" ASC');
        return result;
    },
    add: async (invoiceDetail) => {
        const result = await db.one(
            'INSERT INTO "InvoiceDetails"("invoiceDetailID", "bookID", "invoiceID", "quantity") VALUES($1, $2, $3, $4) RETURNING *',
            [invoiceDetail.invoiceDetailID, invoiceDetail.bookID, invoiceDetail.invoiceID, invoiceDetail.quantity],
        );
        return result;
    },
    byInvoiceDetailID: async (invoiceDetailID) => {
        const result = await db.one('SELECT * FROM "InvoiceDetails" WHERE "invoiceDetailID"=$1', [invoiceDetailID]);
        return result;
    },
    editInvoiceDetail: async (invoiceDetail) => {
        const result = await db.none(
            'UPDATE "InvoiceDetails" SET "bookID"=$1, "invoiceID"=$2, "quantity"=$3 WHERE "invoiceDetailID"=$4',
            [invoiceDetail.bookID, invoiceDetail.invoiceID, invoiceDetail.quantity, invoiceDetail.invoiceDetailID],
        );
        return result;
    },
    deleteInvoiceDetailByID: async (id) => {
        const result = await db.none('DELETE FROM "InvoiceDetails" WHERE "invoiceDetailID"=$1', [id]);
        return result;
    },
};
