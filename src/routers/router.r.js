const express = require('express');
const router = express.Router();
const controller = require('../controllers/bookshopManager.c');
//const userC = require('../controllers/users.c');

router.get('/', controller.getHome);

router.get('/search', controller.getSearch);

router.get('/import', controller.getImport);

router.get('/invoice', controller.getInvoice);

router.get('/bill', controller.getBills);

router.get('/report', controller.getReports);

router.get('/rule', controller.getRules);

module.exports = router;