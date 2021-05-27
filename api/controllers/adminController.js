// dependencies
const Boom = require("boom");
const fs = require("fs");
const path = require("path");
const sha1 = require("sha1");
// models
const Course = require("../models/Course");
const Exam = require("../models/Exam");
const Subject = require("../models/Subject");
const User = require("../models/User");

// filename extension
const getExtension = filename => {
    return filename.split(".").pop();
};

module.exports = {
    getSubjects: async (request, h) => {
        // get all subjects
        const subjects = await Subject.find().catch(() => {
            return Boom.serverUnavailable("Error at the server");
        });
        // build and return a JSON response
        const response = h.response({
            statusCode: 200,
            message: subjects
        });
        return response;
    },
    getCourses: async (request, h) => {
        // get all courses
        const courses = await Course.find().catch(() => {
            return Boom.serverUnavailable("Error at the server");
        });
        // pick specific fields
        const payload = courses.map(course => ({
            _id: course._id,
            title: course.title,
            description: course.description,
            category: course.category,
            logo: course.logo
        }));
        // build and return a JSON response
        const response = h.response({
            statusCode: 200,
            message: payload
        });
        return response;
    },
    getExams: async (request, h) => {
        // get all exams
        const exams = await Exam.find().catch(() => {
            return Boom.serverUnavailable("Error at the server");
        });
        // build and return a JSON response
        const response = h.response({
            statusCode: 200,
            message: exams
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
        // get a course
        const course = await Course.findById(id).catch(() => {
            return Boom.serverUnavailable("Error at the server");
        });
        if (!course) {
            return Boom.notFound("Course is not found");
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
        // build and return a JSON response
        const response = h.response({
            statusCode: 200,
            message: exam
        });
        return response;
    },
    addSubject: async (request, h) => {
        // pick out request payload
        const { subject } = request.payload;
        // create a new subject
        const newSubject = new Subject(subject);
        // save subject
        newSubject.save();
        // build and return a JSON response
        const response = h.response({
            statusCode: 200
        });
        return response;
    },
    deleteSubject: async (request, h) => {
        // pick out request parameters
        const { id } = request.params;
        // delete subject
        await Subject.findByIdAndDelete(id).catch(() => {
            return Boom.serverUnavailable("Error at the server");
        });
        // build and return a JSON response
        const response = h.response({
            statusCode: 200
        });
        return response;
    },
    editSubject: async (request, h) => {
        // pick out request parameters
        const { id } = request.params;
        // pick out request payload
        const { subject } = request.payload;
        const subj = await Subject.findById(id);
        // edit subject
        subj.topics = subject.topics;
        // save subject
        subj.save();
        // build and return a JSON response
        const response = h.response({
            statusCode: 200
        });
        return response;
    },
    addCourse: async (request, h) => {
        // pick out request payload
        const { course } = request.payload;
        // create a new course
        const newCourse = new Course(course);
        // save course
        newCourse.save();
        // build and return a JSON response
        const response = h.response({
            statusCode: 200
        });
        return response;
    },
    deleteCourse: async (request, h) => {
        // pick out request parameters
        const { id } = request.params;
        // delete course
        await Course.findByIdAndDelete(id).catch(() => {
            return Boom.serverUnavailable("Error at the server");
        });
        // build and return a JSON response
        const response = h.response({
            statusCode: 200
        });
        return response;
    },
    editCourse: async (request, h) => {
        // pick out request parameters
        const { id } = request.params;
        // pick out request payload
        const { course } = request.payload;
        // edit course
        await Course.findByIdAndUpdate(id, course).catch(() => {
            return Boom.serverUnavailable("Error at the server");
        });
        // build and return a JSON response
        const response = h.response({
            statusCode: 200
        });
        return response;
    },
    addExam: async (request, h) => {
        // pick out request payload
        const { exam } = request.payload;
        // create a new exam
        const newExam = new Exam(exam);
        // save exam
        newExam.save();
        // build and return a JSON response
        const response = h.response({
            statusCode: 200
        });
        return response;
    },
    deleteExam: async (request, h) => {
        // pick out request parameters
        const { id } = request.params;
        // delete exam
        await Exam.findByIdAndDelete(id).catch(() => {
            return Boom.serverUnavailable("Error at the server");
        });
        // build and return a JSON response
        const response = h.response({
            statusCode: 200
        });
        return response;
    },
    editExam: async (request, h) => {
        // pick out request parameters
        const { id } = request.params;
        // pick out request payload
        const { exam } = request.payload;
        // edit exam
        // let ex = await Exam.findById(id).catch(() => {
        //     return Boom.serverUnavailable("Error at the server");
        // });
        // replace exam
        // ex.title = exam.title;
        // ex.hidden = exam.hidden;
        // ex.description = exam.description;
        // ex.subject = exam.subject;
        // ex.time = exam.time;
        // ex.questions = exam.questions;
        // save exam
        // ex.save();
        await Exam.findByIdAndUpdate(id, exam).catch(() => {
            return Boom.serverUnavailable("Error at the server");
        });
        // build and return a JSON response
        const response = h.response({
            statusCode: 200
        });
        return response;
    },
    addLesson: async (request, h) => {
        // pick out request parametes
        const { id } = request.params;
        // pick out request payload
        const { lesson } = request.payload;
        // check for valid ObjectId
        if (!id.match(/^[0-9a-fA-F]{24}$/)) {
            return Boom.notFound("Course id is not valid");
        }
        // get a course
        const course = await Course.findById(id).catch(() => {
            return Boom.serverUnavailable("Error at the server");
        });
        if (!course) {
            return Boom.notFound("Course is not found");
        }
        // push lesson
        course.lessons.push(lesson);
        // save course
        course.save();
        // build and return a JSON response
        const response = h.response({
            statusCode: 200
        });
        return response;
    },
    editLesson: async (request, h) => {
        // pick out request parametes
        const { id, index } = request.params;
        // pick out request payload
        const { lesson } = request.payload;
        // check for valid ObjectId
        if (!id.match(/^[0-9a-fA-F]{24}$/)) {
            return Boom.notFound("Course id is not valid");
        }
        // get a course
        const course = await Course.findById(id).catch(() => {
            return Boom.serverUnavailable("Error at the server");
        });
        if (!course) {
            return Boom.notFound("Course is not found");
        }
        // replace lesson
        course.lessons[index] = lesson;
        // save course
        course.save();
        // build and return a JSON response
        const response = h.response({
            statusCode: 200
        });
        return response;
    },
    deleteLesson: async (request, h) => {
        // pick out request parametes
        const { id, index } = request.params;
        // check for valid ObjectId
        if (!id.match(/^[0-9a-fA-F]{24}$/)) {
            return Boom.notFound("Course id is not valid");
        }
        // get a course
        const course = await Course.findById(id).catch(() => {
            return Boom.serverUnavailable("Error at the server");
        });
        if (!course) {
            return Boom.notFound("Course is not found");
        }
        // remove lesson
        course.lessons.splice(index, 1);
        // save course
        course.save();
        // build and return a JSON response
        const response = h.response({
            statusCode: 200
        });
        return response;
    },
    enroll: async (request, h) => {
        // pick out request parameters
        const { email, id } = request.params;
        // get user
        const user = await User.findOne({ email: email }).catch(() => {
            return Boom.serverUnavailable("Error at the server");
        });
        if (!user) {
            return Boom.notFound("User is not found");
        }
        // enroll
        if (!user.courses.some(course => course._id === id)) {
            user.courses.push({ _id: id, dateEnrolled: new Date() });
            // save user
            user.save();
        }
        // build and return a JSON response
        const response = h.response({
            statusCode: 200
        });
        return response;
    },
    uploadCourseLogo: async (request, h) => {
        // pick out request parametes
        const { id } = request.params;
        // check for valid ObjectId
        if (!id.match(/^[0-9a-fA-F]{24}$/)) {
            return Boom.notFound("Course id is not valid");
        }
        // get course
        const course = await Course.findById(id).catch(() => {
            return Boom.serverUnavailable("Error at the server");
        });
        if (!course) {
            return Boom.notFound("Course is not found");
        }
        // create a proper filename
        let extension = request.payload["file"].hapi.filename.split(".");
        extension = extension[extension.length - 1];
        let filename = `course-${id}.${extension}`;
        // build output file path
        let outputPath = path.join(__dirname, "..", "public", "static", "media", "images", "course_logos", filename);
        // save file
        request.payload["file"].pipe(fs.createWriteStream(outputPath));
        // update course logo
        course.logo = `/static/media/images/course_logos/${filename}`;
        // save course
        course.save();
        // build and return a JSON response
        const response = h.response({
            statusCode: 200
        });
        return response;
    },
    uploadImage: async (request, h) => {
        // pick out request payload
        const data = request.payload;
        return new Promise((resolve, reject) => {
            if (data.file) {
                // create a random name
                let randomName = sha1(new Date().getTime()) + "." + getExtension(data.file.hapi.filename);
                // build an output path
                const filepath = path.join(__dirname, "..", "uploads", randomName);
                // create a write stream
                const file = fs.createWriteStream(filepath);
                // log error
                file.on("error", err => console.error(err));
                // pipe incoming data to the write stream
                data.file.pipe(file);
                data.file.on("end", () => {
                    // console.log("Finished piping readable to writable");
                    const response = h.response({
                        link: `/uploads/${randomName}`,
                        filename: data.file.hapi.filename,
                        headers: data.file.hapi.headers
                    });
                    resolve(response);
                });
            } else {
                reject({ message: "Error processing image" });
            }
        });
    },
    uploadVideo: async (request, h) => {
        // pick out request parametes
        const { courseId, lessonId } = request.params;
        // check for valid ObjectId
        if (!courseId.match(/^[0-9a-fA-F]{24}$/)) {
            return Boom.notFound("Course id is not valid");
        }
        // create a proper filename
        let extension = request.payload["file"].hapi.filename.split(".");
        extension = extension[extension.length - 1];
        let filename = `video-${lessonId}.${extension}`;
        // build output path
        let dirPath = path.join(__dirname, "..", "public", "static", "media", "videos", courseId);
        let outputPath = path.join(dirPath, filename);
        if (!fs.existsSync(dirPath)) {
            fs.mkdirSync(dirPath);
        }
        // save file
        request.payload["file"].pipe(fs.createWriteStream(outputPath)).on("error", error => {
            console.error(error);
        });
        // build and return a JSON response
        const response = h.response({
            message: `/static/media/videos/${courseId}/${filename}`,
            statusCode: 200
        });
        return response;
    }
};
