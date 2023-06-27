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
    getAllImports: async () => {
        const result = await db.any('SELECT * FROM "Imports"');
        return result;
    },
    add: async (imp) => {
        const result = await db.one('INSERT INTO "Imports"("importID", "importDate") VALUES($1, $2) RETURNING *',
            [imp.importID, imp.importDate]);
        return result;
    },
    getAllImportDetails: async () => {
        const result = await db.any('SELECT * FROM "ImportDetails"');
        return result;
    },
    addImportDetails: async (temp) => {
        const result = await db.one('INSERT INTO "ImportDetails"("importDetailID", "bookID", "importID", "bookname", "quantity") VALUES($1, $2, $3, $4, $5) RETURNING *',
            [temp.importDetailID, temp.bookID, temp.importID, temp.bookname, temp.quantity]);
        return result;
    },
    byImportID: async importID => {
        const result = await db.one('SELECT * FROM "Imports" WHERE "importID"=$1',
            [importID]);
        return result;
    },
    editImport: async imprt => {
        const result = await db.none('UPDATE "Imports" SET "importDate"=$1 WHERE "importID"=$2',
            [imprt.importDate, imprt.imprtID]);
        return result;
    },
    deleteImportByID: async (importID) => {
        const result = await db.none('DELETE FROM "Imports" WHERE "importID"=$1',
            [importID]);
        return result;
    },
}