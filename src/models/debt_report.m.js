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
        const result = await db.any('SELECT * FROM "DebtReports"');
        return result;
    },
    add: async report => {
        const result = await db.one('INSERT INTO "DebtReports"("debtReportID", "customerID", "fullname", "initialDebt", "finalDebt", "debtChanges") VALUES($1, $2, $3, $4, $5, $6) RETURNING *',
            [report.debtReportID, report.customerID, report.fullname, report.initialDebt, report.finalDebt, report.debtChanges]);
        return result;
    },
    byReportID: async reportID => {
        const result = await db.one('SELECT * FROM "DebtReports" WHERE "debtReportID"=$1',
            [reportID]);
        return result;
    },
    editReport: async report => {
        const result = await db.none('UPDATE "DebtReports" SET "customerID"=$1, "fullname"=$2, "initialDebt"=$3, "finalDebt"=$4, "debtChanges"=$5 WHERE "debtReportID"=$6',
            [report.customerID, report.fullname, report.initialDebt, report.finalDebt, report.debtChanges, report.debtReportID]);
        return result;
    },
    deleteReport: async (reportID) => {
        const result = await db.none('DELETE FROM "DebtReports" WHERE "debtReportID"=$1',
            [reportID]);
        return result;
    }
}