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
        const result = await db.any('SELECT * FROM "Receipts" ORDER BY "receiptID" ASC');
        return result;
    },
    getReceiptJoinCustomer: async () => {
        const result = await db.any('SELECT * FROM "Receipts" INNER JOIN "Customers" ON "Receipts"."customerID" = "Customers"."customerID"');
        return result;
    },
    add: async receipt => {
        const result = await db.one('INSERT INTO "Receipts"("receiptID", "customerID", "amountPaid", "paymentDate") VALUES($1, $2, $3, $4) RETURNING *',
            [receipt.receiptID, receipt.customerID, receipt.amountPaid, receipt.paymentDate]);
        return result;
    },
    byReceiptID: async receiptID => {
        const result = await db.one('SELECT * FROM "Receipts" WHERE "receiptID"=$1',
            [receiptID]);
        return result;
    },
    editReceipt: async receipt => {
        const result = await db.none('UPDATE "Receipts" SET "customerID"=$1, "amountPaid"=$2, "paymentDate"=$3 WHERE "receiptID"=$4',
            [receipt.customerID, receipt.amountPaid, receipt.paymentDate, receipt.receiptID]);
        return result;
    },
    deleteReceiptByID: async (id) => {
        const result = await db.none('DELETE FROM "Receipts" WHERE "receiptID"=$1',
            [id]);
        return result;
    }
}