module.exports = [
    {
        // verified route
        method: ["GET", "POST"],
        path: "/verified",
        config: {
            auth: false,
            handler: (request, h) => {
                return h.file("public/index.html");
            },
        },
    },
    {
        // about route
        method: ["GET", "POST"],
        path: "/about",
        config: {
            auth: false,
            handler: (request, h) => {
                return h.file("public/index.html");
            },
        },
    },
    {
        // courses route
        method: ["GET", "POST"],
        path: "/courses",
        config: {
            auth: false,
            handler: (request, h) => {
                return h.file("public/index.html");
            },
        },
    },
    {
        // dashboard route
        method: ["GET", "POST"],
        path: "/dashboard/{param*}",
        config: {
            auth: false,
            handler: (request, h) => {
                return h.file("public/index.html");
            },
        },
    },
    {
        // admin route
        method: ["GET", "POST"],
        path: "/admin/{param*}",
        config: {
            auth: false,
            handler: (request, h) => {
                return h.file("public/index.html");
            },
        },
    },
    {
        // upload
        method: "GET",
        path: "/uploads/{param*}",
        config: {
            auth: false,
            handler: {
                directory: {
                    path: "uploads",
                },
            },
        },
    },
    {
        // static files
        method: "GET",
        path: "/{param*}",
        config: {
            auth: false,
            handler: {
                directory: {
                    path: "public",
                },
            },
        },
    },
];
