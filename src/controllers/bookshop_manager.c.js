
const userM = require('../models/user.m');
const booksM = require('../models/bookshop.m');
const importsM = require('../models/import.m');

const passport = require('passport');
const CryptoJS = require('crypto-js');
const helpers = require('../helpers/helpers');
var moment = require('moment');

const hashLength = 64;

exports.getAllBooks = async (req, res, next) => {
    try {
        const allBooks = await booksM.getAllBooksFromJSON();
        const listBook = Object.keys(allBooks);

        for (var i = 0; i < 50; i++) {
            let bookID = i;
            let bookname = allBooks[listBook[i]].title;
            let category = allBooks[listBook[i]].category;
            let author = allBooks[listBook[i]].authors;
            let quantity = allBooks[listBook[i]].quantity;
            let price = allBooks[listBook[i]].original_price;

            let book = {
                bookID,
                bookname,
                category,
                author,
                quantity,
                price
            };
            const bookNew = await booksM.addBookToDB(book);
        }
    } catch (error) {
        next(error);
    }
}

exports.getHome = async (req, res, next) => {

    try {
        // chua dang nhap
        // if (!req.isAuthenticated()) {
        //     return res.redirect('/login');
        // }

        const books = await booksM.getAll();
        if (!books || !books?.length) {
            const books = await this.getAllBooks(req, res, next);
        }

        res.render('home', {
            active: { home: true },
            // user: req.session.passport.user
        });

    } catch (err) {
        next(err);
    }

};

// -------------------------------------------------

exports.getSearch = async (req, res, next) => {

    // if (!req.isAuthenticated()) {
    //     return res.redirect('/');
    // }

    var page = parseInt(req.query.page) || 1;

    const books = await booksM.getAll();

    res.render('search', {
        active: { search: true },
        helpers,
        total: 20,
        page: page,
        books
        // user: req.session.passport.user
    });
};

exports.postSearch = async (req, res, next) => {

    // if (!req.isAuthenticated()) {
    //     return res.redirect('/');
    // }

    var page = parseInt(req.query.page) || 1;

    let { search } = req.body;
    search = search.toLowerCase();

    let books = [];

    const allBooks = await booksM.getAll();

    for (var i = 0; i < allBooks.length; i++) {
        let bookname = allBooks[i].bookname.toLowerCase();
        let category = allBooks[i].category.toLowerCase();
        if (bookname.includes(search) || category.includes(search)) {
            books.push(allBooks[i]);
        }
    }

    res.render('search', {
        active: { search: true },
        helpers,
        total: 20,
        page: page,
        books
        // user: req.session.passport.user
    });
};

let listBooks = [];

//trang lập phiếu thu
exports.getImports = async (req, res, next) => {

    var page = parseInt(req.query.page) || 1;
    // var perPage = 4;
    // var start = (page - 1) * perPage;
    // var next = (page - 1) * perPage + perPage;

    const imports = await importsM.getAllImports();

    res.render('all_imports', {
        active: { import: true },
        helpers,
        total: 20,
        page: page,
        imports
        // user: req.session.passport.user
    });
};

//bấm button thêm sách
exports.getImportCreate = async (req, res, next) => {

    var page = parseInt(req.query.page) || 1;

    const imports = await importsM.getAllImports();
    let importID = 0;
    if (imports && imports?.length) {
        importID = imports.length;
    }

    res.render('create_import', {
        active: { import: true },
        helpers,
        total: 20,
        page: page,
        importID
    });
}

//bấm nút hoàn tất
exports.postImportCreate = async (req, res, next) => {
    // add new import to import list
    const { importDate } = req.body;

    const imports = await importsM.getAllImports();
    let importID = 0;
    if (imports && imports?.length) {
        importID = imports.length;
    }

    let imp = {
        importID,
        importDate
    };
    const newImport = await importsM.add(imp);

    for (var i = 0; i < listBooks.length; i++) {
        const books = await booksM.getAll();
        let bookID = books[books.length - 1].bookID + 1;

        const importDetails = await importsM.getAllImportDetails();
        let importDetailID = 0;
        if (importDetails && importDetails?.length) {
            importDetailID = importDetails[importDetails.length - 1].importDetailID + 1;
        }

        const book = books.find(b => (b.bookname == listBooks[i].bookname) &&
            (b.author == listBooks[i].author) &&
            (b.category == listBooks[i].category) &&
            (b.price == listBooks[i].price));
        if (book) {
            bookID = book.bookID;
            const newQuantity = parseInt(listBooks[i].quantity) + book.quantity;
            const updateBook = await booksM.updateQuantity(bookID, newQuantity);
        }
        else {
            let bookname = listBooks[i].bookname;
            let category = listBooks[i].category;
            let author = listBooks[i].author;
            let quantity = listBooks[i].quantity;
            let price = listBooks[i].price;

            let newBook = {
                bookID,
                bookname,
                category,
                author,
                quantity,
                price
            };
            const bookNew = await booksM.addBookToDB(newBook);
        }

        let temp = {
            importDetailID,
            bookID,
            importID,
            bookname: listBooks[i].bookname,
            quantity: listBooks[i].quantity
        };
        const newImportDetail = await importsM.addImportDetails(temp);
    }
    // listBooks = [];    
    listBooks.splice(0, listBooks.length);

    return res.redirect('/import');
}

//modal
exports.postImportAddBook = async (req, res, next) => {
    // add book to import note
    const { bookname, author, category, quantity, price } = req.body;

    const addBook = { bookname, author, category, quantity, price };
    listBooks.push(addBook);

    const imports = await importsM.getAllImports();
    let importID = 0;
    if (imports && imports?.length) {
        importID = imports.length;
    }

    res.render('create_import', {
        importID,
        listBooks,
    });
}

exports.postImportRemoveBook = async (req, res, next) => {
    let { books } = req.body;
    if (books !== undefined) {
        for (let i = 0; i < books.length; i++) {
            const bookIndex = listBooks.findIndex(b => b.bookname === books[i]);
            if (bookIndex !== -1) {
                listBooks.splice(bookIndex, 1);
            }
        }
    }
    res.render('create_import', {
        listBooks,
    });
}

exports.getImportUpdate = async (req, res, next) => {
    var page = parseInt(req.query.page) || 1;

    const id = req.params.id;

    let listBookDetails = [];
    const importDetails = await importsM.getAllImportDetailsByID(parseInt(id));
    const books = await booksM.getAll();

    for (var i = 0; i < importDetails.length; i++) {            
        const book = books.find(b => b.bookID === importDetails[i].bookID);
        listBookDetails.push(book);
    }

    res.render('update_import', {
        active: { import: true },
        helpers,
        total: 20,
        page: page,
        listBookDetails
    });
}

exports.postImportUpdate = async (req, res, next) => {

    res.redirect('/import');
}

exports.postImportDelete = async (req, res, next) => {
    var page = parseInt(req.query.page) || 1;
    // var perPage = 4;
    // var start = (page - 1) * perPage;
    // var next = (page - 1) * perPage + perPage;

    let { listID } = req.body;
    if (listID !== undefined) {
        const books = await booksM.getAll();
        for (let i = 0; i < listID.length; i++) {
            const importDetails = await importsM.getAllImportDetailsByID(parseInt(listID[i]));
            for (var j = 0; j < importDetails.length; j++) {
                const bookID = importDetails[j].bookID;
                const quantity = importDetails[j].quantity;

                const deleteImportDetail = await importsM.deleteImportDetail(importDetails[j].importDetailID)
                
                const book = books.find(b => b.bookID === bookID);
                
                if (book.quantity === quantity) {
                    const deleteBook = await booksM.deleteBook(book.bookID)
                }
                else {
                    const newQuantity = book.quantity - quantity;
                    const updateBook = await booksM.updateQuantity(book.bookID, newQuantity);
                }
            }

            const deleteImport = await importsM.deleteImport(parseInt(listID[i]))
        }
    }

    const imports = await importsM.getAllImports();

    res.render('all_imports', {
        active: { import: true },
        helpers,
        total: 20,
        page: page,
        imports
        // user: req.session.passport.user
    });
}

exports.getInvoices = async (req, res, next) => {
    var page = parseInt(req.query.page) || 1;

    res.render('invoice', {
        active: { invoice: true },
        helpers,
        total: 20,
        page: page,
        // user: req.session.passport.user
    });
};



exports.getInvoiceCreate = async (req, res, next) => {

    res.render('create_invoice', {
        active: { invoice: true },
        // user: req.session.passport.user
    })
}

exports.postInvoiceCreate = async (req, res, next) => {

    res.redirect('/invoice');
}

exports.getInvoiceUpdate = async (req, res, next) => {
    var page = parseInt(req.query.page) || 1;

    res.render('update_invoice', {
        active: { invoice: true },
        helpers,
        total: 20,
        page: page,
    });
}

exports.postInvoiceUpdate = async (req, res, next) => {

    res.redirect('/invoice');
}

exports.getAddBookToInvoice = async (req, res, next) => {

    res.render('list_book', {
        active: { invoice: true }
    })
}

exports.postAddBookToInvoice = async (req, res, next) => {

    res.redirect('/invoice/create');
}


exports.getReceipts = async (req, res, next) => {
    var page = parseInt(req.query.page) || 1;

    res.render('receipt', {
        active: { receipt: true },
        helpers,
        total: 20,
        page: page,
        // user: req.session.passport.user
    });
};

exports.postReceiptCreate = async (req, res, next) => {

    res.redirect('/receipt');
}

exports.getReports = async (req, res, next) => {
    var page = parseInt(req.query.page) || 1;

    res.render('report', {
        active: { report: true },
        helpers,
        total: 20,
        page: page,
        // user: req.session.passport.user
    });
};

exports.getRegulations = async (req, res, next) => {
    var page = parseInt(req.query.page) || 1;

    res.render('regulation', {
        active: { regulation: true },
        helpers,
        total: 20,
        page: page,
        // user: req.session.passport.user
    });
};

exports.getRegulationUpdate = async (req, res, next) => {

    res.render('update_regulation', {
        active: { regulation: true }
    });
}

exports.postRegulationUpdate = async (req, res, next) => {

    res.redirect('/regulation');
}



