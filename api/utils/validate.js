// model
const User = require("../models/User");

const validate = async (decoded, request) => {
    // get token expiry data
    const now = Math.floor(new Date().getTime() / 1000);
    const expires = decoded.exp;
    // get user
    const user = await User.findOne({ email: decoded.email });
    if (!user) {
        return { isValid: false };
    }
    // if token is expired
    if (now > expires) {
        if (user.scope !== "admin") {
            // remove active device token
            user.activeDevices = user.activeDevices.filter(x => x.deviceToken !== decoded.deviceToken);
            // save user
            user.save();
        }
        return { isValid: false };
    }
    // check if device token is one of active device tokens
    if (user.scope !== "admin" && (!user || !user.activeDevices.some(x => x.deviceToken === decoded.deviceToken))) {
        return { isValid: false };
    } else {
        return { isValid: true, credentials: user.scope };
    }
};

module.exports = validate;
