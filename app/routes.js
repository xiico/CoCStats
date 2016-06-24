// load up the clan model
var Clan = require('../app/models/clan');

var https = require('https');

// load up the User model
var User = require('../app/models/user');
var localization = require('../config/localization');
var clans = [];
var clanRoles = function (clanRole) {
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
    // Search a Clan =======================
    // =====================================
    function SearchClan(req, pageRes, tag, updateClans, page, search) {
        https.get({
            host: 'api.clashofclans.com',
            path: '/v1/clans/%23' + tag.replace('#', ''),//80U9PL8P 
            headers: { 'authorization': 'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzUxMiIsImtpZCI6IjI4YTMxOGY3LTAwMDAtYTFlYi03ZmExLTJjNzQzM2M2Y2NhNSJ9.eyJpc3MiOiJzdXBlcmNlbGwiLCJhdWQiOiJzdXBlcmNlbGw6Z2FtZWFwaSIsImp0aSI6ImY5NDBlOTYxLWQ2MTMtNGI3Ni05MDBhLTlhNTI2NGNlYzZhNyIsImlhdCI6MTQ2NjQ2NTM4Miwic3ViIjoiZGV2ZWxvcGVyLzhhZmQ5ZjJhLWQzNmEtYzdkMS1jZjgxLTRmZGExN2Q1ZWZlZCIsInNjb3BlcyI6WyJjbGFzaCJdLCJsaW1pdHMiOlt7InRpZXIiOiJkZXZlbG9wZXIvc2lsdmVyIiwidHlwZSI6InRocm90dGxpbmcifSx7ImNpZHJzIjpbIjQ1LjU1LjIyMS4yMjUiXSwidHlwZSI6ImNsaWVudCJ9XX0.4SWOJT3Qac_XTB2Y2ay9dgQ7f8L6j5C59nzwXGQPqyJ1Mkxs4V2xzVqXPacp10ywvDmrOid9tb_2q-bsW_czLA' }
        }, function (res) {
            // explicitly treat incoming data as utf8 (avoids issues with multi-byte chars)
            //res.setEncoding('utf8');

            // incrementally capture the incoming response body
            var body = '';
            res.on('data', function (d) {
                body += d;
            });

            // do whatever we want with the response once it's done
            res.on('end', function () {
                try {
                var isets = 0;
                    var parsed = JSON.parse(body);
                } catch (err) {
                    console.error('Unable to parse response as JSON', err);
                    return cb(err);
                }
                console.log('parsed.tag: ' + parsed.tag);
                if (parsed.tag) {
                    if (updateClans) {
                        Clan.findOneAndUpdate({ tag: parsed.tag }, parsed, { upsert: true, new: true, setDefaultsOnInsert: true }, function (err, clan) {
                            if (err)
                                throw err;
                            console.log('findOneAndUpdate - page: ' + page);
                            if (pageRes) {
                                Clan.find({ tag: search }, function (err, clans) {
                                    if (err)
                                        throw err;
                                    console.log('findOneAndUpdate>Clan.find - clans.length:' + clans.length);
                                    RenderPage(page, req, pageRes, clans);
                                });
                            }
                        });
                    }
                    else
                    {
                        console.log('[parsed] - clans.length:');
                        if(parsed.tag == "#290LQGY2")
                        {
                          /*console.log('changed:' + parsed.memberList[20].name + "to: " + (parsed.memberList[20].name = 'changed name 1'));
                          console.log('changed:' + parsed.memberList[48].name + "to: " + (parsed.memberList[20].name = 'changed name 2'));*/
                          console.log('parsed.memberList = []');
                          parsed.memberList = [];
                          console.log(parsed);
                        }

                        RenderPage(page, req, pageRes, [parsed]);
                    }

                }
                else {
                    if (tag.indexOf("#") < 0) {
                        tag = "#" + tag;
                    }
                    var sch = updateClans ? search : tag;
                    Clan.find({ tag: sch }, function (err, clans) {
                        if (err)
                            throw err;
                        RenderPage(page, req, pageRes, clans);
                    });
                }

            });
        }).on('error', function (err) {
            // handle errors with the request itself
            console.error('Error with the request:', err.message);
            cb(err);
        });
    }

    function RenderPage(page, req, res, clans) {
        if (!res)
            return;
        res.render(page, {
            user: req.user, // get the user out of session and pass to template
            url: req.url,
            clans: clans,
            clan: clans[0],
            _: function (msgid) {
                return localization(msgid, (!req.params.lang ? "en" : req.params.lang));
            },
            clanRoles: clanRoles
        }); // load the index.ejs file
    }

    // =====================================
    // HOME PAGE (with login links) ========
    // =====================================
    app.get('/:lang?/', function (req, res) {
        if (req.user /*&& req.user.clans.length > 0*/) {
            var search = [];
            if (req.session.viewed === undefined) {
                req.session.viewed = true;
                for (var index = 0; index < req.user.clans.length; index++) {
                    search[search.length] = req.user.clans[index].tag;

                    if (search.length != req.user.clans.length)
                        SearchClan(req, null, req.user.clans[index].tag, true);
                    else
                        SearchClan(req, res, req.user.clans[index].tag, true, "index", { $in: search });
                }
            }
            else {
                for (var index = 0; index < req.user.clans.length; index++)
                    search[search.length] = req.user.clans[index].tag;
                //{ $in: [<value1>, <value2>, ... <valueN> ] }
                Clan.find({ tag: { $in: search } }, function (err, cls) {
                    if (err)
                        throw err;
                    if (cls) {
                        RenderPage('index', req, res, cls)
                    }
                });
            }
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
            /*Clan.findOne({ tag: "#" + req.params.id }, function (err, clan) {
                if (err)
                    throw err;
                    
                    res.render('clan', {
                        user: req.user, // get the user out of session and pass to template
                        url: req.url,
                        clan: clan,
                        _: function (msgid) {
                            return localization(msgid, (!req.params.lang ? "en" : req.params.lang));
                        },
                        clanRoles: clanRoles
                    }); // load the index.ejs file
                    
            });*/

            SearchClan(req, res, req.params.id, null, 'clan');


        }
    });

    app.post('/:lang?/', isLoggedIn, function (req, res) {
        if (req.body.hasOwnProperty("btnAdd") || req.body.hasOwnProperty("btnAddClanTag")) {
            var newTag = req.body.addTag ? req.body.addTag : req.body.clanTag;
            for (var index = 0; index < req.user.clans.length; index++)
                req.user.clans[index].active = false;

            req.user.clans.push({ tag: newTag, active: true });
            req.user.save();
        }
        if (req.body.hasOwnProperty("btnDel")) {
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
                    RenderPage('index', req, res, clans)
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