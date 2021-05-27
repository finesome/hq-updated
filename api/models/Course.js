const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const toLower = value => value.toLowerCase();

const CourseSchema = new Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        default: "",
        type: String,
    },
    category: {
        default: "",
        type: String,
        set: toLower,
    },
    logo: {
        default: "",
        type: String,
    },
    lessons: [
        {
            title: {
                type: String,
                required: true,
            },
            description: {
                default: "",
                type: String,
            },
            free: {
                type: Boolean,
                default: false,
            },
            lecture: {
                default: "",
                type: String,
            },
            quiz: {
                default: "",
                type: String,
            },
            video: {
                default: "",
                type: String,
            },
        },
    ],
});

module.exports = mongoose.model("Course", CourseSchema);
