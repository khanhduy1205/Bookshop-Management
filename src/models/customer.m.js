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
        const result = await db.any('SELECT * FROM "Customers" ORDER BY "customerID" ASC');
        return result;
    },
    getListByDebt: async () => {
        const result = await db.any('SELECT * FROM "Customers" WHERE "unpaidAmount" > 0');
        return result;
    },
    add: async customer => {
        const result = await db.one('INSERT INTO "Customers"("customerID", "fullname", "address", "email", "phone", "unpaidAmount") VALUES($1, $2, $3, $4, $5, $6) RETURNING *',
            [customer.customerID, customer.fullname, customer.address, customer.email, customer.phone, customer.unpaidAmount]);
        return result;
    },
    byCustomerID: async customerID => {
        const result = await db.one('SELECT * FROM "Customers" WHERE "customerID"=$1',
            [customerID]);
        return result;
    },
    editCustomer: async customer => {
        const result = await db.none('UPDATE "Customers" SET "fullname"=$1, "address"=$2, "email"=$3, "phone"=$4, "unpaidAmount"=$5 WHERE "customerID"=$6',
            [ customer.fullname, customer.address, customer.email, customer.phone, customer.unpaidAmount, customer.customerID]);
        return result;
    },
    deleteCustomerByID: async (customerID) => {
        const result = await db.none('DELETE FROM "Customers" WHERE "customerID"=$1',
            [customerID]);
        return result;
    }
}