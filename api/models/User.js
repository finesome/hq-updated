const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const UserSchema = new Schema(
    {
        email: {
            type: String,
            required: true,
            unique: true
        },
        verification: {
            status: {
                type: Boolean,
                default: false
            },
            token: String
        },
        lastName: {
            type: String,
            default: ""
        },
        firstName: {
            type: String,
            default: ""
        },
        city: {
            type: String,
            default: ""
        },
        school: {
            type: String,
            default: ""
        },
        phone: {
            type: String,
            default: ""
        },
        mailing: {
            type: Boolean,
            default: false
        },
        activeDevices: [
            {
                deviceToken: String
            }
        ],
        scope: {
            type: String,
            default: "user"
        },
        hash: String,
        salt: String,
        courses: [
            {
                _id: String,
                dateEnrolled: Date,
                progress: {
                    type: Number,
                    default: 0
                },
                lessons: [
                    {
                        _id: String,
                        score: String
                    }
                ]
            }
        ],
        exams: [
            {
                examId: String,
                subject: String,
                time: Number,
                questions: [
                    {
                        questionId: String,
                        question: String,
                        topic: String,
                        subtopic: String,
                        userAnswer: String,
                        correct: Boolean
                    }
                ]
            }
        ],
        purchasedExams: [
            {
                examId: String,
                datePurchased: Date
            }
        ]
    },
    { timestamps: true }
);

UserSchema.method({
    setPassword: function(password) {
        this.salt = bcrypt.genSaltSync();
        this.hash = bcrypt.hashSync(password, this.salt);
    },
    validPassword: function(password) {
        return bcrypt.compareSync(password, this.hash);
    },
    generateJWT: function(deviceToken) {
        return jwt.sign(
            {
                id: this._id,
                email: this.email,
                scope: this.scope,
                deviceToken: deviceToken
            },
            process.env.JWT_SECRET,
            {
                algorithm: "HS256",
                expiresIn: "10d"
            }
        );
    }
});

module.exports = mongoose.model("User", UserSchema);
