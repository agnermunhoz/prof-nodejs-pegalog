module.exports = function (app) {

    var fs = require('fs');
    var url = require('url');

    var LogsController = {
        view: function (request, response) {
            var usuario = request.session.usuario;
            var q = url.parse(request.url, true);

            if (!q.search) {
                console.log("Arquivo não encotrado.");
                response.status(404).send("Not found");
            }
            else {
                var path = decodeURI(q.search.substr(1));
                if (path.indexOf("..") > -1) {
                    console.log("Navegação proibida.");
                    response.status(403).send("Forbidden");
                }
                else {
                    var filePath = appConfig.basePath + decodeURI(path);
                    response.download(filePath);
                }
            }
        },
        browser: function (request, response) {
            var usuario = request.session.usuario;
            var q = url.parse(request.url, true);

            var path = "";
            if (q.search) {
                path = decodeURI(q.search.substr(1));
            }

            if (path.indexOf("..") > -1) {
                console.log("Navegação proibida. Path '"+path+"'");
                response.status(403).send("Forbidden");
            }
            else {

                var dirs = fs.readdirSync(appConfig.basePath + path).filter(f => fs.statSync(appConfig.basePath + path + f).isDirectory());
                var files = fs.readdirSync(appConfig.basePath + path).filter(f => fs.statSync(appConfig.basePath + path + f).isFile());

                var params = { usuario: usuario, path: path, dirs: dirs, files: files };
                response.render('logs/browser', params);
            }
        }
    };

    return LogsController;
};