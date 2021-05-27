// modules
import React, { Component } from "react";
import { connect } from "react-redux";
import axios from "axios";
import DocumentTitle from "react-document-title";
// assets
import { bold, header } from "assets/formatUtils";
import { adminRoutes } from "assets/routes";
// styles
import { Checkbox, Form, Loader, Message } from "semantic-ui-react";
// components
// redux
import { logout } from "store/User";

class NewExam extends Component {
    state = {
        loading: false,
        title: "",
        hidden: false,
        description: "",
        subject: "",
        time: 3600,
        questions: [],
        subjects: [],
    };

    componentDidMount() {
        this.mounted = true;
        this.getSubjects();
    }

    componentWillUnmount() {
        this.mounted = false;
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
            let options = response.data.message.map((subject, index) => ({
                text: subject.name,
                value: subject.name,
            }));
            this.setState({ loading: false, subjects: options });
        }
    };

    handleChange = (e, data) => {
        let result = data.value;
        if (data.name === "hidden") {
            result = data.checked;
        }
        this.setState({
            [data.name]: result,
        });
    };

    handleAddExam = async () => {
        // confirmation
        let r = window.confirm("Добавить экзамен?");
        if (r) {
            // build payload
            const payload = {
                exam: {
                    title: this.state.title,
                    description: this.state.description,
                    subject: this.state.subject,
                    time: this.state.time,
                    questions: this.state.questions,
                },
            };
            // axios call
            axios
                .post(adminRoutes.addExam(), payload)
                .then(() => {
                    // fetch exams
                    this.props.getExams();
                    // reset state
                    this.setState({
                        title: "",
                        description: "",
                        subject: "",
                        time: 3600,
                        questions: [],
                    });
                })
                .catch(error => {
                    console.error(error);
                });
        }
    };

    render() {
        return (
            <DocumentTitle title="Создать новый пробный экзамен">
                <div style={{ fontSize: "15px" }}>
                    {header("Создать новый пробный экзамен", "22px", "bold")}
                    <Form onSubmit={this.handleAddExam}>
                        <Message
                            icon="hand point up"
                            info
                            header="Добавление вопросов"
                            content="Чтобы добавить вопросы, сперва создайте пробный экзамен, затем выберите его в списке экзаменов слева"
                        />
                        {bold("Название экзамена (как оно должно отображаться у студента)")}
                        <Form.Input
                            fluid
                            name="title"
                            required
                            value={this.state.title}
                            onChange={this.handleChange}
                            style={{ marginBottom: "1em" }}
                        />
                        {bold("Описание экзамена, объяснения")}
                        <Form.TextArea
                            autoHeight
                            name="description"
                            value={this.state.description}
                            onChange={this.handleChange}
                            style={{ marginBottom: "1em", minHeight: 100, width: "100%" }}
                        />
                        {this.state.loading ? (
                            <Loader active inline="centered" size="large" style={{ margin: "2em auto" }} />
                        ) : (
                            <div>
                                {bold("Предмет экзамена")}
                                <Form.Dropdown
                                    fluid
                                    selection
                                    name="subject"
                                    required
                                    options={this.state.subjects}
                                    value={this.state.subject}
                                    onChange={this.handleChange}
                                    style={{ marginBottom: "1em" }}
                                />
                            </div>
                        )}
                        {bold("Время на экзамен в секундах (по умолчанию установлено на 1 час = 3600 секунд)")}
                        <Form.Input
                            fluid
                            name="time"
                            required
                            type="number"
                            value={this.state.time}
                            onChange={this.handleChange}
                            style={{ marginBottom: "2em" }}
                        />
                        {bold("Скрыть экзамен?")}
                        <Checkbox
                            checked={this.state.hidden || false}
                            label="Скрыть"
                            name="hidden"
                            onChange={this.handleChange}
                            style={{ marginBottom: "2em" }}
                        />
                        <Form.Button type="submit" positive size="large">
                            Добавить экзамен
                        </Form.Button>
                    </Form>
                </div>
            </DocumentTitle>
        );
    }
}

export default connect(
    store => ({}),
    {
        logout,
    }
)(NewExam);
