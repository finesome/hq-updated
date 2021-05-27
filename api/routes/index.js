// routes
const adminRoute = require("./admin");
const courseRoute = require("./course");
const paymentRoute = require("./payment");
const staticRoute = require("./static");
const userRoute = require("./user");

module.exports = [].concat(adminRoute, courseRoute, paymentRoute, staticRoute, userRoute);
