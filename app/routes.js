module.exports = function(app, passport) {
var user       = require('../app/models/user');
var postModel  = require('../app/models/post');
var commentModel  = require('../app/models/comment');
var subscriptionModel = require('../app/models/subscription');
var savedPostModel = require('../app/models/savedpost');

// LOGOUT ==============================
    app.get('/api/logout', function(req, res) {
        req.logout();
        res.json(200,{
            status: 'OK',
            message: 'Logged Out'
        });
    });

// =============================================================================
// AUTHENTICATE (FIRST LOGIN) ==================================================
// =============================================================================

    // locally --------------------------------
        // LOGIN ===============================
        // process the login form
        app.post('/api/login', function handleLocalAuthentication(req, res, next) {//Utilizing custom callback to send json objects
            passport.authenticate('local-login', function(err, user, message) {
                if (err){
                    return next(err);
                }
                var response = {};
                if (!user) {
                    response.status = 'ERROR';
                    response.message = message;
                    return res.json(200, response);
                }

                // Manually establish the session...
                req.login(user, function(err) {
                    if (err) {
                        return next(err);
                    }
                    response.status= 'OK';
                    response.user = user;
                    return res.json(200,response);
                });

            })(req, res, next);
        });

        // SIGNUP =================================
        // process the signup form
        // app.post('/api/signup', passport.authenticate('local-signup'), function(req,res){
        //     res.json(req.user);
        // });
        app.post('/api/signup', function handleLocalAuthentication(req, res, next) { //Utilizing custom callback to send json objects
            passport.authenticate('local-signup', function(err, user, message) {
                if (err){
                    return next(err);
                }
                var response = {};
                if (!user) {
                    response.status = 'ERROR';
                    response.message = message;
                    return res.json(200, response);
                }
                // Manually establish the session...
                req.login(user, function(err) {
                    if (err){
                        return next(error);
                    }
                    response.status= 'OK';
                    response.user = user;
                    return res.json(200,response);
                });
            })(req, res, next);
        });

        app.get('/api/loggedin', function (req,res) {
            res.send(req.isAuthenticated() ? req.user : '0');
        });

// =============================================================================
// NORMAL ROUTES ===============================================================
// =============================================================================
        app.get('/getuserinfo', isLoggedIn, function (req,res) {
            var user_id = req.user._id;
            user.findOne({_id: user_id}, function (error,user) {
                var response = {};
                if (!error) {
                    response.status = 'OK';
                    response.user = user;
                    res.json(200,response);
                } else {
                    response.status = 'ERROR';
                    response.message = 'Something Went Wrong';
                    res.json(200,response);
                }
            });
        });

        app.post('/api/posts', isLoggedIn, function (req, res) {
            var post = new postModel();
            post.title = req.body.title;
            post.message = req.body.message;
            post.user = req.body.user_id;
            post.category = req.body.category;
            post.save(function (error, post) {
                var response = {};
                if (!error) {
                    response.status = 'OK';
                    response.post = post;
                    res.json(200,response);
                } else {
                    response.status = 'ERROR';
                    response.message = 'Something Went Wrong';
                    res.json(200,response);
                }
            });
        });

        app.post('/api/comments', isLoggedIn, function (req, res) {
            var comment = new commentModel();
            comment.title = "No Title";
            comment.text = req.body.text;
            comment.user = req.body.user_id;
            comment.post = req.body.post_id;
            comment.save(function (error, comment) {
                var response = {};
                if (!error) {
                    response.status = 'OK';
                    response.comment = comment;
                    res.json(200,response);
                } else {
                    response.status = 'ERROR';
                    response.message = 'Something Went Wrong';
                    res.json(200,response);
                }
            });
        });

        app.get('/api/posts', isLoggedIn, function (req, res) {
            postModel.find({}).populate('user').exec(function (error, posts) {
                var response = {};
                if (!error) {
                    response.status = 'OK';
                    response.posts = posts;
                    res.json(200, response);
                } else {
                    response.status = 'ERROR';
                    response.message = 'Something Went Wrong';
                    res.json(200, response);
                }
            });
        });

        app.get('/api/comments', isLoggedIn, function(req, res) {
            commentModel.find({}).populate('user').populate('post').exec(function (error, comments) {
              var response = {};
              if (!error) {
                  response.status = 'OK';
                  response.comments = comments;
                  res.json(200, response);
              } else {
                  response.status = 'ERROR';
                  response.message = 'Something Went Wrong';
                  res.json(200, response);
              }
            })
        })

        app.get('/api/savedposts', isLoggedIn, function(req, res) {
            var user_id = req.user._id;
            savedPostModel.find({_id: user_id}).populate('post').exec(function (error, posts) {
              var response = {};
              if (!error) {
                  response.status = 'OK';
                  response.posts = posts;
                  res.json(200, response);
              } else {
                  response.status = 'ERROR';
                  response.message = 'Something Went Wrong';
                  res.json(200, response);
              }
            })
        });

        app.post('/api/savedposts', isLoggedIn, function(req, res) {
            var savedPost = new savedPostModel();
            comment.user = req.user._id;
            comment.post = req.body.post_id;
            savedpost.save(function (error, savedpost) {
                var response = {};
                if (!error) {
                    response.status = 'OK';
                    response.savedpost = savedpost;
                    res.json(200,response);
                } else {
                    response.status = 'ERROR';
                    response.message = 'Something Went Wrong';
                    res.json(200,response);
                }
            });
        });
};

// route middleware to ensure user is logged in
function isLoggedIn(req, res, next) {
    if (req.isAuthenticated())
        return next();

    res.send('you are not logged in');
}
