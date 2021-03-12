

// Requiring our custom middleware for checking if a user is logged in
var isAuthenticated = require("../config/middleware/isAuthenticated");
var db = require("../models");

module.exports = function(app) {

  app.get("/", function(req, res) {
    // If the user already has an account send them to the members page
    if (req.user) {
      res.render('members');
    }
    res.render('signup');
  });

  app.get("/login", function(req, res) {
    // If the user already has an account send them to the members page
    if (req.user) {
        res.render('members');
    }
    res.render('login');
  });

  // Here we've add our isAuthenticated middleware to this route.
  // If a user who is not logged in tries to access this route they will be redirected to the signup page
  app.get("/members", isAuthenticated, function(req, res) {
    res.render('members');
  });

  // If a user who is not logged in tries to access this route they will be redirected to the signup page
  app.get("/profile", isAuthenticated, function(req, res) {
    res.render('profile');
  });

   // If a user who is not logged in tries to access this route they will be redirected to the signup page
   app.get("/upload", isAuthenticated, function(req, res) {
    res.render('profile');
  });

  // If a user who is not logged in tries to access this route they will be redirected to the signup page
  app.get("/grogu-quest", isAuthenticated, function(req, res) {
    res.render('game');
  });
  //route for game2
  app.get("/paperb-moon", isAuthenticated, function(req, res) {
    res.render('game2');
  });

     //route for game one highscores
     app.get("/grogu-scores", isAuthenticated, function(req, res) {
      let profileImage;
      let userId = req.user.id
    db.Image.findAll({
      where: {Userid: userId},
      order: [
        ['createdAt', 'DESC'],
      ]
    }).then((dbImage) => {
      if (dbImage.length === 0) {
        profileImage = `/assets/hero1.png`
      }else {
         profileImage = dbImage[0].name
      }


      db.machOneScore.findAll({
        include: [db.User],
        order: [
          ['score', 'DESC'],
    ],
      }).then((data) => {
        //console.log(data)
        const obj = {
        scores: data.map(data =>{
          return {
            score: data.score,
            userName: data.User.userName,
            image: profileImage
          }
        })
        }
  
        res.render('highscore',(obj));
      })
    })
    });

        //  //route for game two highscores
        //  app.get("/paperb-scores", isAuthenticated, function(req, res) {
        //   db.machTwoScore.findAll({
        //     include: [db.User]
        //   }).then((data) => {
        //     console.log(data)
        //     const obj = {
        //     scores: data.map(data =>{
        //       return {
        //         score: data.score,
        //         userName: data.User.userName
        //       }
        //     })
        //     }
      
        //     res.render('highscore-two',(obj));
        //   })
        // });

             //route for game two highscores
     app.get("/paperb-scores", isAuthenticated, function(req, res) {
      let profileImage;
      let userId = req.user.id
    db.Image.findAll({
      where: {Userid: userId},
      order: [
        ['createdAt', 'DESC'],
      ]
    }).then((dbImage) => {
      if (dbImage.length === 0) {
        profileImage = `/assets/hero1.png`
      }else {
         profileImage = dbImage[0].name
      }


      db.machTwoScore.findAll({
        include: [db.User],
        order: [
          ['score', 'DESC'],
    ],
      }).then((data) => {
        //console.log(data)
        const obj = {
        scores: data.map(data =>{
          return {
            score: data.score,
            userName: data.User.userName,
            image: profileImage
          }
        })
        }
  
        res.render('highscore-two',(obj));
      })
    })
    });
};