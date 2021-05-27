// controllers
const courseController = require("../controllers/courseController");

module.exports = [
    {
        // get categories
        method: "GET",
        path: "/api/categories",
        config: {
            auth: false,
            handler: courseController.getCategories
        }
    },
    {
        // get exams
        method: "GET",
        path: "/api/exams",
        config: {
            auth: "jwt",
            handler: courseController.getExams
        }
    },
    {
        // get courses
        method: "GET",
        path: "/api/courses",
        config: {
            auth: "jwt",
            handler: courseController.getCourses
        }
    },
    {
        // get course
        method: "GET",
        path: "/api/courses/{id}",
        config: {
            auth: "jwt",
            handler: courseController.getCourse
        }
    },
    {
        // get exam
        method: "GET",
        path: "/api/exams/{id}",
        config: {
            auth: "jwt",
            handler: courseController.getExam
        }
    },
    {
        // answer to exam
        method: "POST",
        path: "/api/exams/{id}/answer",
        config: {
            auth: "jwt",
            handler: courseController.answerExam
        }
    }
];
