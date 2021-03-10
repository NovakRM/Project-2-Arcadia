

// Requiring our custom middleware for checking if a user is logged in
var isAuthenticated = require("../config/middleware/isAuthenticated");

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
  app.get("/game", isAuthenticated, function(req, res) {
    res.render('game');
  });
  //route for game2
  app.get("/game2", isAuthenticated, function(req, res) {
    res.render('game2');
  });

     //route for game one highscores
     app.get("/highscores", isAuthenticated, function(req, res) {
      db.machOneScore.findAll({
        include: [db.User]
      }).then((data) => {
        console.log(data)
        const obj = {
        scores: data.map(data =>{
          return {
            score: data.score,
            userName: data.User.userName
          }
        })
        }
  
        res.render('highscore',(obj));
      })
    });

         //route for game two highscores
         app.get("/highscores-two", isAuthenticated, function(req, res) {
          db.machTwoScore.findAll({
            include: [db.User]
          }).then((data) => {
            console.log(data)
            const obj = {
            scores: data.map(data =>{
              return {
                score: data.score,
                userName: data.User.userName
              }
            })
            }
      
            res.render('highscore-two',(obj));
          })
        });

};