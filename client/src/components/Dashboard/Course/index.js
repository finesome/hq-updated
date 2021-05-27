// modules
import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import DocumentTitle from "react-document-title";
import axios from "axios";
// assets
import { dashboardRoutes } from "assets/routes";
// styles
import { Grid, Loader } from "semantic-ui-react";
import "./index.css";
// components
import Lesson from "./Lesson";
// redux
import { logout } from "store/User";

class Course extends Component {
    state = {
        currentLesson: 0,
        id: "",
        loading: false,
    };

    componentDidMount() {
        this.mounted = true;
        // get lesson
        let id = this.props.match.params.id;
        this.getCourse(id);
    }

    componentWillUnmount() {
        this.mounted = false;
    }

    getCourse = async id => {
        this.setState({ id: id, loading: true });
        const response = await axios.get(dashboardRoutes.getCourse(id)).catch(error => {
            this.setState({ loading: false });
            console.error(error);
            this.props.logout();
        });
        // console.log(response.data.message);
        if (!!response && this.mounted) {
            this.setState({ course: response.data.message, loading: false });
        }
    };

    changeLesson = index => {
        this.setState({ currentLesson: index });
    };

    render() {
        let lessons = [];
        let lesson;
        let lessonTitle;
        // let title;
        if (this.state.course) {
            // title = this.state.course.title;
            for (let i = 0; i < this.state.course.lessons.length; i++) {
                lessons.push(
                    <div key={`dashboard-course-navigation-link-${i}`} style={{ marginBottom: "1em" }}>
                        <span
                            className={
                                i === this.state.currentLesson
                                    ? "dashboard-course-navigation-link-active"
                                    : "dashboard-course-navigation-link"
                            }
                            onClick={() => this.changeLesson(i)}>
                            {this.state.course.lessons[i].title}
                        </span>
                    </div>
                );
            }
            if (this.state.course.lessons.length !== 0 && this.state.currentLesson <= this.state.course.lessons.length) {
                lesson = <Lesson lesson={this.state.course.lessons[this.state.currentLesson]} />;
                lessonTitle = <p>{this.state.course.lessons[this.state.currentLesson].title}</p>;
            }
        }

        return (
            <DocumentTitle title={this.state.course ? this.state.course.title : `Урок`}>
                <div className="dashboard-course-wrapper">
                    {this.state.loading ? (
                        <Loader active size="large" />
                    ) : (
                        <Grid divided>
                            <Grid.Row columns={2} className="dashboard-course-columns">
                                <Grid.Column width={4} className="dashboard-course-column-left">
                                    <div className="dashboard-course-navigation">
                                        <div className="dashboard-course-navigation-header">
                                            <p>Навигация по курсу</p>
                                        </div>
                                        {lessons}
                                    </div>
                                </Grid.Column>
                                <Grid.Column width={12} className="dashboard-course-column-right">
                                    <div className="dashboard-course-lesson">
                                        <div className="dashboard-course-lesson-header">{lessonTitle}</div>
                                        {lesson}
                                    </div>
                                </Grid.Column>
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
    )(Course)
);
