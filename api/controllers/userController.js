// dependencies
const Boom = require("boom");
const jwt = require("jsonwebtoken");
const nanoid = require("nanoid");
const nodemailer = require("nodemailer");
const omit = require("lodash/omit");

// models
const User = require("../models/User");

// create reusable transport method (opens pool of SMTP connections)
let transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASSWORD
    }
});

transporter.verify(function(error, success) {
    if (error) {
        console.log("Transport is not ready");
        console.log(error);
    } else {
        console.log("Server is ready to take our messages");
    }
});

module.exports = {
    getUser: async (request, h) => {
        // get decoded credentials
        const { email } = request.auth.credentials;
        // get user
        const user = await User.findOne({ email: email })
            .lean()
            .catch(() => {
                return Boom.serverUnavailable("Error at the server");
            });
        if (!user) {
            return Boom.notFound("User is not found");
        }
        // omit hash, lessons, salt, updatedAt, and __v
        const payload = omit(user, ["hash", "salt", "updatedAt", "__v"]);
        // build and return a JSON response
        const response = h.response({
            statusCode: 200,
            message: payload
        });
        return response;
    },
    register: async (request, h) => {
        // pick out payload fields
        const { city, email, firstName, lastName, mailing, password, phone, school } = request.payload;
        // check if email is taken
        const exists = await User.findOne({ email: email }).catch(() => {
            return Boom.serverUnavailable("Error at the server");
        });
        if (exists) {
            return Boom.conflict("Email is already taken");
        }
        const token = nanoid();
        // create a user
        const user = new User({
            email: email,
            verification: {
                token: token
            },
            lastName: lastName,
            firstName: firstName,
            phone: phone,
            city: city,
            school: school,
            mailing: mailing
        });
        // set password
        user.setPassword(password);
        // save user
        user.save();
        // send user verification via email
        const mailOptions = {
            from: "Почтовый бот Qlabs <noreply@qlabs-edu.com>",
            to: email,
            subject: "Подтверждение регистрации на qlabs-edu.com",
            text: `Уважаемый пользователь! 
            Искренне благодарим Вас за выбор qlabs-edu.com. 
            Перейдите по ссылке для подтверждения регистрации: 
            https://qlabs-edu.com//api/users/verify/${email}/${token}
            --
            Доверяйте только настоящим профессионалам своего дела!
            Спасибо что с нами, команда Qlabs`,
            html: `<h3>Уважаемый пользователь! </h3>
            <h3>Искренне благодарим Вас за выбор qlabs-edu.com. </h3>
            <p>Перейдите по ссылке для подтверждения регистрации: </p>
            <p>https://qlabs-edu.com/api/users/verify/${email}/${token}</p>
            <p>--</p>
            <p>Доверяйте только настоящим профессионалам своего дела!</p>
            <p>Спасибо что с нами, команда Qlabs</p>`
        };
        transporter.sendMail(mailOptions, (error, response) => {
            if (error) {
                console.log(error);
            } else {
                console.log(`Confirmation message sent to ${email}`);
            }
        });
        // build and return a JSON response
        const response = h.response({
            statusCode: 200
        });
        return response;
    },
    verify: async (request, h) => {
        // pick out request params
        const { email, token } = request.params;
        // get user
        const user = await User.findOne({ email: email }).catch(() => {
            return Boom.serverUnavailable("Error at the server");
        });
        // check if user exists
        if (!user) {
            return Boom.notFound("User does not exist");
        }
        // check if user is already verified
        if (!!user.verification.status) {
            return Boom.conflict("Already verified");
        }
        // check if tokens match
        if (user.verification.token && user.verification.token === token) {
            user.verification.status = true;
            user.verification.token = "";
            user.save();
            // send registration confirmation via email
            const mailOptions = {
                from: "Почтовый бот Qlabs <noreply@qlabs-edu.com>",
                to: email,
                subject: "Добро пожаловать на qlabs-edu.com",
                text: `Добро пожаловать на Qlabs${
                    user.firstName ? `, ${user.firstName}` : ""
                }! Начинайте обучение уже сейчас! https://qlabs-edu.com`,
                html: `<h3>Добро пожаловать на Qlabs, ${user.firstName}!</h3> \n
                <p>Начинайте обучение уже сейчас!</p>
                <p>https://qlabs-edu.com</p>`
            };
            transporter.sendMail(mailOptions, (error, response) => {
                if (error) {
                    console.log(error);
                } else {
                    console.log(`Verification message sent to ${email}`);
                }
            });
        } else {
            return Boom.forbidden("Tokens do not match");
        }
        // redirect to main page
        return h.redirect("/verified");
    },
    login: async (request, h) => {
        // pick out payload fields
        const { email, password } = request.payload;
        // get user
        const user = await User.findOne({ email: email }).catch(() => {
            return Boom.serverUnavailable("Error at the server");
        });
        // check if user exists
        if (!user) {
            return Boom.notFound("User does not exist");
        }
        // check if user if verified
        if (!user.verification.status && user.scope !== "admin") {
            return Boom.forbidden("User is not verified");
        }
        // check if password is correct
        const validPassword = user.validPassword(password);
        if (!validPassword) {
            return Boom.unauthorized("Wrong credentials");
        }
        // omit specific fields
        const payload = omit(user.toObject(), [
            "activeDevices",
            "hash",
            "courses",
            "mailing",
            "salt",
            "updatedAt",
            "verification",
            "__v"
        ]);
        let deviceToken = "";
        if (user.scope !== "admin") {
            // check if user has exceeded 1 allowed active devices
            // if (user.activeDevices.length >= 1 && user.scope !== "admin") {
            //     user.activeDevices = [user.activeDevices[user.activeDevices.length - 1]];
            // }
            // generate device token
            deviceToken = nanoid();
            // add an active device token
            user.activeDevices = [{ deviceToken: deviceToken }];
            // user.activeDevices.push({ deviceToken: deviceToken });
            // save user
            user.save();
        }
        // sign a JWT token
        const token = user.generateJWT(deviceToken);
        // build and return a JSON response
        const response = h.response({
            statusCode: 200,
            message: payload
        });
        // set response header
        response.header("Authorization", token);
        return response;
    },
    logout: async (request, h) => {
        if (!request.auth.isAuthenticated) {
            // build and return a JSON response
            const response = h.response({
                statusCode: 200
            });
            return response;
        }
        // get decoded credentials
        // const { deviceToken, email } = request.auth.credentials;
        const { email } = request.auth.credentials;
        // get user
        const user = await User.findOne({ email: email }).catch(() => {
            return Boom.serverUnavailable("Error at the server");
        });
        // check if user exists
        if (!user) {
            return Boom.notFound("User does not exist");
        }
        // remove an active device token
        user.activeDevices = user.activeDevices.filter(x => x.deviceToken !== deviceToken);
        // save user
        user.save();
        // build and return a JSON response
        const response = h.response({
            statusCode: 200
        });
        return response;
    },
    edit: async (request, h) => {
        // pick out request parameters
        const { attribute } = request.params;
        const { value } = request.payload;
        // decode header data
        const decoded = jwt.decode(request.headers.authorization);
        // get user
        const user = await User.findOne({ email: decoded.email }).catch(() => {
            return Boom.serverUnavailable("Error at the server");
        });
        if (!user) {
            return Boom.notFound("User does not exist");
        }
        // update user attribute
        if (attribute == "password") {
            // update password
            user.setPassword(value);
        } else {
            user[attribute] = value;
        }
        // save user
        user.save();
        // build and return a JSON response
        const response = h.response({
            statusCode: 200
        });
        return response;
    }
};
