const express = require('express');
const router = express.Router();
const bookshopManager = require('../controllers/bookshop_manager.c');
const { check } = require('express-validator');
const accountManager = require('../controllers/account_manager.c');
const passport = require('passport');
const bodyParser = require('body-parser');



router.get('/login', accountManager.getLogin)

router.post('/login', accountManager.postLogin);

router.get('/register', accountManager.getRegister)

router.post('/register', accountManager.postRegister)

router.get('/logout', accountManager.getLogout);

router.get('/account/setting', accountManager.getAccountSetting);

router.post('/account/setting', accountManager.postAccountSetting);

router.get('/account/password', accountManager.getPasswordChanging);

router.post('/account/password', accountManager.postPasswordChanging);

// ----------------------------------------------
router.get('/', bookshopManager.getHome);

// ----------------------------------------------
router.get('/customer', bookshopManager.getCustomer);

// ---------------------------------------------
router.get('/search', bookshopManager.getSearch);

router.post('/search', bookshopManager.postSearch);

// ---------------------------------------------
router.get('/import', bookshopManager.getImports);

router.get('/import/create', bookshopManager.getImportCreate);

router.post('/import/create', bookshopManager.postImportCreate);

router.post('/import/create/add-book', bookshopManager.postImportAddBook);

router.post('/import/create/remove-book', bookshopManager.postImportRemoveBook);

router.get('/import/update/:id', bookshopManager.getImportUpdate);

router.post('/import/update', bookshopManager.postImportUpdate);

router.post('/import/delete', bookshopManager.postImportDelete);

// ---------------------------------------------
router.get('/invoice', bookshopManager.getInvoices);

router.get('/invoice/create', bookshopManager.getInvoiceCreate);

router.post('/invoice/payment', bookshopManager.postInvoicePayment);

router.get('/invoice/update', bookshopManager.getInvoiceUpdate);

router.post('/invoice/update', bookshopManager.postInvoiceUpdate);

router.get('/invoice/add-book-to-invoice', bookshopManager.getAddBookToInvoice);

router.post('/invoice/add-book-to-invoice', bookshopManager.postAddBookToInvoice);

// ---------------------------------------------
router.get('/receipt', bookshopManager.getReceipts);

router.post('/receipt/create', bookshopManager.postReceiptCreate);

router.post('/receipt/update', bookshopManager.postReceiptUpdate);

router.post('/receipt/delete', bookshopManager.postReceiptDelete);

router.get('/debt', bookshopManager.getDebtList);

// ---------------------------------------------
router.get('/report', bookshopManager.getReports);

// ---------------------------------------------
router.get('/regulation', bookshopManager.getRegulations);

router.get('/regulation/update', bookshopManager.getRegulationUpdate);

router.post('/regulation/update', bookshopManager.postRegulationUpdate);


module.exports = router;