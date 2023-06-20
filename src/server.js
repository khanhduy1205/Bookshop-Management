const passport = require('./configs/passport');

const express = require('express'),
    app = express(),
    port = 3000,
    Router = require('./routers/router.r'),
    path = require('path');
    flash = require('connect-flash')

app.use(express.static(__dirname + '/public'));

// allow us to post nested objects
// or using app.use(bodyParser.urlencoded({ extended: true}));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(flash())

require('./configs/hbs')(app);
require('./configs/session')(app);
require('./configs/passport') (app);

//router
app.use(Router);

app.use(function(req, res, next){
    res.locals.message = req.flash('message');
    next();
});

app.use((err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    res.status(statusCode).send(err.message);
});

app.listen(port, () =>
    console.log(`Example app listening on port ${port}!`));


