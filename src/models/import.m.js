const initOption = {};
const pgp = require('pg-promise')(initOption);

const cn = {
    host: 'localhost',
    port: '5432',
    database: 'Bookstore',
    user: 'postgres',
    password: '20120275'
};

const db = pgp(cn);

module.exports = {
    getAll: async () => {
        const result = await db.any('SELECT * FROM "Imports"');
        return result;
    },
    add: async imprt => {
        const result = await db.one('INSERT INTO "Imports"("impkortID", "importDate") VALUES($1, $2) RETURNING *',
            [imprt.importID, imprt.importID]);
        return result;
    },
    byImportID: async importID => {
        const result = await db.one('SELECT * FROM "Imports" WHERE "importID"=$1',
            [importID]);
        return result;
    },
    editImport: async imprt => {
        const result = await db.none('UPDATE "Imports" SET "importDate"=$1 WHERE "importID"=$2',
            [ imprt.importDate, imprt.imprtID]);
        return result;
    },
    deleteImportByID: async (importID) => {
        const result = await db.none('DELETE FROM "Imports" WHERE "importID"=$1',
            [importID]);
        return result;
    }
}