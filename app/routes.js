// load up the clan model
var Clan = require('../app/models/clan');
var localization = require('../config/localization');
var clans = [];
var clanRoles = function(clanRole){
    switch (clanRole) {
        case "admin":
            return "Elder";
        case "leader":
            return "Leader";    
        case "coLeader":
            return "Co-Leader";
        case "member":
            return "Member";            
    }
}

module.exports = function (app, passport) {

    // =====================================
    // HOME PAGE (with login links) ========
    // =====================================
    app.get('/:lang?/', function (req, res) {
        if (req.user && req.user.clans.length > 0) {
            var search = [];
            for (var index = 0; index < req.user.clans.length; index++)
                search[search.length] = req.user.clans[index].tag;
            //{ $in: [<value1>, <value2>, ... <valueN> ] }
            Clan.find({ tag: { $in: search } }, function (err, clans) {
                if (err)
                    throw err;
                if (clans) {
                    res.render('index', {
                        user: req.user, // get the user out of session and pass to template
                        url: req.url,
                        clans: clans,
                        clanRoles: clanRoles
                    }); // load the index.ejs file
                }
            });
        }
        else {
            //res.render('index.ejs',{
            res.render('index', {
                user: req.user, // get the user out of session and pass to template
                url: req.url
            }); // load the index.ejs file
        }
    });

    // =====================================
    // CLANS DETAILS =======================
    // =====================================
    app.get('/:lang?/clans/:id', isLoggedIn, function (req, res) {
        if (req.user && req.user.clans.length > 0) {
            Clan.findOne({ tag: "#" + req.params.id }, function (err, clan) {
                if (err)
                    throw err;
                if (clan) {
                    res.render('clan', {
                        user: req.user, // get the user out of session and pass to template
                        url: req.url,
                        clan: clan,
                        _: function (msgid) {
                            return localization(msgid,(!req.params.lang ? "en" : req.params.lang));
                        },
                        clanRoles: clanRoles
                    }); // load the index.ejs file
                }
            });
        }
    });

    app.post('/:lang?/', isLoggedIn, function (req, res) {
        if (req.body.addTag || req.body.clanTag) {
            var newTag = req.body.addTag ? req.body.addTag : req.body.clanTag; 
            for (var index = 0; index < req.user.clans.length; index++)
                req.user.clans[index].active = false;

            req.user.clans.push({ tag: newTag, active: true });
            req.user.save();
        }
        if (req.body.clanToDel) {
            var indexToRemove = -1;
            for (var index = 0; index < req.user.clans.length; index++) {
                if (req.user.clans[index].tag == req.body.clanToDel)
                    indexToRemove = index;
            }

            if (indexToRemove >= 0) {
                req.user.clans.splice(indexToRemove, 1);
                req.user.save();
            }
        }
        if (req.user && req.user.clans.length > 0) {
            var search = [];
            for (var index = 0; index < req.user.clans.length; index++)
                search[search.length] = req.user.clans[index].tag;
            //{ $in: [<value1>, <value2>, ... <valueN> ] }
            Clan.find({ tag: { $in: search } }, function (err, clans) {
                if (err)
                    throw err;
                if (clans) {
                    res.render('index', {
                        user: req.user, // get the user out of session and pass to template
                        url: req.url,
                        clans: clans,
                        clanRoles: clanRoles
                    }); // load the index.ejs file
                }
            });
        }
        else {
            //res.render('index.ejs',{
            res.render('index', {
                user: req.user, // get the user out of session and pass to template
                url: req.url
            }); // load the index.ejs file
        }
    });
    // =====================================
    // LOGIN ===============================
    // =====================================
    // show the login form
    app.get('/:lang?/login', function (req, res) {

        // render the page and pass in any flash data if it exists
        res.render('login.ejs', { message: req.flash('loginMessage') });
    });
    // process the login form
    app.post('/:lang?/login', passport.authenticate('local-login', {
        successRedirect: '/', // redirect to the secure profile section
        failureRedirect: '/login', // redirect back to the signup page if there is an error
        failureFlash: true // allow flash messages
    }));

    // process the login form
    // app.post('/login', do all our passport stuff here);

    // =====================================
    // SIGNUP ==============================
    // =====================================
    // show the signup form
    app.get('/:lang?/signup', function (req, res) {

        // render the page and pass in any flash data if it exists
        res.render('signup.ejs', { message: req.flash('signupMessage') });
    });
    // process the signup form
    app.post('/:lang?/signup', passport.authenticate('local-signup', {
        successRedirect: '/profile', // redirect to the secure profile section
        failureRedirect: '/signup', // redirect back to the signup page if there is an error
        failureFlash: true // allow flash messages
    }));

    // process the signup form
    // app.post('/signup', do all our passport stuff here);

    // =====================================
    // PROFILE SECTION =====================
    // =====================================
    // we will want this protected so you have to be logged in to visit
    // we will use route middleware to verify this (the isLoggedIn function)
    app.get('/:lang?/profile', isLoggedIn, function (req, res) {
        res.render('profile', {
            //res.render('profile.ejs', {
            user: req.user, // get the user out of session and pass to template
            url: req.url
        });
    });

    app.post('/:lang?/profile', isLoggedIn, function (req, res) {
        res.render('profile', {
            //res.render('profile.ejs', {
            user: req.user, // get the user out of session and pass to template
            url: req.url
        });
    });

    // =====================================
    // FACEBOOK ROUTES =====================
    // =====================================
    // route for facebook authentication and login
    app.get('/auth/facebook', passport.authenticate('facebook', { scope: 'email' }));

    // handle the callback after facebook has authenticated the user
    app.get('/auth/facebook/callback',
        passport.authenticate('facebook', {
            successRedirect: '/profile',
            failureRedirect: '/'
        }));

    // =====================================
    // TWITTER ROUTES ======================
    // =====================================
    // route for twitter authentication and login
    app.get('/auth/twitter', passport.authenticate('twitter'));

    // handle the callback after twitter has authenticated the user
    app.get('/auth/twitter/callback',
        passport.authenticate('twitter', {
            successRedirect: '/profile',
            failureRedirect: '/'
        }));

    // =====================================
    // GOOGLE ROUTES =======================
    // =====================================
    // send to google to do the authentication
    // profile gets us their basic information including their name
    // email gets their emails
    app.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

    // the callback after google has authenticated the user
    app.get('/auth/google/callback',
        passport.authenticate('google', {
            successRedirect: '/profile',
            failureRedirect: '/'
        }));


    // =====================================
    // LOGOUT ==============================
    // =====================================
    app.get('/:lang?/logout', function (req, res) {
        req.logout();
        res.redirect('/');
    });
};

// route middleware to make sure a user is logged in
function isLoggedIn(req, res, next) {

    // if user is authenticated in the session, carry on 
    if (req.isAuthenticated())
        return next();

    // if they aren't redirect them to the home page
    res.redirect('/');
}