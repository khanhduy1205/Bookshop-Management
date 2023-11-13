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
        const result = await db.any('SELECT * FROM "Regulations" ORDER BY "regulationID" ASC');
        return result;
    },
    add: async (regulation) => {
        const result = await db.one(
            'INSERT INTO "Regulations"("regulationID", "regulationName", "content", "status", "type", "value") VALUES($1, $2, $3, $4, $5, $6) RETURNING *',
            [
                regulation.regulationID,
                regulation.regulationName,
                regulation.content,
                regulation.status,
                regulation.type,
                regulation.status,
            ],
        );
        return result;
    },
    byID: async (regulationID) => {
        const result = await db.one('SELECT * FROM "Regulations" WHERE "regulationID"=$1', [regulationID]);
        return result;
    },
    editRegulation: async (regulation) => {
        const result = await db.none(
            'UPDATE "Regulations" SET "regulationName"=$1, "content"=$2, "status"=$3, "type"=$4, "value"=$5 WHERE "regulationID"=$6',
            [
                regulation.regulationName,
                regulation.content,
                regulation.status,
                regulation.regulationID,
                regulation.type,
                regulation.status,
            ],
        );
        return result;
    },
    deleteRegulationByID: async (id) => {
        const result = await db.none('DELETE FROM "Regulations" WHERE "regulationID"=$1', [id]);
        return result;
    },
};
