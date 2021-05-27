// modules
import React, { Component } from "react";
import axios from "axios";
import DocumentTitle from "react-document-title";
// assets
import { bold, header } from "assets/formatUtils";
import { adminRoutes } from "assets/routes";
// styles
import { Form, Message } from "semantic-ui-react";
// components
// redux

class NewCourse extends Component {
    state = {
        title: "",
        description: "",
        category: "",
    };

    handleChange = (e, data) => {
        this.setState({
            [data.name]: data.value,
        });
    };

    handleAddCourse = async () => {
        // confirmation
        let r = window.confirm("Добавить курс?");
        if (r) {
            // build payload
            const payload = {
                course: {
                    title: this.state.title,
                    description: this.state.description,
                    category: this.state.category,
                },
            };
            // axios call
            axios
                .post(adminRoutes.addCourse(), payload)
                .then(() => {
                    // fetch courses
                    this.props.getCourses();
                    // reset state
                    this.setState({
                        title: "",
                        description: "",
                        category: "",
                    });
                })
                .catch(error => {
                    console.error(error);
                });
        }
    };

    render() {
        return (
            <DocumentTitle title="Создать новый курс">
                <div style={{ fontSize: "15px" }}>
                    {header("Создать новый курс", "22px", "bold")}
                    <Message info>
                        Создайте здесь курс, указав его название, описание и категорию. После создания вы сможете указать его
                        логотип и добавить необходимые уроки
                    </Message>
                    <Form onSubmit={this.handleAddCourse}>
                        {bold("Название курса")}
                        <Form.Input
                            fluid
                            name="title"
                            required
                            value={this.state.title}
                            onChange={this.handleChange}
                            style={{ marginBottom: "1em" }}
                        />
                        {bold("Описание курса")}
                        <Form.TextArea
                            autoHeight
                            name="description"
                            value={this.state.description}
                            onChange={this.handleChange}
                            style={{ marginBottom: "1em", minHeight: 100, width: "100%" }}
                        />
                        {bold("Категория курса")}
                        <Form.Input
                            fluid
                            name="category"
                            required
                            value={this.state.category}
                            onChange={this.handleChange}
                            style={{ marginBottom: "1em" }}
                        />
                        <Form.Button type="submit" positive size="large">
                            Добавить курс
                        </Form.Button>
                    </Form>
                </div>
            </DocumentTitle>
        );
    }
}

export default NewCourse;
