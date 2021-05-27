// modules
import React, { Component } from "react";
import { BrowserRouter as Router, Redirect, Route, Switch } from "react-router-dom";
import { connect } from "react-redux";
// assets
// styles
import "./App.css";
// components
import About from "./About";
import Admin from "./Admin";
import Dashboard from "./Dashboard";
import Landing from "./Landing";
import Wrapper from "./Shared/Wrapper";
// redux

class App extends Component {
    render() {
        const { isAuthenticated, role } = this.props;

        return (
            <Router>
                <Switch>
                    <Route
                        exact
                        path="/verified"
                        render={props => (
                            <Wrapper>
                                <Landing verified {...props} />
                            </Wrapper>
                        )}
                    />
                    <Route
                        exact
                        path="/"
                        render={props => (
                            <Wrapper>
                                <Landing {...props} />
                            </Wrapper>
                        )}
                    />
                    <Route
                        exact
                        path="/about"
                        render={props => (
                            <Wrapper>
                                <About {...props} />
                            </Wrapper>
                        )}
                    />
                    <Route
                        path="/dashboard"
                        render={props =>
                            isAuthenticated && role === "user" ? (
                                <Wrapper>
                                    <Dashboard {...props} />
                                </Wrapper>
                            ) : (
                                <Redirect to="/" />
                            )
                        }
                    />
                    <Route
                        path="/admin"
                        render={props => (isAuthenticated && role === "admin" ? <Admin {...props} /> : <Redirect to="/" />)}
                    />
                    <Redirect to="/" />
                </Switch>
            </Router>
        );
    }
}

export default connect(
    store => ({
        isAuthenticated: !!store.user.user.email,
        role: store.user.user.scope,
    }),
    {}
)(App);
