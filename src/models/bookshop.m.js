const fs = require('fs');
const pathDb = './db/books.json';

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
    getAllBooksFromJSON: () => {
        return new Promise((resolve, reject) => {
            fs.readFile(pathDb, (err, data) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(JSON.parse(data));
                }
            });
        });
    },
    addBookToDB: async (b) => {
        const result = await db.one('INSERT INTO "Books"("bookID", "bookname", "category", "author", "quantity", "price") VALUES($1, $2, $3, $4, $5, $6) RETURNING *',
            [b.bookID, b.bookname, b.category, b.author, b.quantity, b.price]);;
        return result;
    },

    getAll: async () => {
        const result = await db.any('SELECT * FROM "Books"');
        return result;
    },
    updateQuantity: async (bookID, quantity) => {
        const result = await db.none('UPDATE "Books" SET "quantity"=$2 WHERE "bookID"=$1',
            [bookID, quantity]);
        return result;
    },
    deleteBook: async (id) => {
        const result = await db.none('DELETE FROM "Books" WHERE "bookID"=$1',[id]);
        return result;
    },
}