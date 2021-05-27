// modules
import React, { Component } from "react";
import { connect } from "react-redux";
import axios from "axios";
import DocumentTitle from "react-document-title";
// assets
import { bold, header } from "assets/formatUtils";
import { adminRoutes } from "assets/routes";
// styles
import { Accordion, Button, Form, Input, Loader } from "semantic-ui-react";
// components
// redux
import { logout } from "store/User";

class Subjects extends Component {
    state = {
        loading: false,
        name: "",
        subjects: [],
        newTopic: "",
        newTopicPosition: 0,
    };

    componentDidMount() {
        this.mounted = true;
        this.getSubjects();
    }

    componentWillUnmount() {
        this.mounted = false;
    }

    handleChange = (e, data) => {
        this.setState({
            [data.name]: data.value,
        });
    };

    addNewTopic = index => {
        let subjects = [...this.state.subjects];
        subjects[index].topics.push({
            name: this.state.newTopic,
            subtopics: [],
        });
        this.setState({ subjects: subjects, newTopic: "" });
    };

    addNewSubtopic = (i, j, subtopic) => {
        let subjects = [...this.state.subjects];
        subjects[i].topics[j].subtopics.push(subtopic);
        this.setState({ subjects: subjects });
    };

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
            this.setState({ loading: false, subjects: response.data.message });
        }
    };

    addSubject = async () => {
        // confirmation
        let r = window.confirm("Добавить предмет экзамена?");
        if (r) {
            // build payload
            const payload = {
                subject: {
                    name: this.state.name,
                },
            };
            // axios call
            axios
                .post(adminRoutes.addSubject(), payload)
                .then(() => {
                    // fetch subjects
                    this.getSubjects();
                    // reset subject name
                    this.setState({ name: "" });
                })
                .catch(error => {
                    console.error(error);
                });
        }
    };

    editSubject = async index => {
        // confirmation
        let r = window.confirm("Редактировать предмет?");
        if (r) {
            let subject = this.state.subjects[index];
            // axios call
            await axios
                .post(adminRoutes.editSubject(subject._id), { subject: subject })
                .then(() => {
                    this.getSubjects();
                })
                .catch(error => {
                    console.error(error);
                });
        }
    };

    deleteSubject = async id => {
        // confirmation
        let r = window.confirm("Удалить предмет экзамена?");
        if (r) {
            // axios call
            axios
                .delete(adminRoutes.deleteSubject(id))
                .then(() => {
                    // fetch subjects
                    this.getSubjects();
                })
                .catch(error => {
                    console.error(error);
                });
        }
    };

    deleteTopic = (subject, topic) => {
        let subjects = [...this.state.subjects];
        subjects[subject].topics.splice(topic, 1);
        this.setState({ subjects: subjects });
    };

    deleteSubtopic = (i, j, key) => {
        let subjects = [...this.state.subjects];
        subjects[i].topics[j].subtopics.splice(key, 1);
        this.setState({ subjects: subjects });
    };

    render() {
        let panels = [];
        for (let i = 0; i < this.state.subjects.length; i++) {
            let subject = this.state.subjects[i];
            let topics = [];
            for (let j = 0; j < subject.topics.length; j++) {
                topics.push(
                    <p key={`admin-subjects-${i}-${j}`}>
                        {j + 1}. <span style={{ textDecoration: "underline" }}>{subject.topics[j].name}</span>
                        <span style={{ cursor: "pointer", marginLeft: "1em" }} onClick={() => this.deleteTopic(i, j)}>
                            (x)
                        </span>
                    </p>
                );
                let subtopics = [];
                for (let k = 0; k < subject.topics[j].subtopics.length; k++) {
                    subtopics.push(
                        <p key={`admin-subjects-${i}-${j}-${k}`} style={{ textIndent: "1em" }}>
                            {j + 1}.{k + 1}. {subject.topics[j].subtopics[k]}
                            <span style={{ cursor: "pointer", marginLeft: "1em" }} onClick={() => this.deleteSubtopic(i, j, k)}>
                                (x)
                            </span>
                        </p>
                    );
                }
                topics.push(subtopics);
                topics.push(
                    <div key={`admin-subjects-${i}-${j}-newSubtopic`}>
                        <Button
                            primary
                            onClick={() => {
                                let prompt = window.prompt("Укажите название сабтопика");
                                if (prompt !== null) {
                                    this.addNewSubtopic(i, j, prompt);
                                }
                            }}
                            style={{ marginBottom: "1em" }}>
                            Добавить сабтопик
                        </Button>
                    </div>
                );
            }
            panels.push({
                key: `admin-subjects-subject-${i}`,
                title: subject.name,
                content: {
                    content: (
                        <div>
                            <div style={{ marginBottom: "1em" }}>{topics}</div>
                            {bold("Новый топик")}
                            <Input
                                fluid
                                name="newTopic"
                                value={this.state.newTopic}
                                onChange={this.handleChange}
                                style={{ marginBottom: "1em" }}
                            />
                            <Button primary onClick={() => this.addNewTopic(i)} style={{ marginBottom: "1em" }}>
                                Добавить топик
                            </Button>
                            <br />
                            <Button positive onClick={() => this.editSubject(i)}>
                                Редактировать предмет
                            </Button>
                            <Button negative onClick={() => this.deleteSubject(subject._id)}>
                                Удалить предмет
                            </Button>
                        </div>
                    ),
                },
            });
        }

        return (
            <DocumentTitle title="Предметы и темы">
                <div style={{ fontSize: "15px" }}>
                    {header("Предметы и темы", "22px", "bold")}
                    {this.state.loading ? (
                        <Loader active inline="centered" size="large" style={{ margin: "2em auto" }} />
                    ) : (
                        <Accordion fluid styled panels={panels} style={{ marginBottom: "2em", padding: "1em" }} />
                    )}
                    {header("Новый предмет", 16, 400)}
                    <Form onSubmit={this.addSubject}>
                        {bold("Название предмета")}
                        <Form.Input
                            fluid
                            name="name"
                            required
                            value={this.state.name}
                            onChange={this.handleChange}
                            style={{ marginBottom: "1em" }}
                        />
                        <Form.Button type="submit" positive size="large">
                            Добавить предмет экзамена
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
)(Subjects);
