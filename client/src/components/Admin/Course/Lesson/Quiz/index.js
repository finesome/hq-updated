// modules
import React, { Component } from "react";
import FroalaEditor from "react-froala-wysiwyg";
import ReactHtmlParser from "react-html-parser";
// assets
import { header } from "assets/formatUtils";
import "froala-editor/js/froala_editor.pkgd.min.js";
import "froala-editor/js/plugins/image.min.js";
// styles
import { Accordion, Button, Form, Message, Radio } from "semantic-ui-react";
import "froala-editor/css/froala_style.min.css";
import "froala-editor/css/froala_editor.pkgd.min.css";
import "font-awesome/css/font-awesome.css";
// components
import EditorComponent from "./EditorComponent";
import EditorModal from "./EditorModal";
// redux

class Quiz extends Component {
    constructor(props) {
        super(props);
        this.state = {
            activeIndex: -1,
            questions: this.props.quiz ? JSON.parse(this.props.quiz) : [],
            newQuestion: "",
            newOption: "",
            showEditorModal: false,
            editorModel: {},
        };
    }

    showEditorModal = (question, option, model) => {
        this.setState({
            showEditorModal: true,
            editorModel: {
                question: question,
                option: option,
                model: model,
            },
        });
    };

    closeEditorModal = () => {
        this.setState({ showEditorModal: false, editorModel: {} });
    };

    shouldComponentUpdate(nextProps, nextState) {
        if (this.props !== nextProps) {
            return false;
        }
        return true;
    }

    handleAccordion = (e, itemProps) => {
        const { index } = itemProps;
        const { activeIndex } = this.state;
        const newIndex = activeIndex === index ? -1 : index;
        this.setState({ activeIndex: newIndex });
    };

    handleQuestionChange = (question, model) => {
        let questions = [...this.state.questions];
        questions[question].question = model;
        this.setState({ questions: questions }, () => {
            alert("Текст вопроса изменен, чтобы сохранить изменения не забудьте нажать на Редактировать экзамен");
        });
    };

    handleOptionChange = (question, option, model) => {
        let questions = [...this.state.questions];
        questions[question].options[option] = model;
        this.setState({
            showEditorModal: false,
            editorModel: {},
            questions: questions,
        });
    };

    handleNewQuestionChange = model => {
        this.setState({
            newQuestion: model,
        });
    };

    handleNewOptionChange = model => {
        this.setState({
            newOption: model,
        });
    };

    handleChangeAnswer = (e, data) => {
        const { question, option } = data;
        let questions = [...this.state.questions];
        const q = questions[question];
        if (!q.answer.includes(option)) {
            questions[question].answer = [option];
            this.setState({
                questions: questions,
            });
        }
    };

    addNewOption = (question, model) => {
        let questions = [...this.state.questions];
        questions[question].options.push(model);
        this.setState({
            newOption: "",
            questions: questions,
        });
    };

    deleteOption = (question, option) => {
        let questions = [...this.state.questions];
        questions[question].options.splice(option, 1);
        this.setState({
            questions: questions,
        });
    };

    addQuestion = () => {
        let questions = [...this.state.questions];
        questions.push({
            question: this.state.newQuestion,
            options: [],
            answer: [],
        });
        this.setState({
            activeIndex: questions.length - 1,
            newQuestion: "",
            questions: questions,
        });
    };

    deleteQuestion = index => {
        let questions = [...this.state.questions];
        questions.splice(index, 1);
        this.setState({
            activeIndex: -1,
            questions: questions,
        });
    };

    render() {
        const { activeIndex, newQuestion, newOption, questions } = this.state;
        let panels = [];
        // loop over questions
        for (let i = 0; i < questions.length; i++) {
            // loop over options within a question
            let options = [];
            for (let j = 0; j < questions[i].options.length; j++) {
                options.push(
                    <Form.Field key={`admin-course-quiz-lesson-question-${i}-option-${j}`} style={{ padding: 4 }}>
                        <div style={{ display: "flex", marginBottom: 8 }}>
                            <Radio
                                checked={questions[i].answer.includes(j.toString()) || questions[i].answer.includes(j)}
                                label={ReactHtmlParser(questions[i].options[j])}
                                question={i}
                                option={j}
                                onChange={this.handleChangeAnswer}
                            />
                        </div>
                        <Button primary size="tiny" onClick={() => this.showEditorModal(i, j, questions[i].options[j])}>
                            Редактировать вариант ответа
                        </Button>
                        <Button size="tiny" onClick={() => this.deleteOption(i, j)}>
                            Удалить вариант ответа
                        </Button>
                    </Form.Field>
                );
            }
            // push a question
            panels.push({
                key: `admin-course-quiz-lesson-question-${i}`,
                title: `Вопрос ${i + 1}`,
                content: {
                    content: (
                        <div>
                            <Message
                                icon="hand point up"
                                info
                                header="Редактирование вопроса"
                                content="Чтобы отредактировать вопрос, внесите необходимые изменения и нажмите Редактировать текст вопроса"
                            />
                            {activeIndex === i ? (
                                <EditorComponent
                                    model={questions[i].question}
                                    question={i}
                                    onEdit={this.handleQuestionChange}
                                    onDelete={this.deleteQuestion}
                                />
                            ) : null}
                            {header("Варианты ответа", 16, 400)}
                            <Form style={{ marginBottom: "2em" }}>{options}</Form>
                            {header("Новый вариант ответа", 16, 400)}
                            {activeIndex === i ? (
                                <FroalaEditor
                                    config={{
                                        placeholderText: "Поле для нового варианта ответа",
                                        imageUploadURL: "/api/admin/image",
                                        imageUploadMethod: "POST",
                                        events: {
                                            "froalaEditor.image.error": (e, editor, error) => {
                                                console.log(error);
                                            },
                                        },
                                    }}
                                    tag="textarea"
                                    model={newOption}
                                    onModelChange={this.handleNewOptionChange}
                                />
                            ) : null}
                            <Button
                                positive
                                size="small"
                                icon="plus"
                                labelPosition="right"
                                content="Добавить новый вариант ответа"
                                onClick={() => this.addNewOption(i, newOption)}
                                style={{ marginTop: "1em" }}
                            />
                        </div>
                    ),
                },
            });
        }

        return (
            <div>
                <EditorModal
                    open={this.state.showEditorModal}
                    question={this.state.editorModel.question}
                    option={this.state.editorModel.option}
                    model={this.state.editorModel.model}
                    onClose={this.closeEditorModal}
                    onEdit={this.handleOptionChange}
                />
                {header("Quiz", 20, "bold")}
                <Message
                    icon="hand point up"
                    info
                    header="Выбор правильного варианта (или вариантов) ответа"
                    content="Отмечать правильные варианты ответа можно в самом вопросе - просто нажмите на правильные варианты ответа"
                />
                {/* questions */}
                {header("Вопросы", 18, 400)}
                <Accordion
                    activeIndex={activeIndex}
                    fluid
                    styled
                    panels={panels}
                    style={{ marginBottom: "2em", padding: "1em" }}
                    onTitleClick={this.handleAccordion}
                />
                {/* new question */}
                {header("Новый вопрос", 18, 400)}
                <FroalaEditor
                    config={{
                        placeholderText: "Поле для нового вопроса",
                        imageUploadURL: "/api/admin/image",
                        imageUploadMethod: "POST",
                        events: {
                            "froalaEditor.image.error": (e, editor, error) => {
                                console.log(error);
                            },
                        },
                    }}
                    tag="textarea"
                    model={newQuestion}
                    onModelChange={this.handleNewQuestionChange}
                />
                <Button positive onClick={this.addQuestion} style={{ marginTop: "1em" }}>
                    Добавить вопрос
                </Button>
            </div>
        );
    }
}

export default Quiz;
