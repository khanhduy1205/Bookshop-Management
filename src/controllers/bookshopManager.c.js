

exports.getHome = async (req, res, next) => {
    res.render('home');
};

exports.getSearch = async (req, res, next) => {
    res.render('search');
};

exports.getImport = async (req, res, next) => {
    res.render('all_imports');
};

exports.getInvoice = async (req, res, next) => {
    res.render('invoice');
};

exports.getBills = async (req, res, next) => {
    res.render('bill');
};

exports.getReports = async (req, res, next) => {
    res.render('report');
};

exports.getRules = async (req, res, next) => {
    res.render('rule');
};



