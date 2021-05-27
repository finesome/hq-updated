// modules
import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
// styles
import { Form, Modal } from "semantic-ui-react";
import "./index.css";
// assets
// components
// redux
import { toggleLoginModal } from "store/UI";
import { login, set } from "store/User";

class LoginModal extends Component {
    state = {
        email: "",
        password: "",
        status: "",
    };

    handleChange = (e, data) => {
        this.setState({
            [data.name]: data.value,
        });
    };

    handleLogin = () => {
        this.props
            .login(this.state.email, this.state.password)
            .then(response => {
                // set user
                const user = { ...response.value.data.message, headers: response.value.headers };
                this.props.set(user);
            })
            .then(() => {
                // close modal
                this.props.toggleLoginModal(false);
                // redirect
                this.props.history.push(this.props.role === "admin" ? "/admin" : "/dashboard");
            })
            .catch(error => {
                this.setState({
                    status: error.response.status,
                });
                console.error(error);
            });
    };

    render() {
        const { email, password } = this.state;
        let errorMsg;
        if (this.props.fail) {
            switch (this.state.status) {
                case 401:
                    errorMsg = <div className="auth-modal-error-msg">Неправильный пароль.</div>;
                    break;
                case 403:
                    errorMsg = <div className="auth-modal-error-msg">Пользователь еще не подтвердил регистрацию.</div>;
                    break;
                case 404:
                    errorMsg = <div className="auth-modal-error-msg">Такого пользователя не существует.</div>;
                    break;
                case 406:
                    errorMsg = (
                        <div className="auth-modal-error-msg">Вы превысили количество активных устройств (не больше 2).</div>
                    );
                    break;
                default:
                    errorMsg = <div className="auth-modal-error-msg">Ошибка на сервере, обратитесь в поддержку.</div>;
            }
        }

        return (
            <Modal open={this.props.showLoginModal} onClose={() => this.props.toggleLoginModal(false)} size="tiny">
                <div className="auth-modal">
                    <svg
                        className="auth-modal-close"
                        version="1.1"
                        xmlns="http://www.w3.org/2000/svg"
                        onClick={() => this.props.toggleLoginModal(false)}>
                        <line x1="0" y1="0" x2="24" y2="24" stroke="black" strokeWidth="2" />
                        <line x1="24" y1="0" x2="0" y2="24" stroke="black" strokeWidth="2" />
                    </svg>
                    <div className="auth-modal-header">Войти</div>
                    {errorMsg}
                    <Form className="auth-modal-form" size="large" onSubmit={this.handleLogin}>
                        <Form.Input
                            className="auth-modal-input"
                            name="email"
                            required
                            placeholder="user@gmail.com"
                            value={email}
                            onChange={this.handleChange}
                        />
                        <Form.Input
                            className="auth-modal-input"
                            name="password"
                            type="password"
                            required
                            placeholder="Пароль"
                            value={password}
                            onChange={this.handleChange}
                        />
                        {/* <div
                            className="auth-modal-forgot"
                            onClick={() => {
                                console.log("forgot password");
                            }}>
                            забыли пароль?
                        </div> */}
                        <Form.Button floated="right" primary size="large" type="submit">
                            Войти
                        </Form.Button>
                    </Form>
                </div>
            </Modal>
        );
    }
}

export default withRouter(
    connect(
        store => ({
            showLoginModal: store.ui.showLoginModal,
            role: store.user.user.scope,
            pending: store.user.login.pending,
            done: store.user.login.done,
            fail: store.user.login.fail,
        }),
        {
            login,
            set,
            toggleLoginModal,
        }
    )(LoginModal)
);
