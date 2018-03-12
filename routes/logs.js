module.exports = function (app) {
    var valida = require('./../middlewares/valida');
    var logs = app.controllers.logs;
    app.get('/browser', valida, logs.browser);
    app.get('/view', valida, logs.view);
};