// modules
import React from "react";
import ReactHtmlParser from "react-html-parser";
// assets
// styles
import "./index.css";
// components
// redux

const Lecture = props => (
    <div className="dashboard-course-lesson-lecture-content">
        {props.lecture ? ReactHtmlParser(props.lecture) : <div>В этом уроке нет лекции</div>}
    </div>
);

export default Lecture;
