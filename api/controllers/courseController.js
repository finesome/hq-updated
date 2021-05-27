// dependencies
const Boom = require("boom");
const jwt = require("jsonwebtoken");
const omit = require("lodash/omit");

// models
const Course = require("../models/Course");
const Exam = require("../models/Exam");
const User = require("../models/User");

module.exports = {
    getCategories: async (request, h) => {
        // get all distinct categories
        const categories = await Course.find()
            .distinct("category")
            .catch(() => {
                return Boom.serverUnavailable("Error at the server");
            });
        // build and return a JSON response
        const response = h.response({
            statusCode: 200,
            message: categories
        });
        return response;
    },
    getExams: async (request, h) => {
        // decode header data
        const decoded = jwt.decode(request.headers.authorization);
        // get user
        const user = await User.findOne({ email: decoded.email }).catch(() => {
            return Boom.serverUnavailable("Error at the server");
        });
        if (!user) {
            return Boom.notFound("User is not found");
        }
        // get all exams
        const exams = await Exam.find()
            .lean()
            .catch(() => {
                return Boom.serverUnavailable("Error at the server");
            });
        // add answered field
        const payload = exams.map(exam => ({
            ...exam,
            answered: user.exams.some(x => x.examId == exam._id),
            purchased: user.purchasedExams.some(x => x.examId == exam._id)
        }));
        // build and return a JSON response
        const response = h.response({
            statusCode: 200,
            message: payload
        });
        return response;
    },
    getCourses: async (request, h) => {
        // decode header data
        const decoded = jwt.decode(request.headers.authorization);
        // get user
        const user = await User.findOne({ email: decoded.email }).catch(() => {
            return Boom.serverUnavailable("Error at the server");
        });
        if (!user) {
            return Boom.notFound("User is not found");
        }
        // get all courses
        const courses = await Course.find().catch(() => {
            return Boom.serverUnavailable("Error at the server");
        });
        // pick only necessary fields
        const payload = courses.map(course => ({
            _id: course._id,
            title: course.title,
            description: course.description,
            category: course.category,
            logo: course.logo,
            enrolled: user.courses.some(x => x._id == course._id)
            // add course progress if enrolled
            // progress: user.courses
        }));
        // build and return a JSON response
        const response = h.response({
            statusCode: 200,
            message: payload
        });
        return response;
    },
    getCourse: async (request, h) => {
        // pick out request parameters
        const { id } = request.params;
        // check for valid ObjectId
        if (!id.match(/^[0-9a-fA-F]{24}$/)) {
            return Boom.notFound("Course id is not valid");
        }
        // decode header data
        const decoded = jwt.decode(request.headers.authorization);
        // get user
        const user = await User.findOne({ email: decoded.email }).catch(() => {
            return Boom.serverUnavailable("Error at the server");
        });
        if (!user) {
            return Boom.notFound("User is not found");
        }
        // get course
        const course = await Course.findById(id)
            .lean()
            .catch(() => {
                return Boom.serverUnavailable("Error at the server");
            });
        if (!course) {
            return Boom.notFound("Course is not found");
        }
        // check if user is enrolled
        if (!user.courses.some(course => course._id === id)) {
            // leave only free lessons
            course.lessons = course.lessons.filter(x => x.free);
        } else {
            // find that course lessons and add as userLessons
            course.userLessons = [];
        }
        // build and return a JSON response
        const response = h.response({
            statusCode: 200,
            message: course
        });
        return response;
    },
    getExam: async (request, h) => {
        // pick out request parameters
        const { id } = request.params;
        // check for valid ObjectId
        if (!id.match(/^[0-9a-fA-F]{24}$/)) {
            return Boom.notFound("Exam id is not valid");
        }
        // get exam
        const exam = await Exam.findById(id)
            .lean()
            .catch(() => {
                return Boom.serverUnavailable("Error at the server");
            });
        if (!exam) {
            return Boom.notFound("Exam is not found");
        }
        // decode header data
        const decoded = jwt.decode(request.headers.authorization);
        // get user
        const user = await User.findOne({ email: decoded.email }).catch(() => {
            return Boom.serverUnavailable("Error at the server");
        });
        if (!user) {
            return Boom.notFound("User is not found");
        }
        // add answered field
        const payload = { ...exam, answered: user.exams.some(x => x.examId === id) };
        // build and return a JSON response
        const response = h.response({
            statusCode: 200,
            message: payload
        });
        return response;
    },
    answerExam: async (request, h) => {
        // pick out request parameters
        const { id } = request.params;
        // pick out payload
        const { exam } = request.payload;
        // decode header data
        const decoded = jwt.decode(request.headers.authorization);
        // get user
        const user = await User.findOne({ email: decoded.email }).catch(() => {
            return Boom.serverUnavailable("Error at the server");
        });
        if (!user) {
            return Boom.notFound("User is not found");
        }
        // set user exams
        if (!user.exams.some(x => x.examId === id)) {
            user.exams.push(exam);
            // save user
            user.save();
        }
        // build and return a JSON response
        const response = h.response({
            statusCode: 200
        });
        return response;
    }
};
