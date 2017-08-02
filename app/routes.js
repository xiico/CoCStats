
var db = require('../app/db');
var localization = require('../config/localization');
var locations = require('../config/locations');
var clans = [];
// load up the clan model
var Clan = require('../app/models/clan');
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

function formatChartData(entries){
  var clans = [];
  entries.forEach(function (entry) {
    entry.items.forEach(function (item) {
      if (clans.map(function (x) { return x.tag; }).indexOf(item.tag) < 0) clans.push({ "name": item.name, "tag": item.tag });
    }, this);
  }, this);
  var clanNames = ["Date"]
  clans.forEach(function(clan) {
    clanNames.push(clan.name);
  }, this);
  var chartData = [clanNames];
  entries.forEach(function (entry) {
    var dataPoints = [];
    var date = ("0"+(entry.date.getMonth()+1)).slice(-2) + "-" + ("0" + entry.date.getDate()).slice(-2) + " " + ("0" + entry.date.getHours()).slice(-2) + ":00";
    dataPoints[0] = date;
    clans.forEach(function (clan) {
      var itemIndex = entry.items.map(function (x) { return x.tag; }).indexOf(clan.tag);
      if (itemIndex >= 0) {
        dataPoints[clans.indexOf(clan) + 1] = entry.items[itemIndex].clanPoints;
      } else dataPoints[clans.indexOf(clan) + 1] = null

      //dataPoints.push(clans.indexOf(clan));

    }, this);
    chartData.push(dataPoints);
  }, this);

  return chartData;
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

  function RenderPage(page, req, res, userClans, searchResults, message) {
    if (!res)
      return;
    var pageObjects = {
      user: req.user, // get the user out of session and pass to template
      url: req.url,
      clans: userClans,
      _: function (msgid) {
        return localization(msgid, (!req.params.lang ? "en" : req.params.lang));
      },
      clanRoles: clanRoles,
      searchResults: searchResults,
      clan: searchResults ? searchResults.items[0] : null,
      message: message ? message : "",
      locations: locations,
      lstLocation: req.body.location,
      countryCode: req.body.location ? locations.filter(function (locations) { return locations.id == req.body.location; })[0].countryCode.toLowerCase() : undefined,
      player: searchResults && searchResults.items.length > 0 && searchResults.items[0].playerSearch ? searchResults.items[0] : null,
      params: req.params
    };
    res.render(page, pageObjects); // load the index.ejs file
  }

  // =====================================
  // HOME PAGE (with login links) ========
  // =====================================
  app.get('/:lang?/', function (req, res) {
    res.locals.title = "Main Page";
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
    res.locals.title = "Clan Details"
    db.searchClans('Tag', req.params.id, null, function (err, clans) {
        UpdateClans([clans.tag], function(){});
        RenderPage('clan', req, res, [], { items: [clans] });
    });
  });

  // =====================================
  // PLAYER DETAILS =======================
  // =====================================
  app.get('/:lang?/players/:id', /*isLoggedIn,*/ function (req, res) {
    if (req.params.id && req.params.id != "rank") {
      res.locals.title = "Player Details";      
      db.searchPlayers('Tag', req.params.id, null, function (err, player) {
        if(player) db.updatePlayer({tag: player.tag, name: player.name});
        RenderPage('player', req, res, [], { items: [player] });
      });
    } else {
      res.locals.title = "Legend Rank";   
      db.getLeague("league", 29000022 , "", function(err,result){
        RenderPage('playerRank', req, res, [], result);
      });
     }
  });

  // =====================================
  // Global Rank =========================
  // =====================================
  app.get('/:lang?/rank/:id?', /*isLoggedIn,*/ function (req, res) {    
    db.searchClans('rank', req.params.id, null, function (err, clans) {
      if (!req.params.id) {
        res.locals.title = "Global Rank";
        clans.items.sort(function (a, b) {
          return parseFloat(b.clanPoints) - parseFloat(a.clanPoints);
        });

        db.getRank({latest:true, type:"global"}, function (err, entries) {
          clans.items.forEach(function (item) {
            item.rank = clans.items.indexOf(item) + 1;
            if(entries.length > 0)
              item.previousRank = entries[0].items.map(function (x) { return x.tag; }).indexOf(item.tag) + 1;
          }, this);
          RenderPage('rank', req, res, [], clans, req.flash("rankMessage"));
        });
      } else {
        res.locals.title = "Country Rank";
        if(clans) db.updateRank(req.params.id);
        if (clans && (!clans.items[0].rank || !clans.items[0].previousRank)) {
          clans.items.forEach(function (item) {
            if (!item.rank) item.rank = clans.items.indexOf(item) + 1;
            if (!item.previousRank) item.previousRank = -1;
          }, this);
        }
        RenderPage('rank', req, res, [], clans, req.flash("rankMessage"));
      }
    });
  });

  // =====================================
  // RANK CHART ==========================
  // =====================================
  app.get('/rankchart/:id?', /*isLoggedIn,*/ function (req, res) {
    if (req.params.id) {
      db.getRank({ latest: false, location: req.params.id }, function (err, entries) {
        var chartData = formatChartData(entries);
        res.send(chartData);
      });
    } else {
      db.getRank({ latest: false }, function (err, entries) {
        var chartData = formatChartData(entries);
        res.send(chartData);
      });
    }
  });  

  // =====================================
  // SAVE CLAN ===========================
  // =====================================
  app.get('/saveclan/:id', /*isLoggedIn,*/ function (req, res) {
    if (req.user && req.user.clans.length < 10) {

      if(req.user.clans.map(function (x) { return x.tag; }).indexOf("#" + req.params.id) > -1){
        res.send({error:"clan already added!"});
        return;
      }

      var newTag = "#" + req.params.id;
      for (var index = 0; index < req.user.clans.length; index++)
        req.user.clans[index].active = false;

      req.user.clans.push({ tag: newTag, active: true });
      req.user.save();
      res.send({ ok: true });
      return;
    }
    res.send({error:"max number of clans reached!"});
  });

  // =====================================
  // CLAN HISTORY ========================
  // =====================================
  app.get('/clanhistory/:id', /*isLoggedIn,*/ function (req, res) {
      db.getClanHistory(req.params.id, function (err, history) {
        if (err) {
          console.error(err)
          res.send("db error.")
        }
        //var result = [["Date", "Level", "Wins", "Streak", "Points", "Members"]];
        var result = [["Date", "Points"]];
        history.forEach(function (element) {
          var date = element.date.getFullYear() + "-" + ("0"+(element.date.getMonth()+1)).slice(-2) + "-" + ("0" + element.date.getDate()).slice(-2) + " " + ("0" + element.date.getHours()).slice(-2) + ":00";
          result.push([date, element.clanPoints]);
        }, this);
        //RenderPage('clan', req, res, [], { items: [clans], history: result });
        res.send(result);
      })
  });

  app.post('/:lang?/', /*isLoggedIn,*/ function (req, res) {
    res.locals.title = "Main Page";
    if (req.body.hasOwnProperty("btnAdd") || req.body.hasOwnProperty("btnAddClanTag")) {
      if (req.user.clans.length < 10) {
        var newTag = req.body.addTag ? req.body.addTag : req.body.clanTag;
        for (var index = 0; index < req.user.clans.length; index++)
          req.user.clans[index].active = false;

        req.user.clans.push({ tag: newTag, active: true });
        req.user.save();
      }
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
        RenderPage('index', req, res, clans, searchResults, req.flash("searchMessage"));
      });
    }
    else if (req.body.hasOwnProperty("btnRank")) {
        res.redirect("/rank" + (req.body.location ? "/" + req.body.location : ""))
    }
    else {
      RenderPage('index', req, res, clans, searchResults, req.flash("infoMessage"));
    }
  });
  // =====================================
  // LOGIN ===============================
  // =====================================
  // show the login form
  app.get('/:lang?/login', function (req, res) {
    res.locals.title = "Login Page";
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
    res.locals.title = "Signup Page";
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
    res.locals.title = "Authenticate Page";
    res.render('authenticate', {
      user: req.user, // get the user out of session and pass to template
      url: req.url,
      message: req.flash('authenticateMessage')
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
    res.locals.title = "Profile Page";
    res.render('profile', {
      //res.render('profile.ejs', {
      user: req.user, // get the user out of session and pass to template
      url: req.url,
      message: req.flash('profileMessage')
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