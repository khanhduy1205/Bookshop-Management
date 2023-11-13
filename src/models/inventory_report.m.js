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
        const result = await db.any('SELECT * FROM "InventoryReports"  ORDER BY "inventoryReportID" ASC');
        return result;
    },
    add: async (report) => {
        const result = await db.one(
            'INSERT INTO "InventoryReports"("inventoryReportID", "bookID", "bookname", "beginningInventory", "endingInventory", "inventoryChanges") VALUES($1, $2, $3, $4, $5, $6) RETURNING *',
            [
                report.inventoryReportID,
                report.bookID,
                report.bookname,
                report.beginningInventory,
                report.endingInventory,
                report.inventoryChanges,
            ],
        );
        return result;
    },
    byReportID: async (reportID) => {
        const result = await db.one('SELECT * FROM "InventoryReports" WHERE "inventoryReportID"=$1', [reportID]);
        return result;
    },
    editReport: async (report) => {
        const result = await db.none(
            'UPDATE "InventoryReports" SET "bookID"=$1, "bookname"=$2, "beginningInventory"=$3, "endingInventory"=$4, "inventoryChanges"=$5 WHERE "inventoryReportID"=$6',
            [
                report.bookID,
                report.bookname,
                report.beginningInventory,
                report.endingInventory,
                report.inventoryChanges,
                report.inventoryReportID,
            ],
        );
        return result;
    },
    deleteReportByID: async (reportID) => {
        const result = await db.none('DELETE FROM "InventoryReports" WHERE "inventoryReportID"=$1', [reportID]);
        return result;
    },
};
