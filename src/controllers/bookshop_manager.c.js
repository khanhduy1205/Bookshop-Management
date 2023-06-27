
const customerM = require('../models/customer.m'),
    booksM = require('../models/bookshop.m'),
    receiptM = require('../models/receipt.m'),
    importsM = require('../models/import.m')

const helpers = require('../helpers/helpers');
var currentBooks = [];

exports.getAllBooks = async (req, res, next) => {
    try {

        const allBooksDb = await booksM.getAll();

        // dừng nếu đã lưu books từ json sang db rồi
        if (allBooksDb.length > 0) {
            return;
        }

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
        if (!req.isAuthenticated()) {
            return res.redirect('/login');
        }

        res.redirect('/search');
    } catch (err) {
        next(err);
    }

};

// ---------- Search ---------------------------------------

exports.getSearch = async (req, res, next) => {

    if (!req.isAuthenticated()) {
        return res.redirect('/');
    }
    try {
        var page = parseInt(req.query.page) || 1;

        const perPage = 8;

        const booksDb = await booksM.getAll();

        if (!currentBooks || currentBooks.length == 0) {
            currentBooks = booksDb;
        }

        const books = currentBooks.slice((page - 1) * perPage, (page - 1) * perPage + perPage)

        res.render('search', {
            active: { search: true },
            helpers,
            books,
            total: currentBooks.length,
            perPage,
            page: page,
            user: req.session.passport.user
        });

    } catch (err) {
        next(err);
    }
};

exports.postSearch = async (req, res, next) => {

    try {
        var page = parseInt(req.query.page) || 1;
        var perPage = 8;

        let { search } = req.body;
        search = search.toLowerCase();

        let booksLookedUp = [];
        const allBooks = await booksM.getAll();

        if (!search) {
            booksLookedUp = allBooks;
        }
        else {
            for (var i = 0; i < allBooks.length; i++) {
                let bookname = allBooks[i].bookname.toLowerCase();
                let category = allBooks[i].category.toLowerCase();
                if (bookname.includes(search) || category.includes(search)) {
                    booksLookedUp.push(allBooks[i]);
                }
            }
        }

        currentBooks = booksLookedUp;
        const books = booksLookedUp.slice((page - 1) * perPage, (page - 1) * perPage + perPage)

        res.render('search', {
            active: { search: true },
            helpers,
            books,
            total: booksLookedUp.length,
            perPage,
            page: page,
            user: req.session.passport.user
        });
    } catch (err) {
        next(err);
    }

}
//---------- Customers-------------------------------
exports.getCustomer = async (req, res, next) => {

    if (!req.isAuthenticated()) {
        return res.redirect('/');
    }

    try {
        
        res.render('customer', {
            active: { customer: true},
            user: req.session.passport.user
        })
    }
    catch (err) {
        next(err);
    }


}

// ---------- Imports ------------------------------
let listBooks = [];

//trang lập phiếu thu
exports.getImports = async (req, res, next) => {
    if (!req.isAuthenticated()) {
        return res.redirect('/');
    }

    var page = parseInt(req.query.page) || 1;
    var perpage = 7;
    const imports = await importsM.getAllImports();

    res.render('all_imports', {
        active: { import: true },
        helpers,
        total: imports.length,
        perpage,
        page: page,
        imports,
        user: req.session.passport.user
    });
};


//bấm button thêm sách
exports.getImportCreate = async (req, res, next) => {

    if (!req.isAuthenticated()) {
        return res.redirect('/');
    }

    var page = parseInt(req.query.page) || 1;
    var perpage = 7;

    const imports = await importsM.getAllImports();
    let importID = 0;
    if (imports && imports?.length) {
        importID = imports.length;
    }

    res.render('create_import', {
        active: { import: true },
        helpers,
        total: imports.length,
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

exports.getImportUpdate = async (req, res, next) => {

    if (!req.isAuthenticated()) {
        return res.redirect('/');
    }
    var page = parseInt(req.query.page) || 1;

    const perPage = 7;

    res.render('update_import', {
        active: { import: true },
        helpers,
        total: 20,
        perPage,
        page: page,
    });
}

exports.postImportUpdate = async (req, res, next) => {

    res.redirect('/import');
}

exports.getInvoices = async (req, res, next) => {
    if (!req.isAuthenticated()) {
        return res.redirect('/');
    }
    var page = parseInt(req.query.page) || 1;

    const perPage = 7;

    res.render('invoice', {
        active: { invoice: true },
        helpers,
        total: 20,
        perPage,
        page: page,
        user: req.session.passport.user
    });
};

exports.getInvoiceCreate = async (req, res, next) => {
    if (!req.isAuthenticated()) {
        return res.redirect('/');
    }
    try {

        const booksDb = await booksM.getAll();

        res.render('create_invoice', {
            active: { invoice: true },
            books: booksDb,
            user: req.session.passport.user
        })
    } catch (err) {
        next(err);
    }  
}

exports.postInvoiceCreate = async (req, res, next) => {

    res.redirect('/invoice');
}

exports.getInvoiceUpdate = async (req, res, next) => {
    if (!req.isAuthenticated()) {
        return res.redirect('/');
    }
    var page = parseInt(req.query.page) || 1;

    const perPage = 7;

    res.render('update_invoice', {
        active: { invoice: true },
        helpers,
        total: 20,
        perPage,
        page: page,
        user: req.session.passport.user
    });
}

exports.postInvoiceUpdate = async (req, res, next) => {

    res.redirect('/invoice');
}

exports.getAddBookToInvoice = async (req, res, next) => {
    if (!req.isAuthenticated()) {
        return res.redirect('/');
    }
    res.render('list_book', {
        active: { invoice: true }
    })
}

exports.postAddBookToInvoice = async (req, res, next) => {

    res.redirect('/invoice/create');
}


exports.getDebtList = async (req, res, next) => {
    if (!req.isAuthenticated()) {
        return res.redirect('/');
    }

    try {
        var page = parseInt(req.query.page) || 1;

        const perPage = 7;

        const customersDb = await customerM.getListByDebt();
        const customers = customersDb.slice((page - 1) * perPage, (page - 1) * perPage + perPage)

        res.render('debt_list', {
            active: { receipt: true },
            helpers,
            customers,
            total: customersDb.length,
            perPage,
            page: page,
            user: req.session.passport.user
        });

    } catch (err) {
        next(err);
    }
}

exports.getReceipts = async (req, res, next) => {

    if (!req.isAuthenticated()) {
        return res.redirect('/');
    }
    try {
        var page = parseInt(req.query.page) || 1;

        const perPage = 7;

        const receiptsDb = await receiptM.getReceiptJoinCustomer();

        const receipts = receiptsDb.slice((page - 1) * perPage, (page - 1) * perPage + perPage)

        receipts.forEach(receipt => {
            receipt.paymentDate = new Date(receipt.paymentDate).toLocaleDateString('zh-Hans-CN');

        });

        res.render('receipt', {
            active: { receipt: true },
            helpers,
            receipts,
            total: receiptsDb.length,
            perPage,
            page: page,
            user: req.session.passport.user
        });

    } catch (err) {
        next(err);
    }

};

exports.postReceiptCreate = async (req, res, next) => {

    try {

        const receiptsDb = await receiptM.getAll();
        var receiptID;
        if (!receiptsDb || !receiptsDb?.length) {
            receiptID = 0;
        } else {
            receiptID = receiptsDb.length;
        }

        const newReceipt = {
            receiptID,
            customerID: parseInt(req.body.customerID),
            amountPaid: parseInt(req.body.amountPaid),
            paymentDate: new Date(req.body.date)
        }

        var customerDb = await customerM.byCustomerID(newReceipt.customerID);

        if (customerDb) {
            customerDb.unpaidAmount -= newReceipt.amountPaid;

            const receipt = await receiptM.add(newReceipt);
            const customer = await customerM.editCustomer(customerDb);
            res.redirect('/receipt');
        }

    } catch (error) {
        next(error)
    }
}

exports.postReceiptUpdate = async (req, res, next) => {

    try {
        res.rediret('/receipt');
    } catch (error) {
        next(error);
    }
}

exports.postReceiptDelete = async (req, res, next) => {

    try {
        const dataObjects = req.body.dataObjects;

        dataObjects.forEach(async (dataObject) => {
            if (dataObject) {
                await receiptM.deleteReceiptByID(dataObject.receiptID);
            }
        })

        res.redirect('/receipt');

    } catch (error) {
        next(error);
    }
}

exports.getReports = async (req, res, next) => {

    if (!req.isAuthenticated()) {
        return res.redirect('/');
    }
    var page = parseInt(req.query.page) || 1;

    const perPage = 7;

    res.render('report', {
        active: { report: true },
        helpers,
        total: 20,
        perPage,
        page: page,
        user: req.session.passport.user
    });
};

exports.getRegulations = async (req, res, next) => {
    if (!req.isAuthenticated()) {
        return res.redirect('/');
    }
    var page = parseInt(req.query.page) || 1;

    const perPage = 8;

    res.render('regulation', {
        active: { regulation: true },
        helpers,
        total: 20,
        perPage,
        page: page,
        user: req.session.passport.user
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



