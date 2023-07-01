
const customerM = require('../models/customer.m'),
    booksM = require('../models/bookshop.m'),
    receiptM = require('../models/receipt.m'),
    importM = require('../models/import.m'),
    regulationM = require('../models/regulation.m'),
    invoiceM = require('../models/invoice.m'),
    invoiceDetailM = require('../models/invoice_details.m');

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

    // if (!req.isAuthenticated()) {
    //     return res.redirect('/');
    // }
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
            // user: req.session.passport.user
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
            // user: req.session.passport.user
        });
    } catch (err) {
        next(err);
    }

}
//---------- Customers-------------------------------
exports.getCustomer = async (req, res, next) => {

    // if (!req.isAuthenticated()) {
    //     return res.redirect('/');
    // }

    try {
        var page = parseInt(req.query.page) || 1;

        const perPage = 7;

        const customersDb = await customerM.getAll();
        const customers = customersDb.slice((page - 1) * perPage, (page - 1) * perPage + perPage)

        res.render('customer', {
            active: { customer: true },
            helpers,
            customers,
            total: customersDb.length,
            perPage,
            page: page,
            // user: req.session.passport.user
        });

    } catch (err) {
        next(err);
    }
}

// ---------- Imports ------------------------------
let listBooks = [];

//trang lập phiếu thu
exports.getImports = async (req, res, next) => {
    // if (!req.isAuthenticated()) {
    //     return res.redirect('/');
    // }

    var page = parseInt(req.query.page) || 1;
    var perPage = 7;
    const importsDb = await importM.getAllImports();

    const imports = importsDb.slice((page - 1) * perPage, (page - 1) * perPage + perPage);

    res.render('all_imports', {
        active: { import: true },
        helpers,
        total: imports.length,
        perPage,
        page: page,
        imports,
        // user: req.session.passport.user
    });
};


//bấm button thêm sách
exports.getImportCreate = async (req, res, next) => {

    // if (!req.isAuthenticated()) {
    //     return res.redirect('/');
    // }

    var page = parseInt(req.query.page) || 1;
    var perpage = 7;

    const imports = await importM.getAllImports();
    let importID = 0;
    if (imports && imports?.length) {
        importID = imports.length;
    }

    res.render('create_import', {
        active: { import: true },
        helpers,
        total: imports.length,
        page: page,
        importID,
        listBooks
    });
}

//bấm nút hoàn tất
exports.postImportCreate = async (req, res, next) => {
    // add new import to import list
    const { importDate } = req.body;
    let totalBook = 0;
    let totalPrice = 0;

    const imports = await importM.getAllImports();
    let importID = 0;
    if (imports && imports?.length) {
        importID = imports.length;
    }

    let imp = {
        importID,
        importDate
    };
    const newImport = await importM.add(imp);

    for (var i = 0; i < listBooks.length; i++) {
        const books = await booksM.getAll();
        let bookID = books[books.length - 1].bookID + 1;

        const importDetails = await importM.getAllImportDetails();
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

            totalBook += listBooks[i].quantity;
            totalPrice += listBooks[i].price * listBooks[i].quantity;
        }

        let temp = {
            importDetailID,
            bookID,
            importID,
            bookname: listBooks[i].bookname,
            quantity: listBooks[i].quantity,
            totalBook,
            totalPrice
        };
        const newImportDetail = await importM.addImportDetails(temp);
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
    let totalBook = 0, totalPrice = 0;

    listBooks.push(addBook);

    const imports = await importM.getAllImports();
    let importID = 0;
    if (imports && imports?.length) {
        importID = imports.length;
    }

    for (const book of listBooks) {
        totalBook += parseInt(book.quantity);
        totalPrice += book.price * book.quantity;
    }

    res.render('create_import', {
        importID,
        listBooks,   
        totalBook,
        totalPrice
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

    let totalBook = 0;
    let totalPrice = 0;

    for (const book of listBooks) {
        totalBook += parseInt(book.quantity);
        totalPrice += book.price * book.quantity;
    }
    res.render('create_import', {
        listBooks,
        totalBook,
        totalPrice
    });
}

exports.getImportUpdate = async (req, res, next) => {

    // if (!req.isAuthenticated()) {
    //     return res.redirect('/');
    // }
    var page = parseInt(req.query.page) || 1;
    const perPage = 7;

    const id = req.params.id;

    let listBookDetails = [];
    const importDetails = await importM.getAllImportDetailsByID(parseInt(id));
    const books = await booksM.getAll();
    let totalBook = 0;
    let totalPrice = 0;

    for (var i = 0; i < importDetails.length; i++) {            
        const book = books.find(b => b.bookID === importDetails[i].bookID);
        listBookDetails.push({
            book,
            quantity: importDetails[i].quantity
        });
        totalBook += importDetails[i].quantity;
        totalPrice += book.price * importDetails[i].quantity;
    }

    res.render('update_import', {
        active: { import: true },
        helpers,
        total: 20,
        page: page,
        perPage,
        importID: id,
        listBookDetails,
        importDetails,
        totalBook,
        totalPrice
    });
}

exports.postImportUpdate = async (req, res, next) => {
    res.redirect('/import');
}

exports.postImportDelete = async (req, res, next) => {
    var page = parseInt(req.query.page) || 1;
    var perPage = 7;

    let { listID } = req.body;
    if (listID !== undefined) {
        const books = await booksM.getAll();
        for (let i = 0; i < listID.length; i++) {
            const importDetails = await importM.getAllImportDetailsByID(parseInt(listID[i]));
            for (var j = 0; j < importDetails.length; j++) {
                const bookID = importDetails[j].bookID;
                const quantity = importDetails[j].quantity;

                const deleteImportDetail = await importM.deleteImportDetail(importDetails[j].importDetailID)
                
                const book = books.find(b => b.bookID === bookID);
                
                if (book.quantity === quantity) {
                    const deleteBook = await booksM.deleteBook(book.bookID)
                }
                else {
                    const newQuantity = book.quantity - quantity;
                    const updateBook = await booksM.updateQuantity(book.bookID, newQuantity);
                }
            }

            const deleteImport = await importM.deleteImport(parseInt(listID[i]))
        }
    }

    const importsDb = await importM.getAllImports();
    const imports = importsDb.slice((page - 1) * perPage, (page - 1) * perPage + perPage);

    res.render('all_imports', {
        active: { import: true },
        helpers,
        total: imports.length,
        page: page,
        perPage,
        imports
        // user: req.session.passport.user
    });
}

exports.getInvoices = async (req, res, next) => {
    // if (!req.isAuthenticated()) {
    //     return res.redirect('/');
    // }
    var page = parseInt(req.query.page) || 1;

    const perPage = 7;
    const invoiceDb = await invoiceM.getAll();

    const invoices = invoiceDb.slice((page - 1) * perPage, (page - 1) * perPage + perPage);
    invoices.forEach(invoice => {
        invoice.invoiceDate = new Date(invoice.invoiceDate).toLocaleDateString('zh-Hans-CN');
    })

    res.render('invoice', {
        active: { invoice: true },
        helpers,
        total: invoices.length,
        perPage,
        page: page,
        invoices,
        // user: req.session.passport.user
    });
};

exports.getInvoiceCreate = async (req, res, next) => {
    // if (!req.isAuthenticated()) {
    //     return res.redirect('/');
    // }
    try {

        const invoicesDb = await invoiceM.getAll();
        let invoiceID = 0;

        const booksDb = await booksM.getAll();

        if (invoicesDb && invoicesDb?.length) {
            invoiceID = invoicesDb.length;
        }

        res.render('create_invoice', {
            active: { invoice: true },
            invoiceID,
            books: booksDb,
            // user: req.session.passport.user
        })
    } catch (err) {
        next(err);
    }
}

exports.postInvoicePayment = async (req, res, next) => {
    // if (!req.isAuthenticated()) {
    //     return res.redirect('/');
    // }
    try {

        const invoiceInfo = req.body.invoiceInfo;
        console.log(invoiceInfo);

        if (invoiceInfo) {
            const customerInfo = invoiceInfo.customerInfo;
            const listBooks = invoiceInfo.listBooks;

            if (!customerInfo || !listBooks) {
                res.redirect('/invoice');
            }

            if (customerInfo.customerID == "") {
                const customerDb = await customerM.getAll();
                let newCustomerID = 0;   
                if (customerDb || customerDb?.length) {
                    newCustomerID = customerDb[customerDb.length - 1].customerID + 1;
                }

                customerInfo.customerID = newCustomerID;
                const newCustomer = {
                    customerID: customerInfo.customerID,
                    fullname: customerInfo.fullname,
                    address: " ",
                    email: customerInfo.email,
                    phone: customerInfo.phone,
                    unpaidAmount: 0,
                }
                await customerM.add(newCustomer);
            }

            // insert to invoice
            const invoicesDb = await invoiceM.getAll();
            
            let newInvoiceID = 0;
            if (invoicesDb || invoicesDb?.length) {
                newInvoiceID = invoicesDb[invoicesDb.length - 1].invoiceID + 1;
            }

            const newInvoice = {
                invoiceID: newInvoiceID,
                customerID: Number(customerInfo.customerID),
                fullname: customerInfo.fullname,
                invoiceDate: new Date(invoiceInfo.invoiceDate)
            }

            await invoiceM.add(newInvoice);

            // insert to invoice detail
            for (const book of listBooks) {
                
                const invoiceDetailsDb = await invoiceDetailM.getAll();

                let newDetailID = 0;
                if (invoiceDetailsDb || invoiceDetailsDb?.length) {
                    newDetailID = invoiceDetailsDb[invoiceDetailsDb.length - 1].invoiceDetailID + 1;
                }

                const newDetail = {
                    invoiceDetailID: newDetailID,
                    bookID: book.bookID,
                    invoiceID: newInvoiceID,
                    quantity: book.quantity,
                    price: book.price
                }

                await invoiceDetailM.add(newDetail);

                // change book instock 
                const bookDb = await booksM.byBookID(book.bookID);

                if (bookDb) {
                    const newQuantity = bookDb.quantity - book.quantity;

                    await booksM.updateQuantity(bookDb.bookID, newQuantity);
                }
            }
        }
        res.redirect('/invoice');

    } catch (err) {
        next(err);
    }

}

exports.getInvoiceUpdate = async (req, res, next) => {
    // if (!req.isAuthenticated()) {
    //     return res.redirect('/');
    // }
    var page = parseInt(req.query.page) || 1;

    const perPage = 7;

    res.render('update_invoice', {
        active: { invoice: true },
        helpers,
        total: 20,
        perPage,
        page: page,
        // user: req.session.passport.user
    });
}

exports.postInvoiceUpdate = async (req, res, next) => {

    res.redirect('/invoice');
}

exports.getAddBookToInvoice = async (req, res, next) => {
    // if (!req.isAuthenticated()) {
    //     return res.redirect('/');
    // }
    res.render('list_book', {
        active: { invoice: true }
    })
}

exports.postAddBookToInvoice = async (req, res, next) => {

    try {

        const invoiceInfo = req.body.invoiceInfo;

        console.log(invoiceInfo);
        const booksSelected = invoiceInfo.booksSelected;
        const customerInfo = invoiceInfo.customerInfo;
        const listBook = [];

        for (const bookSelected of booksSelected) {
            const bookDb = await booksM.byBookID(bookSelected.bookID);

            if (bookDb) {
                const bookInfo = {
                    book: bookDb,
                    quantity: bookSelected.quantity,
                    price: bookDb.price * bookSelected.quantity
                }
                listBook.push(bookInfo);
            }
        }

        const invoicesDb = await invoiceM.getAll();
        let invoiceID = 0;

        if (invoicesDb && invoicesDb?.length) {
            invoiceID = invoicesDb.length;
        }

        res.render('invoice', {
            active: { invoice: true },
            // invoiceID,
            // customerInfo,
            // listBook
            // user: req.session.passport.user
        })

        // res.redirect('/invoice/create');

    } catch (err) {
        next(err);
    }
}


exports.getDebtList = async (req, res, next) => {
    // if (!req.isAuthenticated()) {
    //     return res.redirect('/');
    // }

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
            // user: req.session.passport.user
        });

    } catch (err) {
        next(err);
    }
}

exports.getReceipts = async (req, res, next) => {

    // if (!req.isAuthenticated()) {
    //     return res.redirect('/');
    // }
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
            // user: req.session.passport.user
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

        const newReceipt = {
            receiptID: req.body.receiptID,
            customerID: req.body.customerID,
            fullname: req.body.fullname,
            addr: req.body.addr,
            email: req.body.email,
            phone: req.body.phone,
            paymentDate: new Date(req.body.date),
            amountPaid: req.body.amountPaid,
            applyRule: req.body.applyRule
        }

        console.log(newReceipt);
        const receiptDb = await receiptM.byReceiptID(newReceipt.receiptID);
        const customerDb = await customerM.byCustomerID(newReceipt.customerID);

        if (!customerDb || !receiptDb) {
            return res.redirect('/receipt');
            // error: read data failed
        }

        // check customer id
        if (customerDb.customerID == receiptDb.customerID) {
            const originDebt = customerDb.unpaidAmount + receiptDb.amountPaid;

            if (newReceipt.amountPaid != receiptDb.amountPaid) {

                if (newReceipt.amountPaid > originDebt) {
                    return res.redirect('/receipt');
                }

                //update debt
                customerDb.unpaidAmount = originDebt - newReceipt.amountPaid;
            }
        }
        else {
            const oldCustomerDb = await customerM.byCustomerID(receiptDb.customerID);

            if (!oldCustomerDb) {
                return res.redirect('/receipt');
            }
            oldCustomerDb.unpaidAmount += receiptDb.amountPaid;
            customerDb.unpaidAmount -= newReceipt.amountPaid;

            await customerM.editCustomer(oldCustomerDb);
        }
        await customerM.editCustomer(customerDb);
        await receiptM.editReceipt(newReceipt);

        res.redirect('/receipt');
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

    // if (!req.isAuthenticated()) {
    //     return res.redirect('/');
    // }
    var page = parseInt(req.query.page) || 1;

    const perPage = 7;

    res.render('report', {
        active: { report: true },
        helpers,
        total: 20,
        perPage,
        page: page,
        // user: req.session.passport.user
    });
};

exports.getRegulations = async (req, res, next) => {
    // if (!req.isAuthenticated()) {
    //     return res.redirect('/');
    // }
    var page = parseInt(req.query.page) || 1;
    const perPage = 8;

    const regulationDb = await regulationM.getAll();
    const regulation = regulationDb.slice((page - 1) * perPage, (page - 1) * perPage + perPage)

    res.render('regulation', {
        active: { regulation: true },
        helpers,
        total: regulationDb.length,
        perPage,
        page: page,
        regulation,
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



