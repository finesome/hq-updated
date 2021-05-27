// modules
import React, { Component } from "react";
import { connect } from "react-redux";
import DocumentTitle from "react-document-title";
// assets
// styles
import { Container } from "semantic-ui-react";
import "./index.css";
// components
import Lecture from "./Lecture";
import Quiz from "./Quiz";
import Video from "./Video";
// redux

class Course extends Component {
    componentDidMount() {
        this.mounted = true;
    }

    componentWillUnmount() {
        this.mounted = false;
    }

    render() {
        return (
            <DocumentTitle title={this.props.lesson.title ? this.props.lesson.title : `Урок`}>
                <div className="dashboard-course-lesson-wrapper">
                    <Container className="dashboard-course-lesson-video">
                        {this.props.lesson.video ? <Video video={this.props.lesson.video} /> : null}
                    </Container>
                    <Container className="dashboard-course-lesson-lecture">
                        <Lecture lecture={this.props.lesson.lecture} />
                    </Container>
                    <Container className="dashboard-course-lesson-quiz">
                        <div className="dashboard-course-lesson-part-header">Quiz</div>
                        <Quiz quiz={this.props.lesson.quiz} />
                    </Container>
                </div>
            </DocumentTitle>
        );
    }
}

export default connect(
    store => ({}),
    {}
)(Course);
