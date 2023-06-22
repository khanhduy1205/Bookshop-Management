
const userM = require('../models/user.m');
const booksM = require('../models/bookshop.m')
const passport = require('passport');
const CryptoJS = require('crypto-js');
const helpers = require('../helpers/helpers');

const hashLength = 64;

exports.getAllBooks = async (req, res, next) => {
    try {
        const allBooks = await booksM.getAllBooksFromJSON();
        const listBook = Object.keys(allBooks);

        for (var i = 0; i < listBook.length; i++) {
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

        const books = await this.getAllBooks(req, res, next);

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

    res.render('search', {
        active: { search: true },
        helpers,
        total: 20,
        page: page,
        // user: req.session.passport.user
    });
};

exports.getImports = async (req, res, next) => {

    var page = parseInt(req.query.page) || 1;
    // var perPage = 4;
    // var start = (page - 1) * perPage;
    // var next = (page - 1) * perPage + perPage;

    res.render('all_imports', {
        active: { import: true },
        helpers,
        total: 20,
        page: page,
        // user: req.session.passport.user
    });
};



exports.getImportCreate = async (req, res, next) => {

    var page = parseInt(req.query.page) || 1;

    res.render('create_import', {
        active: { import: true },
        helpers,
        total: 20,
        page: page,
    });
}

exports.postImportCreate = async (req, res, next) => {
    // add new import to import list

    res.redirect('/import');
}

exports.postCreateImport = async (req, res, next) => {

    var page = parseInt(req.query.page) || 1;

    res.render('all_import', {
        active: { import: true},
        helpers,
        total: 20,
        page: page,
    })
}

exports.postImportAddBook = async (req, res, next) => {

    // add book to import note

    res.redirect('/import/create');
}

exports.getImportUpdate = async (req, res, next) => {
    var page = parseInt(req.query.page) || 1;

    res.render('update_import', {
        active: { import: true },
        helpers,
        total: 20,
        page: page,
    });
}

exports.postImportUpdate = async (req, res, next) => {

    res.redirect('/import');
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
        active: { invoice: true},
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



