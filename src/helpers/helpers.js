const { get } = require("../routers/router.r")
var moment = require('moment');

const getNumberOfPage = (total, perPage) => {
    return [...Array(Math.ceil(total / perPage)).keys()] // Array().keys(): to create an array iterator object from 1 to ceil(total/10)
};

module.exports = {
    getNumberOfPage,

    sum: (a, b) => {
        return a + b;
    },

    isEqual: (a, b) => {
        return a == b;
    },

    prevPage: (page) => {
        return page >= 2? --page : page;
    },

    nextPage: (page, total, perPage) => {
        return page < getNumberOfPage(total, perPage).length ? ++page : page;
    },
    
    formatDate: (date) => {
        return moment(date).format('DD/MM/YYYY');
    },
}