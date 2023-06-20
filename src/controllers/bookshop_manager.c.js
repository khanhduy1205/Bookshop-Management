
const userM = require('../models/user.m');
const passport = require('passport');
const CryptoJS = require('crypto-js');
const helpers = require('../helpers/helpers');

const hashLength = 64;

exports.getHome = async (req, res, next) => {

    try {
        // chua dang nhap
        // if (!req.isAuthenticated()) {
        //     return res.redirect('/login');
        // }

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

exports.getImport = async (req, res, next) => {

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

    res.render('partials/modals/create_import', {
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

exports.getInvoice = async (req, res, next) => {
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


exports.getBills = async (req, res, next) => {
    var page = parseInt(req.query.page) || 1;

    res.render('bill', {
        active: { bill: true },
        helpers,
        total: 20,
        page: page,
        // user: req.session.passport.user
    });
};

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

exports.getRules = async (req, res, next) => {
    var page = parseInt(req.query.page) || 1;

    res.render('rule', {
        active: { rule: true },
        helpers,
        total: 20,
        page: page,
        // user: req.session.passport.user
    });
};

exports.getRuleUpdate = async (req, res, next) => {

    res.render('update_rule', {
        active: { rule: true }
    });
}

exports.postRuleUpdate = async (req, res, next) => {

   res.redirect('/rule');
}



