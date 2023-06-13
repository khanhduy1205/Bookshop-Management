const express = require('express');
const router = express.Router();
const controller = require('../controllers/bookshopManager.c');
//const userC = require('../controllers/users.c');

router.get('/', controller.getHome);

router.get('/search', controller.getSearch);



module.exports = router;