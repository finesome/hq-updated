// modules
import React, { Component } from "react";
import { connect } from "react-redux";
import axios from "axios";
import DocumentTitle from "react-document-title";
// assets
import { bold, header } from "assets/formatUtils";
import { adminRoutes } from "assets/routes";
// styles
import { Accordion, Button, Container, Image, Input, Loader, Progress, TextArea } from "semantic-ui-react";
// components
import Lesson from "./Lesson";
import PreviewDropzone from "./PreviewDropzone";
// redux
import { logout } from "store/User";

const loader = (
    <Loader active inline="centered" size="large">
        Загрузка курса
    </Loader>
);

const ThickDivider = () => <div style={{ marginBottom: "2em", height: 4, backgroundColor: "#23282d" }} />;

class Course extends Component {
    state = {
        activeIndex: 0,
        deleting: false,
        editing: false,
        loading: false,
        logo: null,
        percentCompleted: 0,
        uploadingLogo: false,
    };

    componentDidMount() {
        this.mounted = true;
        const id = this.props.match.params.id;
        this.getCourse(id);
    }

    componentWillUnmount() {
        this.mounted = false;
    }

    componentDidUpdate(prevProps, prevState) {
        const id = this.props.match.params.id;
        const prevId = prevProps.match.params.id;
        if (id !== prevId) {
            this.getCourse(id);
        }
    }

    getCourse = async id => {
        if (this.mounted) {
            this.setState({ loading: true });
        }
        // axios call
        const response = await axios.get(adminRoutes.getCourse(id)).catch(error => {
            console.error(error);
            if (this.mounted) {
                this.setState({ loading: false });
                this.props.logout();
            }
        });
        if (this.mounted && response) {
            this.setState({ loading: false, course: response.data.message });
        }
    };

    deleteCourse = () => {
        const r = window.confirm("Удалить этот курс?");
        if (r) {
            if (this.mounted) {
                this.setState({ deleting: true });
            }
            axios
                .delete(adminRoutes.deleteCourse(this.state.course._id))
                .then(() => {
                    if (this.mounted) {
                        this.setState({ deleting: false });
                    }
                    this.props.getCourses();
                    this.props.history.push("/admin");
                })
                .catch(error => {
                    if (this.mounted) {
                        this.setState({ deleting: false });
                    }
                    console.error(error);
                });
        }
    };

    editCourse = () => {
        const r = window.confirm("Редактировать этот курс?");
        if (r) {
            if (this.mounted) {
                this.setState({ editing: true });
            }
            axios
                .post(adminRoutes.editCourse(this.state.course._id), { course: this.state.course })
                .then(() => {
                    if (this.mounted) {
                        this.setState({ editing: false });
                    }
                    this.getCourse(this.state.course._id);
                })
                .catch(error => {
                    if (this.mounted) {
                        this.setState({ editing: false });
                    }
                    console.error(error);
                });
        }
    };

    handleAccordion = (e, data) => {
        const { index } = data;
        const { activeIndex } = this.state;
        const newIndex = activeIndex === index ? -1 : index;
        this.setState({ activeIndex: newIndex });
    };

    handleCourseChange = (e, data) => {
        this.setState(prevState => ({
            course: {
                ...prevState.course,
                [data.name]: data.value,
            },
        }));
    };

    handleDrop = file => {
        this.setState({ logo: file });
    };

    handleUploadLogo = () => {
        const { logo } = this.state;
        if (logo) {
            // request config
            const config = {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
                onUploadProgress: progressEvent => {
                    let percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                    this.setState({ percentCompleted: percentCompleted });
                },
            };
            // create a new form data
            const data = new FormData();
            // check file size
            if (logo.size > 20000000) {
                alert("Размер логотипа не может быть больше 20МБ");
                return;
            }
            data.append("file", logo, logo.name);
            this.setState({ uploadingLogo: true });
            // axios call
            axios
                .post(adminRoutes.uploadCourseLogo(this.state.course._id), data, config)
                .then(() => {
                    this.setState({ percentCompleted: 0, uploadingLogo: false });
                    alert("Логотип загружен; обновите страницу для того чтобы увидеть изменения");
                })
                .catch(error => {
                    this.setState({ percentCompleted: 0, uploadingLogo: false });
                    console.error("Error:", error.response);
                    alert("Ошибка на сервере");
                });
        }
    };

    render() {
        let course;
        let lessons = [];
        let name;
        let newLesson;

        if (this.state.course) {
            name = this.state.course.title;
            if (this.state.course.lessons && this.state.course.lessons.length !== 0) {
                for (let i = 0; i < this.state.course.lessons.length; i++) {
                    let lesson = (
                        <Lesson
                            getCourse={this.getCourse}
                            id={this.state.course._id}
                            index={i}
                            lesson={this.state.course.lessons[i]}
                        />
                    );
                    lessons.push({
                        key: `admin-course-${this.state.course._id}-lesson-${i}`,
                        title: `Урок ${i + 1} (${this.state.course.lessons[i].title})`,
                        content: {
                            content: lesson,
                        },
                    });
                }
            }
            newLesson = <Lesson getCourse={this.getCourse} id={this.state.course._id} />;
            course = (
                <div style={{ fontSize: "15px" }}>
                    {header(`Название курса: ${name}`, "22px", "bold")}
                    {bold("Название курса")}
                    <Input
                        fluid
                        name="title"
                        value={this.state.course.title || ""}
                        onChange={this.handleCourseChange}
                        style={{ marginBottom: "1em" }}
                    />
                    {bold("Описание курса")}
                    <TextArea
                        autoHeight
                        name="description"
                        value={this.state.course.description || ""}
                        onChange={this.handleCourseChange}
                        style={{ marginBottom: "1em", minHeight: 100, width: "100%" }}
                    />
                    {bold("Категория курса")}
                    <Input
                        fluid
                        name="category"
                        value={this.state.course.category || ""}
                        onChange={this.handleCourseChange}
                        style={{ marginBottom: "1em" }}
                    />
                    {bold("Загрузить логотип курса")}
                    <PreviewDropzone handleDrop={this.handleDrop} />
                    {this.state.uploadingLogo ? (
                        <div style={{ marginBottom: "1em" }}>
                            {bold("Прогресс")}
                            <Progress percent={this.state.percentCompleted} indicating progress />
                        </div>
                    ) : null}
                    {/* {bold("Ссылка на логотип курса")}
                    <TextArea
                        autoHeight
                        name="logo"
                        value={this.state.course.logo || ""}
                        onChange={this.handleCourseChange}
                        style={{ marginBottom: "1em", minHeight: 50, width: "100%" }}
                    /> */}
                    <Button primary onClick={this.handleUploadLogo} style={{ margin: "1em 0" }}>
                        Загрузить логотип
                    </Button>
                    {bold("Логотип курса")}
                    <Image alt="" src={this.state.course.logo || ""} size="small" style={{ marginBottom: "2em" }} />
                    <div style={{ marginBottom: "4em" }}>
                        <Button loading={this.state.editing} onClick={this.editCourse} positive size="large">
                            Редактировать курс
                        </Button>
                        <Button loading={this.state.deleting} negative onClick={this.deleteCourse} size="large">
                            Удалить курс
                        </Button>
                    </div>
                    <ThickDivider />
                    {header("Уроки данного курса", "20px", "bold")}
                    <Accordion fluid styled panels={lessons} style={{ marginBottom: "4em", padding: "8px" }} />
                    <ThickDivider />
                    {header("Добавить новый урок", "20px", "bold")}
                    {newLesson}
                </div>
            );
        }

        return (
            <DocumentTitle title={this.state.course ? this.state.course.title : "Курс"}>
                <Container>{this.state.loading ? loader : course}</Container>
            </DocumentTitle>
        );
    }
}

export default connect(
    store => ({}),
    {
        logout,
    }
)(Course);
