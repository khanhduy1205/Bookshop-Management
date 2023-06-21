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
    }
}