const initOption = {};
const pgp = require('pg-promise')(initOption);

const cn = {
    host: 'localhost',
    port: '5432',
    database: 'BookStore',
    user: 'postgres',
    password: '20120275'
};

const db = pgp(cn);

module.exports = {
    getAll: async () => {
        const result = await db.any('SELECT * FROM "User"');
        return result;
    },
    add: async acc => {
        const result = await db.one('INSERT INTO "User"(id, fullname, username, password, phone, email, address) VALUES($1, $2, $3, $4, $5, $6, $7) RETURNING *',
            [acc.id, acc.fullname, acc.username, acc.password, acc.phone, acc.email, acc.address]);
        return result;
    },
    byUsername: async username => {
        const result = await db.one('SELECT * FROM "User" WHERE username=$1',
            [username]);
        return result;
    },
    editPassword: async (pw, id) => {
        const result = await db.none('UPDATE "User" SET "password"=$1 WHERE "id"=$2',
            [pw, id]);
        return result;
    },
    editAccount: async (acc) => {
        const result = await db.none('UPDATE "User" SET "fullname"=$1, "phone"=$2, "email"=$3, "address"=$4 WHERE "username"=$5',
            [acc.fullname, acc.phone, acc.email, acc.address, acc.username]);
        return result;
    }
}