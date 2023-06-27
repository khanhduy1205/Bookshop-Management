// const initOption = {};
// const pgp = require('pg-promise')(initOption);

// const cn = {
//     host: 'localhost',
//     port: '5432',
//     database: 'Bookshop',
//     user: 'postgres',
//     password: '20120275'
// };

// const db = pgp(cn);

// module.exports = {
//     getAll: async () => {
//         const result = await db.any('SELECT * FROM "ImportDetails"');
//         return result;
//     },
//     add: async importDetail => {
//         const result = await db.one('INSERT INTO "ImportDetails"("importDetailID", "bookID", "importID", bookname, quantity) VALUES($1, $2, $3, $4, $5) RETURNING *',
//             [importDetail.importDetailID, importDetail.bookID, importDetail.importID, importDetail.bookname, importDetail.quantity]);
//         return result;
//     },
//     byImportDetailID: async detailID => {
//         const result = await db.one('SELECT * FROM "ImportDetails" WHERE "importDetailID"=$1',
//             [detailID]);
//         return result;
//     },
//     editImportDetail: async importDetail => {
//         const result = await db.none('UPDATE "ImportDetails" SET "bookID"=$1, "importID"=$2, "bookname"=$3, "quantity"=$4 WHERE "importDetailID"=$5',
//             [importDetail.bookID, importDetail.importID, importDetail.bookname, importDetail.quantity, customer.importDetailID]);
//         return result;
//     },
//     deleteImportDetailByID: async (id) => {
//         const result = await db.none('DELETE FROM "ImportDetails" WHERE "importDetailID"=$1',
//             [id]);
//         return result;
//     }
// }