// modules
import React, { Component } from "react";
import { connect } from "react-redux";
import { Link, NavLink, Redirect, Route, Switch } from "react-router-dom";
import axios from "axios";
import groupBy from "lodash/groupBy";
import DocumentTitle from "react-document-title";
// assets
import { adminRoutes } from "assets/routes";
// styles
import { Divider, Grid, Icon, Loader, Menu } from "semantic-ui-react";
import "./index.css";
// components
import Home from "./Home";
import Course from "./Course";
import Exam from "./Exam";
import NewExam from "./NewExam";
import NewCourse from "./NewCourse";
import Subjects from "./Subjects";
// redux
import { logout } from "store/User";

class Admin extends Component {
    state = {
        loading: false,
    };

    componentDidMount() {
        this.mounted = true;
        this.getExams();
        this.getCourses();
    }

    componentWillUnmount() {
        this.mounted = false;
    }

    getCourses = async () => {
        this.setState({ loading: true });
        // axios call
        const response = await axios.get(adminRoutes.getCourses()).catch(() => {
            if (this.mounted) {
                this.setState({ loading: false });
                this.props.logout();
            }
        });
        // set courses
        if (this.mounted) {
            this.setState({ loading: false, courses: response.data.message });
        }
    };

    getExams = async () => {
        this.setState({ loading: true });
        // axios call
        const response = await axios.get(adminRoutes.getExams()).catch(() => {
            if (this.mounted) {
                this.setState({ loading: false });
                this.props.logout();
            }
        });
        // set exams
        if (this.mounted) {
            console.log(response.data.message);
            this.setState({ loading: false, exams: response.data.message });
        }
    };

    render() {
        let loader;
        let menuCourses = [];
        let menuExams = [];
        if (this.state.loading) {
            loader = <Loader active />;
        }
        if (this.state.courses && this.state.courses.length !== 0) {
            const grouped = groupBy(this.state.courses, "category");
            for (let key in grouped) {
                menuCourses.push(
                    <Menu.Item
                        className="admin-menu-item"
                        key={`admin-menu-item-category-${key}`}
                        style={{ borderTop: "8px solid #191919" }}>
                        {key}
                    </Menu.Item>
                );
                for (let i = 0; i < grouped[key].length; i++) {
                    let course = grouped[key][i];
                    menuCourses.push(
                        <Menu.Item
                            as={NavLink}
                            className="admin-menu-item-course"
                            key={`admin-menu-item-category-${key}-course-${i}`}
                            to={`/admin/${course._id}`}>
                            {`${i + 1}. ${course.title}`}
                        </Menu.Item>
                    );
                }
            }
        }
        if (this.state.exams && this.state.exams.length !== 0) {
            for (let i = 0; i < this.state.exams.length; i++) {
                let exam = this.state.exams[i];
                menuExams.push(
                    <Menu.Item
                        as={NavLink}
                        className="admin-menu-item-course"
                        key={`admin-menu-item-exam-${i}`}
                        to={`/admin/exams/${exam._id}`}>
                        {`${i + 1}. ${exam.title}`}
                    </Menu.Item>
                );
            }
        }

        return (
            <DocumentTitle title="Панель администратора">
                <div>
                    <Grid columns={2}>
                        <Grid.Column width={4}>
                            <div className="admin-menu-wrapper">
                                <Menu className="admin-menu" fluid inverted secondary vertical>
                                    <Menu.Item as={Link} className="admin-menu-item" to="/">
                                        <Icon name="home" />
                                        На главную страницу
                                    </Menu.Item>
                                    <Menu.Item className="admin-menu-item" onClick={this.props.logout}>
                                        <Icon name="sign out" />
                                        Выйти
                                    </Menu.Item>
                                    <Menu.Item as={Link} className="admin-menu-item" to="/admin/subjects">
                                        <Icon name="book" />
                                        Предметы и темы
                                    </Menu.Item>
                                    <Menu.Item as={NavLink} className="admin-menu-item" to="/admin/new">
                                        <Icon name="plus" />
                                        Создать новый курс
                                    </Menu.Item>
                                    <Menu.Item as={NavLink} className="admin-menu-item" to="/admin/exam">
                                        <Icon name="write" />
                                        Создать пробный экзамен
                                    </Menu.Item>
                                    <Divider />
                                    <Menu.Item className="admin-menu-item">Пробные экзамены:</Menu.Item>
                                    {loader}
                                    {menuExams}
                                    <Menu.Item className="admin-menu-item">Курсы:</Menu.Item>
                                    {loader}
                                    {menuCourses}
                                </Menu>
                            </div>
                        </Grid.Column>
                        <Grid.Column width={12}>
                            <main className="admin-content-wrapper">
                                <Switch>
                                    <Route exact path="/admin" component={Home} />
                                    <Route exact path="/admin/subjects" component={Subjects} />
                                    <Route
                                        exact
                                        path="/admin/new"
                                        render={props => <NewCourse {...props} getCourses={this.getCourses} />}
                                    />
                                    <Route
                                        exact
                                        path="/admin/exam"
                                        render={props => <NewExam {...props} getExams={this.getExams} />}
                                    />
                                    <Route
                                        exact
                                        path="/admin/exams/:id"
                                        render={props => <Exam {...props} getExams={this.getExams} />}
                                    />
                                    <Route
                                        exact
                                        path="/admin/:id"
                                        render={props => <Course {...props} getCourses={this.getCourses} />}
                                    />
                                    <Redirect to="/admin" />
                                </Switch>
                            </main>
                        </Grid.Column>
                    </Grid>
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
)(Admin);
