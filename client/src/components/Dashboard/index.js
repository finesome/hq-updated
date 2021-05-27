// modules
import React, { Component } from "react";
import { Redirect, Route, Switch } from "react-router-dom";
import { connect } from "react-redux";
// assets
// styles
import "./index.css";
// components
import Course from "./Course";
import Courses from "./Courses";
import Exam from "./Exam";
import Profile from "./Profile";
// redux
import { logout } from "store/User";

class Dashboard extends Component {
    state = {
        showAuthModal: false,
    };

    render() {
        return (
            <div className="dashboard-wrapper">
                <Switch>
                    <Route exact path="/dashboard/courses" component={Courses} />
                    <Route path="/dashboard/courses/:id" component={Course} />
                    <Route path="/dashboard/exams/:id" component={Exam} />
                    <Route exact path="/dashboard/profile" component={Profile} />
                    <Redirect to="/dashboard/courses" />
                </Switch>
            </div>
        );
    }
}

export default connect(
    store => ({
        isAuthenticated: !!store.user.user.email,
        role: store.user.user.scope,
    }),
    {
        logout,
    }
)(Dashboard);
