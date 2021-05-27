// modules
import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import axios from "axios";
import DocumentTitle from "react-document-title";
import FroalaEditorView from "react-froala-wysiwyg/FroalaEditorView";
import ReactHtmlParser from "react-html-parser";
// assets
import { dashboardRoutes } from "assets/routes";
// styles
import { Button, Container, Form, Grid, Icon, Loader, Message, Radio, Statistic } from "semantic-ui-react";
import "./index.css";
// components
// redux
import { logout } from "store/User";

class Exam extends Component {
    state = {
        id: "",
        loading: false,
        answered: false,
        answers: {},
        time: 3600,
    };

    tick = () => {
        this.setState(prevState => ({
            time: prevState.time - 1,
        }));
    };

    componentDidMount() {
        this.mounted = true;
        // get lesson
        let id = this.props.match.params.id;
        this.getExam(id);
    }

    componentWillUnmount() {
        this.mounted = false;
        clearTimeout(this.timer);
        clearInterval(this.interval);
    }

    getExam = async id => {
        this.setState({ id: id, loading: true });
        const response = await axios.get(dashboardRoutes.getExam(id)).catch(error => {
            this.setState({ loading: false });
            console.error(error);
            this.props.logout();
        });
        if (response) {
            if (!!response.data.message.answered) {
                this.setState({
                    // exam: response.data.message,
                    answered: true,
                    loading: false,
                    // time: response.data.message.time || 3600,
                });
                return;
            }
            // set countdown interval
            this.interval = setInterval(this.tick, 1000);
            // set timer
            this.timer = setTimeout(() => {
                alert("Время закончилось, мы отправим ваши ответы на сервер");
                this.handleAnswer();
            }, response.data.message.time * 1000);
            this.setState({ exam: response.data.message, loading: false, time: response.data.message.time || 3600 });
        }
    };

    handleChangeAnswer = (e, data) => {
        const { question, option } = data;
        let answers = { ...this.state.answers };
        answers[question] = option;
        this.setState({ answers: answers });
    };

    handleAnswer = () => {
        // clear timers
        clearTimeout(this.timer);
        clearInterval(this.interval);

        let payload = {
            examId: this.state.exam._id,
            subject: this.state.exam.subject,
            time: this.state.exam.time - this.state.time,
            questions: [],
        };

        let resultAnswers = [];
        let score = { correct: 0, total: this.state.exam.questions.length };

        for (let i = 0; i < this.state.exam.questions.length; i++) {
            let question = this.state.exam.questions[i];

            let correct = false;
            if (
                (!!this.state.answers[i] || this.state.answers[i] === 0) &&
                question.answer.includes(JSON.stringify(this.state.answers[i]))
            ) {
                correct = true;
            }

            payload.questions.push({
                questionId: question._id,
                question: question.question,
                topic: question.topic,
                subtopic: question.subtopic,
                userAnswer: !!this.state.answers[i] || this.state.answers[i] === 0 ? this.state.answers[i] : "",
                correct: correct,
            });
            resultAnswers.push({
                questionId: question._id,
                topic: question.topic,
                subtopic: question.subtopic,
                userAnswer: !!this.state.answers[i] || this.state.answers[i] === 0 ? this.state.answers[i] : "",
                correctAnswer: question.answer[0],
                correct: correct,
            });
        }
        score.correct = resultAnswers.filter(x => x.correct).length;

        axios
            .post(dashboardRoutes.answerExam(this.state.exam._id), { exam: payload })
            .then(() => {
                alert("Ваши ответы сохранены и отправлены на сервер");
                this.setState({ answered: true, score: score, resultAnswers: resultAnswers });
            })
            .catch(error => {
                console.error(error);
            });
    };

    render() {
        const { answers } = this.state;
        let title;
        let questions = [];
        if (this.state.exam) {
            title = this.state.exam.title;
            if (this.state.exam.questions && this.state.exam.questions.length !== 0) {
                for (let i = 0; i < this.state.exam.questions.length; i++) {
                    let question = this.state.exam.questions[i];
                    let options = [];

                    // resultAnswers.push({
                    //     questionId: question._id,
                    //     topic: question.topic,
                    //     subtopic: question.subtopic,
                    //     userAnswer: !!this.state.answers[i] || this.state.answers[i] === 0 ? this.state.answers[i] : "",
                    //     correctAnswer: question.answer[0],
                    //     correct: correct,
                    // });

                    for (let j = 0; j < question.options.length; j++) {
                        if (this.state.answered && this.state.resultAnswers && this.state.resultAnswers.length !== 0) {
                            if (j === Number(this.state.resultAnswers[i].correctAnswer)) {
                                options.push(
                                    <Form.Field
                                        key={`dashboard-exam-${this.state.exam._id || ""}-question-${i}-option-${j}`}
                                        style={{ padding: 8 }}>
                                        <div style={{ display: "flex" }}>
                                            <Radio
                                                checked={answers[i] === j ? true : false}
                                                label={ReactHtmlParser(question.options[j])}
                                                question={i}
                                                option={j}
                                                onChange={this.handleChangeAnswer}
                                            />
                                            <span style={{ marginLeft: 8, color: "green" }}>(правильный ответ)</span>
                                        </div>
                                    </Form.Field>
                                );
                            } else {
                                options.push(
                                    <Form.Field
                                        key={`dashboard-exam-${this.state.exam._id || ""}-question-${i}-option-${j}`}
                                        style={{ padding: 8 }}>
                                        <div style={{ display: "flex" }}>
                                            <Radio
                                                checked={answers[i] === j ? true : false}
                                                label={ReactHtmlParser(question.options[j])}
                                                question={i}
                                                option={j}
                                                onChange={this.handleChangeAnswer}
                                            />
                                        </div>
                                    </Form.Field>
                                );
                            }
                        } else {
                            options.push(
                                <Form.Field
                                    key={`dashboard-exam-${this.state.exam._id || ""}-question-${i}-option-${j}`}
                                    style={{ padding: 8 }}>
                                    <div style={{ display: "flex" }}>
                                        <Radio
                                            checked={answers[i] === j ? true : false}
                                            label={ReactHtmlParser(question.options[j])}
                                            question={i}
                                            option={j}
                                            onChange={this.handleChangeAnswer}
                                        />
                                    </div>
                                </Form.Field>
                            );
                        }
                    }
                    let questionText;
                    if (
                        this.state.answered &&
                        this.state.resultAnswers &&
                        this.state.resultAnswers.length !== 0 &&
                        !this.state.resultAnswers[i].correct
                    ) {
                        questionText = (
                            <div style={{ marginBottom: 16 }}>
                                <br />
                                <div style={{ color: "red" }}>Вы ответили неправильно.</div>
                                <div> Топик вопроса: {this.state.resultAnswers[i].topic}</div>
                                {this.state.resultAnswers[i].subtopic ? (
                                    <div>Сабтопик: {this.state.resultAnswers[i].subtopic}</div>
                                ) : null}
                            </div>
                        );
                    }
                    if (
                        this.state.answered &&
                        this.state.resultAnswers &&
                        this.state.resultAnswers.length !== 0 &&
                        this.state.resultAnswers[i].correct
                    ) {
                        questionText = (
                            <div style={{ marginBottom: 16 }}>
                                <br />
                                <div style={{ color: "green" }}>Вы ответили правильно.</div>
                                <div> Топик вопроса: {this.state.resultAnswers[i].topic}</div>
                                {this.state.resultAnswers[i].subtopic ? (
                                    <div>Сабтопик: {this.state.resultAnswers[i].subtopic}</div>
                                ) : null}
                            </div>
                        );
                    }
                    questions.push(
                        <div key={`dashboard-exam-question-${i}`} style={{ marginBottom: "1em" }}>
                            <div className="dashboard-exam-question-header">
                                <b>Вопрос {i + 1}</b>
                            </div>
                            <FroalaEditorView model={question.question || ""} />
                            {questionText}
                            {options}
                        </div>
                    );
                }
            }
        }

        return (
            <DocumentTitle title={this.state.exam ? this.state.exam.title : `Пробный экзамен`}>
                <div className="dashboard-exam-wrapper">
                    {this.state.loading ? (
                        <Loader active size="large" />
                    ) : (
                        <Grid className="dashboard-exam-grid" divided>
                            <Grid.Row centered>
                                <div className="dashboard-exam-content-header">{title}</div>
                            </Grid.Row>
                            <Grid.Row>
                                <Container>
                                    <Statistic floated="right" size="tiny">
                                        <Statistic.Value>{this.state.time % 60}</Statistic.Value>
                                        <Statistic.Label>секунд</Statistic.Label>
                                    </Statistic>
                                    <Statistic floated="right" size="tiny">
                                        <Statistic.Value>{Math.floor(this.state.time / 60)}</Statistic.Value>
                                        <Statistic.Label>минут</Statistic.Label>
                                    </Statistic>
                                </Container>
                                {this.state.answered ? (
                                    <Message icon positive>
                                        <Icon name="pencil alternate" />
                                        <Message.Content>
                                            <Message.Header>Пробный экзамен</Message.Header>
                                            Вы закончили этот пробный экзамен. Ваши ответы сохранены и отображаются в профиле
                                        </Message.Content>
                                    </Message>
                                ) : null}
                                <div className="dashboard-exam-content">{questions}</div>
                            </Grid.Row>
                            {this.state.exam && this.state.answered && this.state.score ? (
                                <Grid.Row style={{ marginBottom: "1em" }}>
                                    <div className="dashboard-exam-score">
                                        <span style={{ marginRight: "16px" }}>Ваш результат: </span>
                                        <Statistic size="mini">
                                            <Statistic.Value>
                                                {this.state.score.correct} / {this.state.score.total}
                                            </Statistic.Value>
                                        </Statistic>
                                    </div>
                                </Grid.Row>
                            ) : null}
                            <Grid.Row style={{ marginBottom: "1em" }}>
                                <Button
                                    disabled={this.state.answered}
                                    floated="right"
                                    primary
                                    size="large"
                                    onClick={this.handleAnswer}>
                                    Ответить
                                </Button>
                            </Grid.Row>
                        </Grid>
                    )}
                </div>
            </DocumentTitle>
        );
    }
}

export default withRouter(
    connect(
        store => ({}),
        {
            logout,
        }
    )(Exam)
);
