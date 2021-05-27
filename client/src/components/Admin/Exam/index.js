// modules
import React, { Component } from "react";
import { connect } from "react-redux";
import axios from "axios";
import DocumentTitle from "react-document-title";
import FroalaEditor from "react-froala-wysiwyg";
import ReactHtmlParser from "react-html-parser";
// assets
import { bold, header } from "assets/formatUtils";
import { adminRoutes } from "assets/routes";
import "froala-editor/js/froala_editor.pkgd.min.js";
import "froala-editor/js/plugins/image.min.js";
// styles
import {
    Accordion,
    Button,
    Checkbox,
    Container,
    Dropdown,
    Form,
    Icon,
    Input,
    Loader,
    Message,
    Radio,
    TextArea
} from "semantic-ui-react";
import "froala-editor/css/froala_style.min.css";
import "froala-editor/css/froala_editor.pkgd.min.css";
import "font-awesome/css/font-awesome.css";
// components
import EditorComponent from "../Course/Lesson/Quiz/EditorComponent";
import EditorModal from "../Course/Lesson/Quiz/EditorModal";
// redux
import { logout } from "store/User";

const loader = (
    <Loader active inline="centered" size="large">
        Загрузка экзамена
    </Loader>
);

class Exam extends Component {
    state = {
        deleting: false,
        editing: false,
        loading: false,
        subjects: [],
        subjectOptions: [],
        topicOptions: [],
        subtopicOptions: [],
        activeIndex: -1,
        newQuestion: "",
        newOption: "",
        showEditorModal: false,
        editorModel: {}
    };

    componentDidMount() {
        this.mounted = true;
        const id = this.props.match.params.id;
        this.getExam(id);
        this.getSubjects();
    }

    componentWillUnmount() {
        this.mounted = false;
    }

    componentDidUpdate(prevProps, prevState) {
        const id = this.props.match.params.id;
        const prevId = prevProps.match.params.id;
        if (id !== prevId) {
            this.getExam(id);
        }
    }

    getSubjects = async () => {
        this.setState({ loading: true });
        // axios call
        const response = await axios.get(adminRoutes.getSubjects()).catch(() => {
            if (this.mounted) {
                this.setState({ loading: false });
                this.props.logout();
            }
        });
        // set subjects
        if (this.mounted && response) {
            let topicOptions = [];
            if (this.state.exam && this.state.exam.subject) {
                let index = response.data.message.findIndex(x => x.name === this.state.exam.subject);
                if (index !== -1) {
                    topicOptions = response.data.message[index].topics.map((topic, index) => ({
                        text: topic.name,
                        value: topic.name
                    }));
                }
            }
            let options = response.data.message.map((subject, index) => ({
                text: subject.name,
                value: subject.name
            }));
            this.setState({
                loading: false,
                subjects: response.data.message,
                subjectOptions: options,
                topicOptions: topicOptions
            });
        }
    };

    getExam = async id => {
        if (this.mounted) {
            this.setState({ loading: true });
        }
        // axios call
        const response = await axios.get(adminRoutes.getExam(id)).catch(error => {
            console.error(error);
            if (this.mounted) {
                this.setState({ loading: false });
                this.props.logout();
            }
        });
        if (this.mounted && response) {
            this.setState({ loading: false, exam: response.data.message, activeIndex: -1 }, () => {
                console.log(response.data.message);
                this.getSubjects();
            });
        }
    };

    deleteExam = () => {
        const r = window.confirm("Удалить этот экзамен?");
        if (r) {
            if (this.mounted) {
                this.setState({ deleting: true });
            }
            axios
                .delete(adminRoutes.deleteExam(this.state.exam._id))
                .then(() => {
                    if (this.mounted) {
                        this.setState({ deleting: false });
                    }
                    this.props.getExams();
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

    editExam = () => {
        const r = window.confirm("Редактировать этот экзамен?");
        if (r) {
            if (this.state.exam.questions.some(x => x.answer.length === 0)) {
                alert("Где-то не выбран правильный вариант ответа");
                return;
            }
            if (this.mounted) {
                this.setState({ editing: true });
            }
            console.log("Editing exam:", this.state.exam);
            axios
                .post(adminRoutes.editExam(this.state.exam._id), {
                    exam: {
                        title: this.state.exam.title || "",
                        hidden: this.state.exam.hidden || false,
                        paid: this.state.exam.paid || false,
                        price: this.state.exam.price || 1000,
                        description: this.state.exam.description || "",
                        subject: this.state.exam.subject || "",
                        time: this.state.exam.time || 3600,
                        questions: this.state.exam.questions || []
                    }
                })
                .then(() => {
                    if (this.mounted) {
                        this.setState({ editing: false });
                    }
                    this.getExam(this.state.exam._id);
                    this.props.getExams();
                })
                .catch(error => {
                    if (this.mounted) {
                        this.setState({ editing: false });
                    }
                    console.error(error);
                });
        }
    };

    handleExamChange = (e, data) => {
        let result = data.value;
        if (data.name === "subject") {
            let topicOptions = [];
            if (this.state.subjects && this.state.subjects.length !== 0) {
                let index = this.state.subjects.findIndex(x => x.name === result);
                if (index !== -1) {
                    topicOptions = this.state.subjects[index].topics.map((topic, index) => ({
                        text: topic.name,
                        value: topic.name
                    }));
                }
            }
            this.setState({ topicOptions: topicOptions });
        }
        if (data.name === "hidden" || data.name === "paid") {
            result = data.checked;
        }
        this.setState(prevState => ({
            exam: {
                ...prevState.exam,
                [data.name]: result
            }
        }));
    };

    handleTopicSubtopicChange = (e, data) => {
        let questions = [];
        if (this.state.exam.questions) {
            questions = [...this.state.exam.questions];
        }
        questions[data.question][data.name] = data.value;

        if (data.name === "topic") {
            // change subtopic options
            let subtopicOptions = [];
            if (this.state.subjects && this.state.subjects.length !== 0) {
                let outerIndex = this.state.subjects.findIndex(x => x.name === this.state.exam.subject);
                if (outerIndex !== -1) {
                    let innerIndex = this.state.subjects[outerIndex].topics.findIndex(x => x.name === data.value);
                    if (innerIndex !== -1) {
                        subtopicOptions = this.state.subjects[outerIndex].topics[innerIndex].subtopics.map(
                            (subtopic, index) => ({
                                key: `dropdown-question-${data.question}-topic-${innerIndex}-subtopic-${index}`,
                                text: subtopic,
                                value: subtopic
                            })
                        );
                    }
                }
            }
            this.setState({ subtopicOptions: subtopicOptions });
        }

        this.setState(prevState => ({
            exam: {
                ...prevState.exam,
                questions: questions
            }
        }));
    };

    showEditorModal = (question, option, model) => {
        this.setState({
            showEditorModal: true,
            editorModel: {
                question: question,
                option: option,
                model: model
            }
        });
    };

    closeEditorModal = () => {
        this.setState({ showEditorModal: false, editorModel: {} });
    };

    handleAccordion = (e, itemProps) => {
        const { index } = itemProps;
        const { activeIndex } = this.state;
        const newIndex = activeIndex === index ? -1 : index;
        this.setState({ activeIndex: newIndex });
    };

    handleQuestionChange = (question, model) => {
        let questions = [];
        if (this.state.exam.questions) {
            questions = [...this.state.exam.questions];
        }
        questions[question].question = model;
        this.setState(
            prevState => ({
                exam: {
                    ...prevState.exam,
                    questions: questions
                }
            }),
            () => {
                alert("Текст вопроса изменен, чтобы сохранить изменения не забудьте нажать на Редактировать экзамен");
            }
        );
    };

    handleOptionChange = (question, option, model) => {
        let questions = [];
        if (this.state.exam.questions) {
            questions = [...this.state.exam.questions];
        }
        questions[question].options[option] = model;
        this.setState(prevState => ({
            showEditorModal: false,
            editorModel: {},
            exam: {
                ...prevState.exam,
                questions: questions
            }
        }));
    };

    handleNewQuestionChange = model => {
        this.setState({
            newQuestion: model
        });
    };

    handleNewOptionChange = model => {
        this.setState({
            newOption: model
        });
    };

    handleChangeAnswer = (e, data) => {
        const { question, option } = data;
        let questions = [];
        if (this.state.exam.questions) {
            questions = [...this.state.exam.questions];
        }
        const q = questions[question];
        if (!q.answer.includes(option)) {
            questions[question].answer = [option];
            this.setState(prevState => ({
                exam: {
                    ...prevState.exam,
                    questions: questions
                }
            }));
        }
    };

    addNewOption = (question, model) => {
        let questions = [];
        if (this.state.exam.questions) {
            questions = [...this.state.exam.questions];
        }
        questions[question].options.push(model);
        this.setState(prevState => ({
            newOption: "",
            exam: {
                ...prevState.exam,
                questions: questions
            }
        }));
    };

    deleteOption = (question, option) => {
        let questions = [];
        if (this.state.exam.questions) {
            questions = [...this.state.exam.questions];
        }
        questions[question].options.splice(option, 1);
        this.setState(prevState => ({
            exam: {
                ...prevState.exam,
                questions: questions
            }
        }));
    };

    addQuestion = () => {
        let questions = [];
        if (this.state.exam.questions) {
            questions = [...this.state.exam.questions];
        }
        questions.push({
            question: this.state.newQuestion,
            options: [],
            answer: []
        });
        this.setState(prevState => ({
            activeIndex: questions.length - 1,
            newQuestion: "",
            exam: {
                ...prevState.exam,
                questions: questions
            }
        }));
    };

    deleteQuestion = index => {
        let questions = [];
        if (this.state.exam.questions) {
            questions = [...this.state.exam.questions];
        }
        questions.splice(index, 1);
        this.setState(prevState => ({
            activeIndex: -1,
            exam: {
                ...prevState.exam,
                questions: questions
            }
        }));
    };

    render() {
        const { activeIndex, newQuestion, newOption, subjectOptions, topicOptions, subtopicOptions } = this.state;
        let exam;
        let questions = []; // panels

        if (this.state.exam) {
            if (this.state.exam.questions && this.state.exam.questions.length !== 0) {
                for (let i = 0; i < this.state.exam.questions.length; i++) {
                    let question = this.state.exam.questions[i];
                    let options = [];
                    for (let j = 0; j < question.options.length; j++) {
                        options.push(
                            <Form.Field
                                key={`admin-exam-${this.state.exam._id}-question-${i}-option-${j}`}
                                style={{ padding: 4 }}
                            >
                                <div style={{ display: "flex", marginBottom: 8 }}>
                                    <Radio
                                        checked={question.answer.includes(j.toString()) || question.answer.includes(j)}
                                        label={ReactHtmlParser(question.options[j])}
                                        question={i}
                                        option={j}
                                        onChange={this.handleChangeAnswer}
                                    />
                                </div>
                                <Button
                                    primary
                                    size="tiny"
                                    onClick={() => this.showEditorModal(i, j, question.options[j])}
                                >
                                    Редактировать вариант ответа
                                </Button>
                                <Button size="tiny" onClick={() => this.deleteOption(i, j)}>
                                    Удалить вариант ответа
                                </Button>
                            </Form.Field>
                        );
                    }
                    questions.push({
                        key: `admin-exam-${this.state.exam._id}-question-${i}`,
                        title: `Вопрос ${i + 1}`,
                        content: {
                            content: (
                                <div>
                                    <Message
                                        icon="hand point up"
                                        info
                                        header="Редактирование вопроса"
                                        content="Чтобы отредактировать текст вопроса (только текст!), внесите необходимые изменения и нажмите Редактировать текст вопроса."
                                    />
                                    {bold("Текст вопроса")}
                                    {activeIndex === i ? (
                                        <EditorComponent
                                            model={question.question}
                                            question={i}
                                            onEdit={this.handleQuestionChange}
                                            onDelete={this.deleteQuestion}
                                        />
                                    ) : null}
                                    {bold("Топик (который этот вопрос покрывает)")}
                                    <Dropdown
                                        fluid
                                        selection
                                        name="topic"
                                        required
                                        options={topicOptions}
                                        question={i}
                                        value={question.topic || ""}
                                        onChange={this.handleTopicSubtopicChange}
                                        style={{ marginBottom: "1em" }}
                                    />
                                    {bold("Сабтопик")}
                                    <Dropdown
                                        fluid
                                        selection
                                        name="subtopic"
                                        required
                                        options={subtopicOptions}
                                        question={i}
                                        value={question.subtopic || ""}
                                        onChange={this.handleTopicSubtopicChange}
                                        style={{ marginBottom: "1em" }}
                                    />
                                    {header("Варианты ответа", 16, "bold")}
                                    <Form style={{ marginBottom: "2em" }}>{options}</Form>
                                    {header("Новый вариант ответа", 16, "bold")}
                                    {activeIndex === i ? (
                                        <FroalaEditor
                                            config={{
                                                placeholderText: "Поле для нового варианта ответа",
                                                imageUploadURL: "/api/admin/image",
                                                imageUploadMethod: "POST",
                                                events: {
                                                    "froalaEditor.image.error": (e, editor, error) => {
                                                        console.log(error);
                                                    }
                                                }
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
                            )
                        }
                    });
                }
            }
            exam = (
                <div style={{ fontSize: "15px" }}>
                    <EditorModal
                        open={this.state.showEditorModal}
                        question={this.state.editorModel.question}
                        option={this.state.editorModel.option}
                        model={this.state.editorModel.model}
                        onClose={this.closeEditorModal}
                        onEdit={this.handleOptionChange}
                    />
                    {header(`Название экзамена: ${this.state.exam.title}`, "22px", "bold")}
                    <Message icon info>
                        <Icon name="hand point up" />
                        <Message.Content>
                            <Message.Header>Сохранение прогресса</Message.Header>
                            Внесенные изменения не сохраняются автоматически. Чтобы сохранить все в базу данных (и не
                            потерять введенный контент), нажмите <strong>Редактировать экзамен</strong>, даже после
                            добавления/редактирования/удаления вопросов.{" "}
                            <u>Советую периодически нажимать эту кнопку для сохранения прогресса.</u>
                        </Message.Content>
                    </Message>
                    {bold("Название экзамена (как оно должно отображаться у студента)")}
                    <Input
                        fluid
                        name="title"
                        value={this.state.exam.title || ""}
                        onChange={this.handleExamChange}
                        style={{ marginBottom: "1em" }}
                    />
                    {bold("Описание экзамена, объяснения")}
                    <TextArea
                        autoHeight
                        name="description"
                        value={this.state.exam.description || ""}
                        onChange={this.handleExamChange}
                        style={{ marginBottom: "1em", minHeight: 100, width: "100%" }}
                    />
                    {this.state.loading ? (
                        <Loader active inline="centered" size="large" style={{ margin: "2em auto" }} />
                    ) : (
                        <div>
                            {bold("Предмет экзамена")}
                            <Dropdown
                                fluid
                                selection
                                name="subject"
                                required
                                options={subjectOptions}
                                value={this.state.exam.subject}
                                onChange={this.handleExamChange}
                                style={{ marginBottom: "1em" }}
                            />
                        </div>
                    )}
                    {bold("Время на экзамен в секундах (по умолчанию установлено на 1 час = 3600 секунд)")}
                    <Input
                        fluid
                        name="time"
                        required
                        type="number"
                        value={this.state.exam.time}
                        onChange={this.handleExamChange}
                        style={{ marginBottom: "2em" }}
                    />
                    {bold("Скрыть экзамен?")}
                    <Checkbox
                        checked={this.state.exam.hidden || false}
                        label="Скрыть"
                        name="hidden"
                        onChange={this.handleExamChange}
                        style={{ marginBottom: "2em" }}
                    />

                    {bold("Экзамен платный?")}
                    <Checkbox
                        checked={this.state.exam.paid || false}
                        label="Сделать платным"
                        name="paid"
                        onChange={this.handleExamChange}
                        style={{ marginBottom: "2em" }}
                    />
                    {this.state.exam.paid ? (
                        <div>
                            {bold("Цена в тенге")}
                            <Input
                                fluid
                                name="price"
                                required
                                type="number"
                                value={this.state.exam.price || 1000}
                                onChange={this.handleExamChange}
                                style={{ marginBottom: "2em" }}
                            />
                        </div>
                    ) : null}

                    <div style={{ marginBottom: "2em" }}>
                        <Button loading={this.state.editing} onClick={this.editExam} positive size="large">
                            Редактировать экзамен
                        </Button>
                        <Button loading={this.state.deleting} negative onClick={this.deleteExam} size="large">
                            Удалить экзамен
                        </Button>
                    </div>
                    {header("Вопросы пробного экзамена", "18px", "bold")}
                    <Accordion
                        activeIndex={activeIndex}
                        fluid
                        styled
                        panels={questions}
                        style={{ marginBottom: "4em", padding: "1em" }}
                        onTitleClick={this.handleAccordion}
                    />
                    {/* new question */}
                    {header("Новый вопрос", 18, "bold")}
                    <FroalaEditor
                        config={{
                            placeholderText: "Поле для нового вопроса",
                            imageUploadURL: "/api/admin/image",
                            imageUploadMethod: "POST",
                            events: {
                                "froalaEditor.image.error": (e, editor, error) => {
                                    console.log(error);
                                }
                            }
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

        return (
            <DocumentTitle title={this.state.exam ? this.state.exam.title : "Пробный экзамен"}>
                <Container>{this.state.loading ? loader : exam}</Container>
            </DocumentTitle>
        );
    }
}

export default connect(
    store => ({}),
    {
        logout
    }
)(Exam);
