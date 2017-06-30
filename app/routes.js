
var db = require('../app/db');
var localization = require('../config/localization');
var locations = require('../config/locations');
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
  //https://api.clashofclans.com/v1/locations/32000006/rankings/clans/80U9PL8P
  //https://api.clashofclans.com/v1/clans?name=gilgamesh&limit=20
  function UpdateClans(clans, callBack) {
    db.updateClans(clans, callBack);
  }


  function getSearchOptions(req) {
    var options = "";
    if (req.body.location && req.body.location != "") {
      options += "&locationId=" + req.body.location;
    }

    if (req.body.warFrequency && req.body.warFrequency != "") {
      options += "&warFrequency=" + req.body.warFrequency;
    }

    if (req.body.minMembers && req.body.minMembers != "") {
      options += "&minMembers=" + req.body.minMembers;
    }

    if (req.body.maxMembers && req.body.maxMembers != "") {
      options += "&maxMembers=" + req.body.maxMembers;
    }

    if (req.body.minClanPoints && req.body.minClanPoints != "") {
      options += "&minClanPoints=" + req.body.minClanPoints;
    }

    if (req.body.minClanLevel && req.body.minClanLevel != "") {
      options += "&minClanLevel=" + req.body.minClanLevel;
    }

    return options;
  }

  function RenderPage(page, req, res, userClans, searchResults, ranks) {
    if (!res)
      return;
    res.render(page, {
      user: req.user, // get the user out of session and pass to template
      url: req.url,
      clans: userClans,
      _: function (msgid) {
        return localization(msgid, (!req.params.lang ? "en" : req.params.lang));
      },
      clanRoles: clanRoles,
      searchResults: searchResults,
      clan: searchResults ? searchResults.items[0] : null,
      ranks: ranks,
      locations: locations,
      lstLocation: req.body.location,
      countryCode: req.body.location ? locations.filter(function (locations) { return locations.id == req.body.location; })[0].countryCode.toLowerCase() : undefined
    }); // load the index.ejs file
  }

  // =====================================
  // HOME PAGE (with login links) ========
  // =====================================
  app.get('/:lang?/', function (req, res) {
    if (req.user /*&& req.user.clans.length > 0*/) {
      var search = [];
      //If is the first time the page is loaded
      if (req.session.viewed === undefined) {
        req.session.viewed = true;
        if (req.user.clans.length > 0) {//Check if the user is following any clan
          for (var index = 0; index < req.user.clans.length; index++) {
            search[search.length] = req.user.clans[index].tag;
          }
          UpdateClans(search, function (err, clans) {
            if (err)
              throw err;
            RenderPage('index', req, res, clans);
          });
        }
        else {
          RenderPage('index', req, res, []);
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
            RenderPage('index', req, res, cls);
          }
        });
      }
    }
    else {
      RenderPage('index', req, res, []);
    }
  });

  // =====================================
  // CLANS DETAILS =======================
  // =====================================
  app.get('/:lang?/clans/:id', /*isLoggedIn,*/ function (req, res) {
    db.searchClans('Tag', req.params.id, null, function (err, clans) {
      RenderPage('clan', req, res, [], { items: [clans] });
    });
  });

  // =====================================
  // PLAYER DETAILS =======================
  // =====================================
  app.get('/:lang?/players/:id', /*isLoggedIn,*/ function (req, res) {
    db.searchPlayers('Tag', req.params.id, null, function (err, clans) {
      RenderPage('player', req, res, [], { items: clans });
    });
  });

  // =====================================
  // SAVE CLAN ===========================
  // =====================================
  app.get('/saveclan/:id', /*isLoggedIn,*/ function (req, res) {
    req.user.clans.push({ tag: newTag, active: true });
    req.user.save();
    res.send({ ok: true });
  });

  app.post('/:lang?/', /*isLoggedIn,*/ function (req, res) {
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
    var search = [];
    req.session.location = req.body.location;
    if (req.user && req.user.clans.length > 0) {
      for (var index = 0; index < req.user.clans.length; index++) {
        search[search.length] = req.user.clans[index].tag;
      }
    }
    if (req.body.hasOwnProperty("btnSearch")) {
      db.searchClans("Name", req.body.searchFor, getSearchOptions(req), function (erro, userClans, searchResults) {
        RenderPage('index', req, res, clans, searchResults);
      });
    }
    else if (req.body.hasOwnProperty("btnRank")) {
      SearchClan(req, res, req.body.location, true, "index", { $in: search }, 'Rank');
    }
    else {
      SearchClan(req, res, req.user.clans[index].tag, true, "index", { $in: search });
    }
  });
  // =====================================
  // LOGIN ===============================
  // =====================================
  // show the login form
  app.get('/:lang?/login', function (req, res) {

    // render the page and pass in any flash data if it exists
    res.render('login', { message: req.flash('loginMessage') });
  });
  // process the login form
  app.post('/:lang?/login', passport.authenticate('local-login', {
    successRedirect: '/profile', // redirect to the secure profile section
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
    res.render('signup', { message: req.flash('signupMessage') });
  });
  // process the signup form
  app.post('/:lang?/signup', passport.authenticate('local-signup', {
    successRedirect: '/profile', // redirect to the secure profile section
    failureRedirect: '/signup', // redirect back to the signup page if there is an error
    failureFlash: true // allow flash messages
  }));

  // =====================================
  // AUTEHTICATE =========================
  // =====================================
  // show the authentication form
  app.get('/:lang?/authenticate', function (req, res) {
    res.render('authenticate', {
      user: req.user, // get the user out of session and pass to template
      url: req.url
    }); // load the index.ejs file
  });

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