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
        const result = await db.any('SELECT * FROM "Regulations"');
        return result;
    },
    add: async regulation => {
        const result = await db.one('INSERT INTO "Regulations"("regulationID", "regulationName", "content", "status") VALUES($1, $2, $3, $4) RETURNING *',
            [regulation.regulationID, regulation.regulationName, regulation.content, regulation.status]);
        return result;
    },
    byID: async regulationID => {
        const result = await db.one('SELECT * FROM "Regulations" WHERE "regulationID"=$1',
            [regulationID]);
        return result;
    },
    editRegulation: async regulation => {
        const result = await db.none('UPDATE "Regulations" SET "regulationName"=$1, "content"=$2, "status"=$3 WHERE "regulationID"=$4',
            [regulation.regulationName, regulation.content, regulation.status, regulation.regulationID]);
        return result;
    },
    deleteRegulationByID: async (id) => {
        const result = await db.none('DELETE FROM "Regulations" WHERE "regulationID"=$1',
            [id]);
        return result;
    }
}