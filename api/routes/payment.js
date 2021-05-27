// dependencies
const nanoid = require("nanoid");
const easyxml = require("easyxml");
const crypto = require("crypto");

// models
const User = require("../models/User");

const serializer = new easyxml({
    singularize: true,
    rootElement: "response",
    dateFormat: "ISO",
    manifest: true
});

module.exports = [
    {
        // check
        method: "GET",
        path: "/api/payment/check",
        config: {
            auth: false,
            handler: (request, h) => {
                console.log("result");
                let salt = nanoid(16);
                let responseObject = {
                    pg_salt: salt,
                    pg_status: "ok",
                    pg_sig: crypto
                        .createHash("md5")
                        .update(`check;${salt};ok`)
                        .digest("hex")
                };
                const response = h.response(serializer.render(responseObject));
                response.type("application/xml");
                return response;
            }
        }
    },
    {
        // result
        method: "GET",
        path: "/api/payment/result",
        config: {
            auth: false,
            handler: async (request, h) => {
                // console.log(request.query);
                console.log("Payment result");
                let salt = nanoid(16);
                let responseObject = {
                    pg_salt: salt,
                    pg_status: "ok"
                };
                if (!!Number(request.query.pg_result)) {
                    console.log("result is ok");
                    responseObject["pg_status"] = "ok";
                    const user = await User.findById(request.query.user_id);
                    if (request.query.exam_id) {
                        if (!user.purchasedExams.some(x => x.examId === request.query.exam_id)) {
                            // push new purchased exam
                            user.purchasedExams.push({ examId: request.query.exam_id, datePurchased: new Date() });
                            // save user
                            user.save();
                        } else {
                            responseObject["pg_status"] = "rejected";
                            responseObject["pg_description"] = "Курс уже куплен";
                        }
                    } else {
                        if (!user.courses.some(x => x._id === request.query.course_id)) {
                            // push
                            user.courses.push({ _id: request.query.course_id, dateEnrolled: new Date() });
                            // save user
                            user.save();
                        } else {
                            responseObject["pg_status"] = "rejected";
                            responseObject["pg_description"] = "Курс уже куплен";
                        }
                    }
                } else {
                    console.log("result is rejected");
                    responseObject["pg_status"] = "rejected";
                    responseObject["pg_description"] = "Платеж отклонен";
                }
                responseObject["pg_sig"] = crypto
                    .createHash("md5")
                    .update(`check;${salt};${responseObject.pg_status}`)
                    .digest("hex");
                const response = h.response(serializer.render(responseObject));
                response.type("application/xml");
                return response;
            }
        }
    }
];
