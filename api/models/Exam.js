const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const toLower = value => value.toLowerCase();

const ExamSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    hidden: {
        type: Boolean,
        default: false
    },
    description: {
        type: String,
        default: ""
    },
    subject: {
        type: String,
        default: "",
        set: toLower
    },
    time: {
        type: Number,
        default: 3600
    },
    paid: {
        type: Boolean,
        default: false
    },
    price: {
        type: Number,
        default: 1000
    },
    questions: [
        {
            question: {
                type: String,
                default: ""
            },
            topic: String,
            subtopic: String,
            options: [String],
            answer: [String]
        }
    ]
});

module.exports = mongoose.model("Exam", ExamSchema);
