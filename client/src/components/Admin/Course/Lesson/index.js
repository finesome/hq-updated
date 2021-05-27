// modules
import React, { Component } from "react";
import { connect } from "react-redux";
import axios from "axios";
// assets
import { bold } from "assets/formatUtils";
import { adminRoutes } from "assets/routes";
// styles
import { Button, Checkbox, Input, Segment, TextArea } from "semantic-ui-react";
// components
import Lecture from "./Lecture";
import Video from "./Video";
import Quiz from "./Quiz";
// redux
import { logout } from "store/User";

class Lesson extends Component {
    state = this.props.lesson
        ? this.props.lesson
        : {
              title: "",
              description: "",
              free: false,
              lecture: "",
              quiz: "",
              video: "",
          };

    addLesson = () => {
        const r = window.confirm("Добавить этот урок?");
        if (r) {
            // check few conditions
            for (let i = 0; i < this.quiz.state.questions.length; i++) {
                if (this.quiz.state.questions[i].answer.length === 0) {
                    alert("Где-то не отмечен правильный вариант ответа");
                    return;
                }
            }
            if (!this.state.title) {
                alert("Не введено название урока");
                return;
            }
            // build payload
            const payload = {
                lesson: {
                    title: this.state.title,
                    description: this.state.description,
                    free: this.state.free,
                    lecture: this.lecture.state.model,
                    quiz: JSON.stringify(this.quiz.state.questions),
                    video: this.video.state.video,
                },
            };
            // axios call
            axios
                .post(adminRoutes.addLesson(this.props.id), payload)
                .then(() => {
                    this.props.getCourse(this.props.id);
                })
                .catch(error => {
                    console.error(error);
                    this.props.logout();
                });
        }
    };

    editLesson = () => {
        const r = window.confirm("Редактировать этот урок?");
        if (r) {
            // check few conditions
            for (let i = 0; i < this.quiz.state.questions.length; i++) {
                if (this.quiz.state.questions[i].answer.length === 0) {
                    alert("Где-то не отмечен правильный вариант ответа");
                    return;
                }
            }
            if (!this.state.title) {
                alert("Не введено название урока");
                return;
            }
            // build payload
            const payload = {
                lesson: {
                    title: this.state.title,
                    description: this.state.description,
                    free: this.state.free,
                    lecture: this.lecture.state.model,
                    quiz: JSON.stringify(this.quiz.state.questions),
                    video: this.video.state.video,
                },
            };
            // axios call
            axios
                .post(adminRoutes.editLesson(this.props.id, this.props.index), payload)
                .then(() => {
                    this.props.getCourse(this.props.id);
                })
                .catch(error => {
                    console.error(error);
                    this.props.logout();
                });
        }
    };

    deleteLesson = () => {
        const r = window.confirm("Удалить этот урок?");
        if (r) {
            // axios call
            axios
                .delete(adminRoutes.deleteLesson(this.props.id, this.props.index))
                .then(() => {
                    this.props.getCourse(this.props.id);
                })
                .catch(error => {
                    console.error(error);
                    this.props.logout();
                });
        }
    };

    handleChange = (e, data) => {
        let result = data.value;
        if (data.name === "free") {
            result = data.checked;
        }
        this.setState({
            [data.name]: result,
        });
    };

    render() {
        const { _id, title, description, free, lecture, quiz, video } = this.state;

        return (
            <div>
                <Segment color="grey" raised padded>
                    {bold("Название урока")}
                    <Input
                        fluid
                        name="title"
                        value={title}
                        onChange={this.handleChange}
                        required
                        style={{ marginBottom: "1em" }}
                    />
                    {bold("Описание урока")}
                    <TextArea
                        autoHeight
                        name="description"
                        value={description}
                        onChange={this.handleChange}
                        style={{ marginBottom: "1em", minHeight: 100, width: "100%" }}
                    />
                    {bold("Сделать урок бесплатным?")}
                    <Checkbox checked={free} name="free" onChange={this.handleChange} />
                </Segment>
                <Segment color="grey" raised padded>
                    <Lecture
                        ref={instance => {
                            this.lecture = instance;
                        }}
                        lecture={lecture}
                    />
                </Segment>
                <Segment color="grey" raised padded>
                    <Quiz
                        ref={instance => {
                            this.quiz = instance;
                        }}
                        quiz={quiz}
                    />
                </Segment>
                <Segment color="grey" raised padded>
                    <Video
                        ref={instance => {
                            this.video = instance;
                        }}
                        courseId={this.props.id}
                        lessonId={_id}
                        video={video}
                    />
                </Segment>
                {_id ? (
                    <div style={{ marginTop: "1em" }}>
                        <Button primary onClick={this.editLesson}>
                            Редактировать урок
                        </Button>
                        <Button negative onClick={this.deleteLesson}>
                            Удалить урок
                        </Button>
                    </div>
                ) : (
                    <Button positive size="large" onClick={this.addLesson}>
                        Добавить урок
                    </Button>
                )}
            </div>
        );
    }
}

export default connect(
    store => ({}),
    {
        logout,
    }
)(Lesson);
