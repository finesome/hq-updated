// auth routes
export const authRoutes = {
    getUser: () => `/api/users`,
    register: () => `/api/users/register`,
    login: () => `/api/users/login`,
    logout: () => `/api/users/logout`,
    edit: attribute => `/api/users/edit/${attribute}`,
};

// dashboard routes
export const dashboardRoutes = {
    getCategories: () => `/api/categories`,
    getExams: () => `/api/exams`,
    getCourses: () => `/api/courses`,
    getExam: id => `/api/exams/${id}`,
    getCourse: id => `/api/courses/${id}`,
    enroll: id => `/api/enroll/${id}`,
    answerExam: id => `/api/exams/${id}/answer`,
};

// admin routes
export const adminRoutes = {
    getSubjects: () => `/api/admin/subjects`,
    getCourses: () => `/api/admin/courses`,
    getExams: () => `/api/admin/exams`,
    getCourse: id => `/api/admin/courses/${id}`,
    getExam: id => `/api/admin/exams/${id}`,
    addSubject: () => `/api/admin/subjects`,
    deleteSubject: id => `/api/admin/subjects/${id}`,
    editSubject: id => `/api/admin/subjects/${id}`,
    addCourse: () => `/api/admin/courses`,
    deleteCourse: id => `/api/admin/courses/${id}`,
    editCourse: id => `/api/admin/courses/${id}`,
    addExam: () => `/api/admin/exams`,
    deleteExam: id => `/api/admin/exams/${id}`,
    editExam: id => `/api/admin/exams/${id}`,
    addLesson: id => `/api/admin/courses/${id}/lessons`,
    deleteLesson: (id, index) => `/api/admin/courses/${id}/lessons/${index}`,
    editLesson: (id, index) => `/api/admin/courses/${id}/lessons/${index}`,
    uploadCourseLogo: id => `/api/admin/courses/${id}/logo`,
    uploadVideo: (courseId, lessonId) => `/api/admin/courses/${courseId}/video/${lessonId}`,
};
