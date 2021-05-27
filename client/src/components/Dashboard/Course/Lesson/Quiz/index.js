// modules
import React, { Component } from "react";
import ReactHtmlParser from "react-html-parser";
import FroalaEditorView from "react-froala-wysiwyg/FroalaEditorView";
// import axios from "axios";
// assets
// import { dashboardRoutes } from "assets/routes";
// styles
import { Button, Form, Radio } from "semantic-ui-react";
import "./index.css";
// components
// redux

class Quiz extends Component {
    state = {
        questions: this.props.quiz ? JSON.parse(this.props.quiz) : [],
        answers: [],
        correct: 0,
    };

    componentDidUpdate(prevProps) {
        if (prevProps !== this.props) {
            this.setState({ questions: this.props.quiz ? JSON.parse(this.props.quiz) : [], answers: [] });
        }
    }

    handleChangeAnswer = (e, data) => {
        const { question, option } = data;
        let questions = [...this.state.questions];
        const q = questions[question];

        if (q.userAnswer !== undefined || q.userAnswer !== option) {
            questions[question]["userAnswer"] = option;
            this.setState({
                questions: questions,
            });
        }

        // if (checked) {
        //     if (answers.some(x => x.question === question)) {
        //         let index = answers.findIndex(x => x.question === question);
        //         if (!answers[index].answers.some(x => x === option)) {
        //             answers[index].answers.push(option);
        //         }
        //     } else {
        //         answers.push({
        //             question: question,
        //             answers: [option],
        //         });
        //     }
        // } else {
        //     if (answers.some(x => x.question === question)) {
        //         let index = answers.findIndex(x => x.question === question);
        //         if (answers[index].answers.some(x => x === option)) {
        //             answers[index].answers = answers[index].answers.filter(x => x !== option);
        //         }
        //     }
        // }
        // this.setState({ answers: answers });
    };

    handleAnswer = () => {
        let questions = [...this.state.questions];
        for (let i = 0; i < questions.length; i++) {
            if (questions[i].userAnswer !== undefined) {
                // answered
                let correct = false;
                if (questions[i].answer.includes(questions[i].userAnswer)) {
                    correct = true;
                }
                questions[i].correct = correct;
            } else {
                // not answered
                questions[i].correct = false;
            }
        }
        this.setState({ questions: questions });
    };

    render() {
        let questions = [];
        for (let i = 0; i < this.state.questions.length; i++) {
            let question = this.state.questions[i];
            let options = [];
            for (let j = 0; j < question.options.length; j++) {
                options.push(
                    <div
                        className="dashboard-course-lesson-quiz-content-form-field"
                        key={`dashboard-course-lesson-quiz-question-${i}-option-${j}`}>
                        <Form.Field style={{ padding: 4 }}>
                            <div style={{ display: "flex", marginBottom: 8 }}>
                                <Radio
                                    checked={question.userAnswer !== undefined && question.userAnswer === j}
                                    question={i}
                                    option={j}
                                    label={ReactHtmlParser(question.options[j])}
                                    onChange={this.handleChangeAnswer}
                                />
                                {question.correct !== undefined && question.answer.includes(j) ? (
                                    <span style={{ marginLeft: 8, color: "green" }}>(правильный ответ)</span>
                                ) : null}
                            </div>
                        </Form.Field>
                    </div>
                );
            }
            questions.push(
                <div key={`dashboard-course-lesson-quiz-${i}`}>
                    <div className="dashboard-course-lesson-quiz-content-question">
                        <b>Вопрос {i + 1}.</b>
                    </div>
                    <FroalaEditorView model={question.question || ""} />

                    <div className="dashboard-course-lesson-quiz-content-form">
                        <Form>
                            {options}
                            {question.correct !== undefined ? (
                                question.correct === true ? (
                                    <div className="dashboard-course-lesson-quiz-content-form-correct">Правильный ответ</div>
                                ) : (
                                    <div className="dashboard-course-lesson-quiz-content-form-wrong">Неправильный ответ</div>
                                )
                            ) : null}
                        </Form>
                    </div>
                </div>
            );
        }

        return (
            <div className="dashboard-course-lesson-quiz-content">
                {this.state.questions.length !== 0 ? (
                    <div>
                        {questions}
                        <Button primary onClick={this.handleAnswer}>
                            Ответить на quiz
                        </Button>
                    </div>
                ) : (
                    <div style={{ textAlign: "center" }}>В этом уроке нет quiz'а</div>
                )}
            </div>
        );
    }
}

export default Quiz;
