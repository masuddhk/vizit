
//---------------------------------------------signup page call------------------------------------------------------
exports.signup = function (req, res) {
  message = '';
  if (req.method == "POST") {
    var post = req.body;
    var name = post.user_name;
    var pass = post.password;
    var fname = post.first_name;
    var lname = post.last_name;
    var mob = post.mob_no;

    var sql = "INSERT INTO `users`(`first_name`,`last_name`,`mob_no`,`user_name`, `password`) VALUES ('" + fname + "','" + lname + "','" + mob + "','" + name + "','" + pass + "')";

    var query = db.query(sql, function (err, result) {

      message = "Succesfully! Your account has been created.";
      res.render('signup.ejs', { message: message });
    });

  } else {
    res.render('signup');
  }
};

//-----------------------------------------------login page call------------------------------------------------------
exports.login = function (req, res) {
  var message = '';
  var sess = req.session;

  if (req.method == "POST") {
    var post = req.body;
    var name = post.user_name;
    var pass = post.password;

    var sql = "SELECT id, first_name, last_name, user_name FROM `users` WHERE `user_name`='" + name + "' and password = '" + pass + "'";
    db.query(sql, function (err, results) {
      if (results.length) {
        req.session.userId = results[0].id;
        req.session.user = results[0];
        //console.log(results[0].id);
        res.redirect('/home/dashboard');
      }
      else {
        message = 'Wrong Credentials.';
        res.render('index.ejs', { message: message });
      }

    });
  } else {
    res.render('index.ejs', { message: message });
  }

};
//-----------------------------------------------dashboard page functionality----------------------------------------------

exports.dashboard = function (req, res, next) {

  var user = req.session.user,
    userId = req.session.userId;
  //console.log('ddd=' + userId);
  if (userId == null) {
    res.redirect("/login");
    return;
  }

  var sql = "SELECT GROUP_CONCAT(v.CountryCode) as Countries FROM uservisits v where v.UserId='" + userId + "' group by UserId";
  //console.log('SQL: ' + sql);
  var CC = '';
  db.query(sql, function (err, results) {
    CC = results[0].Countries;
  });

  sql = "SELECT u.first_name,u.last_name,v.CountryCode,c.name as CountryName,vd.FromDate,vd.ToDate,vd.VisitedWith,vd.VisitedCity \
          FROM uservisits v   \
          INNER JOIN users u ON u.id=v.UserId   \
          INNER JOIN country c ON c.iso=v.CountryCode   \
          LEFT JOIN uservisitdet vd ON vd.VisitId=v.VisitId   \
          WHERE v.UserId='" + userId + "'";

          //console.log(sql);

  db.query(sql, function (err, results) {
    //console.log(JSON.stringify(results));
    res.render('dashboard.ejs', { data: results,user: user, country: CC });
  });



};
//------------------------------------logout functionality----------------------------------------------
exports.logout = function (req, res) {
  req.session.destroy(function (err) {
    res.redirect("/login");
  })
};
//--------------------------------render user details after login--------------------------------
exports.profile = function (req, res) {

  var userId = req.session.userId;
  if (userId == null) {
    res.redirect("/login");
    return;
  }

  var sql = "SELECT GROUP_CONCAT(v.CountryCode) as Countries FROM uservisits v where v.UserId='" + userId + "' group by UserId";
  //console.log('SQL: ' + sql);
  var CC = '';
  db.query(sql, function (err, results) {
    CC = results[0].Countries;
  });

  var sql = "SELECT * FROM `users` WHERE `id`='" + userId + "'";
  db.query(sql, function (err, result) {
    res.render('profile.ejs', { data: result, country: CC });
  });
};
//---------------------------------edit users details after login----------------------------------
exports.editprofile = function (req, res) {
  var userId = req.session.userId;
  if (userId == null) {
    res.redirect("/login");
    return;
  }

  var sql = "SELECT * FROM `users` WHERE `id`='" + userId + "'";
  db.query(sql, function (err, results) {
    res.render('edit_profile.ejs', { data: results });
  });
};

//-------------------------------- render map --------------------------------
exports.map = function (req, res) {
  message = '';
  var user = req.session.user,
    userId = req.session.userId;
  //console.log('ddd=' + userId);
  if (userId == null) {
    res.redirect("/login");
    return;
  }

  var sql = "SELECT GROUP_CONCAT(v.CountryCode) as Countries FROM uservisits v where v.UserId='" + userId + "' group by UserId";
  //console.log('SQL: ' + sql);
  var CC = '';
  db.query(sql, function (err, results) {
    CC = results[0].Countries;
  });

  res.render('map', { country: CC });


};

//---------------------------------------------signup page call------------------------------------------------------
exports.saveVisitData = function (req, res) {
  message = '';
  if (req.method == "POST") {
    var user = req.session.user,
      userId = req.session.userId;

    var post = req.body;
    var cc = post.cc;
    var vfd = post.vfd;
    var vtd = post.vtd;
    var vwith = post.vwith;
    var vcity = post.vcity;

    var sql = "INSERT INTO `vizit`.`uservisits` (`UserId`, `CountryCode`) VALUES ('" + userId + "', '" + cc + "')";

    console.log('SQL: ' + sql);
    var query = db.query(sql, function (err, result) {

      message = "Succesfully! Your account has been created.";
      res.render('map.ejs', { message: message });
    });

  } else {
    res.render('map');
  }
};


