

const userM = require('../models/user.m');
const passport = require('passport');
const CryptoJS = require('crypto-js');
const helpers = require('../helpers/helpers');

const hashLength = 64;


exports.getLogin = async (req, res, next) => {
    res.render('user/login', {
        layout: 'entrance_layout'
    })
}

exports.postLogin = async (req, res, next) => {
    passport.authenticate('local',
        (err, user, info) => {
            if (err) {
                req.flash('message', "Tên đăng nhập hoặc mật khẩu chưa chính xác");
                return res.render('user/login', {
                    layout: 'entrance_layout',
                    message: req.flash('message')
                })
            }

            if (!user) {
                req.flash('message', "Tên đăng nhập hoặc mật khẩu chưa chính xác");
                return res.render('user/login', {
                    layout: 'entrance_layout',
                    message: req.flash('message')
                })
            }

            req.logIn(user, (err) => {
                if (err) {
                    return next(err);
                }

                return res.redirect('/');
            })
        }
    )(req, res, next);
}

exports.getRegister = async (req, res, next) => {
    res.render('user/register', {
        layout: 'entrance_layout'
    })
}

exports.postRegister = async (req, res, next) => {

    const fulln = req.body.fullname,
        usn = req.body.username,
        pwd = req.body.pass,
        phone = req.body.phone,
        email = req.body.email,
        addr = req.body.addr
    const usersDb = await userM.getAll();

    const checkUser = usersDb.find((user) => {
        return user.username == usn;
    })

    if (checkUser) {
        res.redirect('user/register', {
            layout: 'entrance_layout',
            usnErr: "Tên đăng nhập đã tồn tại"
        });
    }

    const salt = Date.now().toString(16);
    const pwdSalt = pwd + salt;

    // hash password
    const pwdHashed = CryptoJS.SHA3(pwdSalt, { outputLength: hashLength * 4 }).toString(CryptoJS.enc.Hex);

    let id;
    if (!usersDb || !usersDb?.length) { // ?. return undefine if object is undefined or null
        id = 0;
    } else {
        id = usersDb[usersDb.length - 1].accountID + 1;
    }

    const acc = {
        id,
        fullname: fulln,
        username: usn,
        password: pwdHashed + salt,
        phone: phone,
        email: email,
        address: addr
    }

    const newUser = await userM.add(acc);
    res.redirect('/login');
}

exports.getLogout = async (req, res, next) => {
    if (req.isAuthenticated()) {
        req.logOut((err) => {
            if (err) {
                return next(err);
            }
        });
    }
    res.redirect('/');
};

exports.getAccountSetting = async (req, res, next) => {

    if (!req.isAuthenticated()) {
        return res.redirect('/login');
    }

    const user = req.session.passport.user;

    res.render('account_setting', {
        active: { accountSetting: true },
        user
    })
}

exports.postAccountSetting = async (req, res, next) => {

    if (!req.isAuthenticated()) {
        return res.redirect('/login');
    }

    const account = {
        username: req.body.username,
        fullname: req.body.fullname,
        address: req.body.address,
        phone: req.body.phone,
        email: req.body.email,
        note: req.body.note
    }

    // validation
    const fullnameRegex = /^[a-zA-Z]+(([',. -][a-zA-Z ])?[a-zA-Z]*)*$/,
        phoneRegex = /0[0-9][0-9]{8}\b/,
        emailRegex = /^[a-z][a-z0-9_\.]{1,}@[a-z0-9]{2,}(\.[a-z0-9]{2,4}){1,2}$/


    var error = { fullname: undefined, phone: undefined, email: undefined };

    var isError = false;

    if (!fullnameRegex.test(account.fullname)) {
        error.fullname = "Họ tên không hợp lệ";
        isError = true;
    }

    if (!phoneRegex.test(account.phone)) {
        error.phone = "Số điện thoại không hợp lệ";
        isError = true;
    }

    if (!emailRegex.test(account.email)) {
        error.email = "Email không hợp lệ";
        isError = true;
    }

    if (isError) {
        return res.render('account_setting', {
            active: { accountSetting: true },
            user: account,
            error: error
        })
    }

    // update database

    await userM.editAccount(account);

    const updatedUser = await userM.byUsername(account.username);

    req.session.passport.user = updatedUser;
    res.redirect('/account/setting');
}

exports.getPasswordChanging = async (req, res, next) => {
    if (!req.isAuthenticated()) {
        return res.redirect('/login');
    }

    res.render('password_changing', {
        active: { passwordChanging: true },
        user: req.session.passport.user
    })
}

exports.postPasswordChanging = async (req, res, next) => {

    const oldPassword = req.body.oldPassword,
        newPassword = req.body.newPassword,
        confirmPassword = req.body.confirmPassword,
        user = req.session.passport.user

    const userDb = await userM.byUsername(user.username);
    const pwdDb = userDb.password;
    var salt = pwdDb.slice(hashLength);

    const hashPassword = (password, salt) => {
        const pwdSalt = password + salt;
        return CryptoJS.SHA3(pwdSalt, { outputLength: hashLength * 4 }).toString(CryptoJS.enc.Hex); // 1 kết quả mã hóa ra 1 mảng bytes, cần chuyển sang chuỗi -> sử dụng luôn hàm toString
    }

    // compare old password entered to old password saved in database
    if (userDb.password !== (hashPassword(oldPassword, salt) + salt)) {

        return res.render('password_changing', {
            active: { passwordChanging: true },
            oldPwdError: "Mật khẩu cũ không chính xác"
        })
    }

    // validate new password
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;

    if (!passwordRegex.test(newPassword)) {
        return res.render('password_changing', {
            active: { passwordChanging: true },
            newPwdError: "Mật khẩu phải ít nhất 8 ký tự, ít nhất 1 ký số"
        })
    }

    // compare confirm password to new password
    if (confirmPassword !== newPassword) {
        return res.render('password_changing', {
            active: { passwordChanging: true },
            confirmError: "Mật khẩu xác nhận không trùng khớp"
        })
    }

    // hash new password
    salt = Date.now().toString(16);
    const newPwdHashed = hashPassword(newPassword, salt);

    await userM.editPassword(newPwdHashed + salt, user.id);
    res.redirect('/logOut');
}
