const initOption = {};
const pgp = require('pg-promise')(initOption);
const fs = require('fs');
const pathDb = './db/books.json';

const cn = {
    host: 'localhost',
    port: '5432',
    database: 'Bookshop',
    user: 'postgres',
    password: '20120275'
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
    add: async book => {
        const result = await db.one('INSERT INTO "Books"("bookID", bookname, category, author, quantity, price) VALUES($1, $2, $3, $4, $5, $6) RETURNING *',
            [book.bookID, book.bookname, book.category, book.author, book.quantity, book.price]);
        return result;
    },
    byBookName: async bookname => {
        const result = await db.one('SELECT * FROM "Books" WHERE bookname=$1',
            [bookname]);
        return result;
    },
    byBookID: async bookID => {
        const result = await db.one('SELECT * FROM "Books" WHERE bookID=$1',
            [bookID]);
        return result;
    },
    editBook: async book => {
        const result = await db.none('UPDATE "Books" SET "bookname"=$1, "category"=$2, "author"=$3, "quantity"=$4, "price"=$5 WHERE "bookID"=$6',
            [book.bookname, book.category, book.author, book.quantity, book.price, book.bookID]);
        return result;
    },
    deleteBookByID: async (bookID) => {
        const result = await db.none('DELETE FROM "Books" WHERE "bookID"=$1',
            [bookID]);
        return result;
    },
    updateQuantity: async (bookID, quantity) => {
        const rs = await db.none('UPDATE "Books" SET "quantity"=$2 WHERE "bookID"=$1',
            [bookID, quantity]);
        return rs;
    }
}