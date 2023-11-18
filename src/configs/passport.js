const passport = require('passport'),
    LocalStrategy = require('passport-local').Strategy,
    CryptoJS = require('crypto-js');

const userM = require('../models/user.m');
const hashLength = 64;

module.exports = (app) => {
    app.use(passport.initialize());
    app.use(passport.session());

    const customFields = {
        usernameField: 'username', // create custom fields so that passport can look up automatically
        passwordField: 'password',
    };

    const verifyCallback = async (username, password, done) => {
        // done is a callback
        try {
            const userDb = await userM.byUsername(username);

            if (!userDb) {
                return done(null, false);
            }

            const pwdDb = userDb.password;
            const salt = pwdDb.slice(hashLength);
            const pwdSalt = password + salt;
            const pwdHashed = CryptoJS.SHA3(pwdSalt, { outputLength: hashLength * 4 }).toString(CryptoJS.enc.Hex); // 1 kết quả mã hóa ra 1 mảng bytes, cần chuyển sang chuỗi -> sử dụng luôn hàm toString

            if (userDb.password !== pwdHashed + salt) {
                return done(null, false);
            }

            delete userDb.password;

            return done(null, userDb);
        } catch (err) {
            return done(err);
        }
    };

    passport.use(new LocalStrategy(customFields, verifyCallback));

    passport.serializeUser((user, done) => {
        return done(null, user);
    });

    passport.deserializeUser(async (user, done) => {
        done(null, user);
    });
};
