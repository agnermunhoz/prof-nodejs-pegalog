module.exports = function (app) {

    var HomeController = {
        index: function (req, res) {
            var params = { domainName: appConfig.ldapDomainName };
            res.render('home/index', params);
        },
        login: function (request, response) {

            var ActiveDirectory = require('activedirectory');
            var config = {
                url: appConfig.ldapUrl,
                baseDN: appConfig.ldapBaseDN,
                username: appConfig.ldapUsername,
                password: appConfig.ldapPassword
            };
            var ad = new ActiveDirectory(config);

            var nome = request.body.usuario.nome + "@" + request.body.usuario.domain;
            var senha = request.body.usuario.senha;

            ad.authenticate(nome, senha, function (err, auth) {
                if (err) {
                    console.log('ERROR: ' + JSON.stringify(err));
                }

                if (auth) {
                    console.log('Authenticated!');
                    console.log(auth);
                    console.log("Login Usuário " + nome);
                    /*
                    ad.isUserMemberOf(nome, "", function (err, isMember) {
                        if (err) {
                            console.log('ERROR: ' + JSON.stringify(err));
                        }

                        if (isMember) {
                            console.log("User is member of!");
                            var usuario = request.body.usuario;
                            request.session.usuario = usuario;
                            response.redirect('/browser');
                        }
                        else {
                            console.log("User isn't member of!");
                            response.redirect('/');
                        }
                    });
                    */
                    var usuario = request.body.usuario;
                    request.session.usuario = usuario;
                    response.redirect('/browser');
                }
                else {
                    console.log('Authentication failed!');
                    response.redirect('/');
                }
            });
        },
        logout: function (request, response) {
            request.session.destroy();
            response.redirect('/');
        }
    };
    return HomeController;
}; 