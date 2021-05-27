// controllers
const adminController = require("../controllers/adminController");
module.exports = [
    {
        // get all subjects
        method: "GET",
        path: "/api/admin/subjects",
        config: {
            auth: {
                strategy: "jwt",
                scope: "admin"
            },
            handler: adminController.getSubjects
        }
    },
    {
        // get all courses
        method: "GET",
        path: "/api/admin/courses",
        config: {
            auth: {
                strategy: "jwt",
                scope: "admin"
            },
            handler: adminController.getCourses
        }
    },
    {
        // get all exams
        method: "GET",
        path: "/api/admin/exams",
        config: {
            auth: {
                strategy: "jwt",
                scope: "admin"
            },
            handler: adminController.getExams
        }
    },
    {
        // get a course
        method: "GET",
        path: "/api/admin/courses/{id}",
        config: {
            auth: {
                strategy: "jwt",
                scope: "admin"
            },
            handler: adminController.getCourse
        }
    },
    {
        // get an exam
        method: "GET",
        path: "/api/admin/exams/{id}",
        config: {
            auth: {
                strategy: "jwt",
                scope: "admin"
            },
            handler: adminController.getExam
        }
    },
    {
        // add a subject
        method: "POST",
        path: "/api/admin/subjects",
        config: {
            auth: {
                strategy: "jwt",
                scope: "admin"
            },
            handler: adminController.addSubject
        }
    },
    {
        // delete a subject
        method: "DELETE",
        path: "/api/admin/subjects/{id}",
        config: {
            auth: {
                strategy: "jwt",
                scope: "admin"
            },
            handler: adminController.deleteSubject
        }
    },
    {
        // edit a subject
        method: "POST",
        path: "/api/admin/subjects/{id}",
        config: {
            auth: {
                strategy: "jwt",
                scope: "admin"
            },
            handler: adminController.editSubject
        }
    },
    {
        // add a course
        method: "POST",
        path: "/api/admin/courses",
        config: {
            auth: {
                strategy: "jwt",
                scope: "admin"
            },
            handler: adminController.addCourse
        }
    },
    {
        // delete a course
        method: "DELETE",
        path: "/api/admin/courses/{id}",
        config: {
            auth: {
                strategy: "jwt",
                scope: "admin"
            },
            handler: adminController.deleteCourse
        }
    },
    {
        // edit a course
        method: "POST",
        path: "/api/admin/courses/{id}",
        config: {
            auth: {
                strategy: "jwt",
                scope: "admin"
            },
            handler: adminController.editCourse
        }
    },
    {
        // add an exam
        method: "POST",
        path: "/api/admin/exams",
        config: {
            auth: {
                strategy: "jwt",
                scope: "admin"
            },
            handler: adminController.addExam
        }
    },
    {
        // delete an exam
        method: "DELETE",
        path: "/api/admin/exams/{id}",
        config: {
            auth: {
                strategy: "jwt",
                scope: "admin"
            },
            handler: adminController.deleteExam
        }
    },
    {
        // edit an exam
        method: "POST",
        path: "/api/admin/exams/{id}",
        config: {
            auth: {
                strategy: "jwt",
                scope: "admin"
            },
            handler: adminController.editExam
        }
    },
    {
        // add a lesson
        method: "POST",
        path: "/api/admin/courses/{id}/lessons",
        config: {
            auth: {
                strategy: "jwt",
                scope: "admin"
            },
            handler: adminController.addLesson
        }
    },
    {
        // delete a lesson
        method: "DELETE",
        path: "/api/admin/courses/{id}/lessons/{index}",
        config: {
            auth: {
                strategy: "jwt",
                scope: "admin"
            },
            handler: adminController.deleteLesson
        }
    },
    {
        // edit a lesson
        method: "POST",
        path: "/api/admin/courses/{id}/lessons/{index}",
        config: {
            auth: {
                strategy: "jwt",
                scope: "admin"
            },
            handler: adminController.editLesson
        }
    },
    {
        // enroll user to to a course
        method: "GET",
        path: "/api/admin/enroll/{email}/{id}",
        config: {
            auth: {
                strategy: "jwt",
                scope: "admin"
            },
            handler: adminController.enroll
        }
    },
    {
        // upload a course logo
        method: "POST",
        path: "/api/admin/courses/{id}/logo",
        config: {
            auth: {
                strategy: "jwt",
                scope: "admin"
            },
            payload: {
                allow: "multipart/form-data",
                maxBytes: 100 * 1000 * 1000,
                output: "stream",
                parse: true
            },
            handler: adminController.uploadCourseLogo
        }
    },
    {
        method: "POST",
        path: "/api/admin/image",
        config: {
            // auth is false because the request is done from Froala editor
            auth: false,
            payload: {
                allow: "multipart/form-data",
                maxBytes: 100 * 1000 * 1000,
                output: "stream",
                parse: true
            }
        },
        handler: adminController.uploadImage
    },
    {
        // upload a course logo
        method: "POST",
        path: "/api/admin/courses/{courseId}/video/{lessonId}",
        config: {
            auth: {
                strategy: "jwt",
                scope: "admin"
            },
            payload: {
                allow: "multipart/form-data",
                maxBytes: 1000000000,
                output: "stream",
                parse: true
            },
            handler: adminController.uploadVideo
        }
    }
];
