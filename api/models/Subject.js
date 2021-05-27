const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const toLower = value => value.toLowerCase();

const SubjectSchema = new Schema({
    name: {
        type: String,
        default: "",
        set: toLower,
    },
    topics: [
        {
            name: String,
            position: Number,
            subtopics: [String],
        },
    ],
});

module.exports = mongoose.model("Subject", SubjectSchema);
