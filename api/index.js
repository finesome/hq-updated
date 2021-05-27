"use strict";

// dotenv
require("dotenv").config();

// dependencies
const Hapi = require("hapi");
const mongoose = require("mongoose");
const routes = require("./routes");
const validate = require("./utils/validate");

// initialize Hapi server
const server = Hapi.server({
    host: process.env.HOST,
    port: process.env.PORT,
    debug: { request: ["error"] },
});

// connect to MongoDB
const url = `mongodb://${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`;
mongoose
    .connect(
        url,
        {
            autoIndex: false,
            autoReconnect: true,
            poolSize: 5,
            useNewUrlParser: true,
        }
    )
    .then(
        () => {
            console.log("Connected to MongoDB");
        },
        error => {
            console.log(`Error: ${error}`);
        }
    );

// server start async function
const up = async () => {
    // register inert
    await server.register(require("inert"));
    // jwt auth strategy
    await server.register(require("hapi-auth-jwt2"));
    server.auth.strategy("jwt", "jwt", {
        key: process.env.JWT_SECRET,
        validate: validate,
        verifyOptions: { algorithms: ["HS256"] },
    });
    // choose a default strategy
    server.auth.default("jwt");
    // define routes
    await server.route(routes);
    // start server
    await server.start();
    console.log(`Server started at ${server.info.uri}`);
};

// exit on unhandled rejections
process.on("unhandledRejection", err => {
    console.log(err);
    process.exit(1);
});

// launch server
up();
