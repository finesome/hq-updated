// modules
import React, { Component } from "react";
import { connect } from "react-redux";
import DocumentTitle from "react-document-title";
import axios from "axios";
import FroalaEditorView from "react-froala-wysiwyg/FroalaEditorView";
// assets
import { bold, property, time } from "assets/formatUtils";
import { authRoutes, dashboardRoutes } from "assets/routes";
// styles
import { Accordion, Container, List, Loader, Segment } from "semantic-ui-react";
import "./index.css";
// components
// redux
import { logout } from "store/User";

const SpacedDiv = props => (
    <div
        style={{
            padding: 8,
        }}>
        {props.children}
    </div>
);

class Profile extends Component {
    state = {
        activeIndex: -1,
        loading: false,
        user: {},
    };

    componentDidMount() {
        this.mounted = true;
        this.getUser();
    }

    componentWillUnmount() {
        this.mounted = false;
    }

    handleAccordion = (e, itemProps) => {
        const { index } = itemProps;
        const { activeIndex } = this.state;
        const newIndex = activeIndex === index ? -1 : index;
        if (newIndex !== -1) {
            const { user } = this.state;
            if (user && user.exams && user.exams.length !== 0 && user.exams[newIndex]) {
                this.getExam(user.exams[newIndex].examId);
            }
        }
        this.setState({ activeIndex: newIndex });
    };

    getExam = async id => {
        this.setState({ id: id, loading: true });
        const response = await axios.get(dashboardRoutes.getExam(id)).catch(error => {
            this.setState({ loading: false });
            console.error(error);
            // this.props.logout();
        });
        if (response) {
            // console.log(response.data.message);
            this.setState({ loading: false, exam: response.data.message });
        }
    };

    getUser = async () => {
        this.setState({ loading: true });
        const response = await axios.get(authRoutes.getUser()).catch(error => {
            this.setState({ loading: false });
            console.error(error);
            this.props.logout();
        });
        if (response) {
            // console.log(response.data.message);
            this.setState({ loading: false, user: response.data.message });
        }
    };

    render() {
        let that = this;
        const { loading } = this.state;
        let exams = [];
        if (this.state.user) {
            if (this.state.user.exams && this.state.user.exams.length !== 0) {
                for (let i = 0; i < this.state.user.exams.length; i++) {
                    const exam = this.state.user.exams[i];
                    let questions = exam.questions.map((question, j) => (
                        <List.Item key={`dashboard-profile-exam-panel-${i}-question-${j}`}>
                            <Segment className="dashboard-profile-question" raised>
                                <FroalaEditorView model={question.question} />
                                <br />
                                <div>{property("Топик вопроса", question.topic)}</div>
                                {question.subtopic ? <div>{property("Сабтопик", question.subtopic)}</div> : null}
                                <div>{bold("Варианты ответа:")}</div>
                                <List ordered>
                                    {that.state.exam && this.state.exam.questions && this.state.exam.questions.length !== 0
                                        ? that.state.exam.questions[j].options.map((option, k) => (
                                              <List.Item key={`dashboard-profile-exam-panel-${i}-question-${j}-option-${k}`}>
                                                  <FroalaEditorView model={option} />
                                              </List.Item>
                                          ))
                                        : null}
                                </List>
                                <div>{property("Выбранный вариант ответа", Number(question.userAnswer) + 1)}</div>
                                {that.state.exam && that.state.exam.questions && that.state.exam.questions.length !== 0 ? (
                                    <div>
                                        {property(
                                            "Правильный вариант ответа",
                                            Number(that.state.exam.questions[j].answer[0]) + 1
                                        )}
                                    </div>
                                ) : null}
                                <div>{property("Правильно", question.correct ? "да" : "нет")}</div>
                            </Segment>
                        </List.Item>
                    ));
                    exams.push({
                        key: `dashboard-profile-exam-panel-${i}`,
                        title: `Предмет: ${exam.subject}`,
                        content: {
                            content: (
                                <Container>
                                    {loading ? (
                                        <Loader active inline="centered" size="large" />
                                    ) : (
                                        <div>
                                            {this.state.exam ? (
                                                <SpacedDiv>{property("Название", this.state.exam.title)}</SpacedDiv>
                                            ) : null}
                                            <SpacedDiv>
                                                {property("Время за которое вы завершили экзамен", time(exam.time))}
                                            </SpacedDiv>
                                            <SpacedDiv>{bold("Вопросы:")}</SpacedDiv>
                                            {this.state.exam ? (
                                                <List>{questions}</List>
                                            ) : (
                                                <div>Вопросы не удалось загрузить; возможно экзамен удален</div>
                                            )}
                                        </div>
                                    )}
                                </Container>
                            ),
                        },
                    });
                }
            }
        }

        return (
            <DocumentTitle title="Профиль пользователя">
                <div className="dashboard-profile-wrapper">
                    <div className="dashboard-profile-header">Мой профиль</div>
                    <div className="dashboard-profile-subheader">Пройденные пробные экзамены</div>
                    <Accordion fluid styled panels={exams} onTitleClick={this.handleAccordion} />
                </div>
            </DocumentTitle>
        );
    }
}

export default connect(
    null,
    {
        logout,
    }
)(Profile);
