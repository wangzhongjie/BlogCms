const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const db = require('./db');

module.exports.init=function () {
    //console.log('passport.local.init');

    passport.use(new LocalStrategy({
        usernameField: 'email',
        passwordField: 'password'
    },function(email, password, done) {
        //console.log('passport.local.find: ', email);

        db.User.findOne({ email: email }, function (err, user) {
            //console.log('passport.local.find: ', user, err);

            if (err) {
                return done(err);
            }
            if (!user) {
                return done(null, false);
            }
            if (!user.verifyPassword(password)) {
                return done(null, false);
            }
            return done(null, user);
        });
    }));

    passport.serializeUser(function(user, done) {
        //console.log('passport.local.serializeUser: ', user);

        done(null, user._id);
    });

    passport.deserializeUser(function(id, done) {
        //console.log('passport.local.deserializeUser: ', id);

        db.User.findById(id, function (err, user) {
            done(err, user);
        });
    });
};