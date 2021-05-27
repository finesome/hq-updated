// controllers
const userController = require("../controllers/userController");

module.exports = [
    {
        // get user
        method: "GET",
        path: "/api/users",
        config: {
            auth: "jwt",
            handler: userController.getUser,
        },
    },
    {
        // register
        method: "POST",
        path: "/api/users/register",
        config: {
            auth: false,
            handler: userController.register,
        },
    },
    {
        // verify
        method: "GET",
        path: "/api/users/verify/{email}/{token}",
        config: {
            auth: false,
            handler: userController.verify,
        },
    },
    {
        // login
        method: "POST",
        path: "/api/users/login",
        config: {
            auth: false,
            handler: userController.login,
        },
    },
    {
        // logout
        method: "POST",
        path: "/api/users/logout",
        config: {
            auth: false,
            handler: userController.logout,
        },
    },
    {
        // edit user data
        method: "POST",
        path: "/api/users/edit/{attribute}",
        config: {
            auth: "jwt",
            handler: userController.edit,
        },
    },
];
