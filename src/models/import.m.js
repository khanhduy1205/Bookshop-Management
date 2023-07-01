const initOption = {};
const pgp = require('pg-promise')(initOption);

const cn = {
    host: 'localhost',
    port: '5432',
    database: 'Bookshop',
    user: 'postgres',
    password: '123'
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
    getAllImportDetailsByID: async (id) => {
        const result = await db.any('SELECT * FROM "ImportDetails" WHERE "importID"=$1', [id]);
        return result;
    },

    deleteImport: async (id) => {
        const result = await db.none('DELETE FROM "Imports" WHERE "importID"=$1', [id]);
        return result;
    },
    deleteImportDetail: async (id) => {
        const result = await db.none('DELETE FROM "ImportDetails" WHERE "importDetailID"=$1', [id]);
        return result;
    },

    // deleteFavoriteRecipe: async(f) => {
    //     const rs = await db.none('DELETE FROM "FavoriteRecipes" WHERE "userID"=$1 AND "recipeName"=$2', [f.userID, f.recipeName]);
    //     return rs;
    // },
}