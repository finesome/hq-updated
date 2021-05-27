// modules
import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
// styles
import { Form, Icon, Message, Modal } from "semantic-ui-react";
import "./index.css";
// assets
import { cityOptions } from "assets/utils";
// components
// redux
import { toggleRegisterModal } from "store/UI";
import { register } from "store/User";

class RegisterModal extends Component {
    state = {
        email: "",
        password: "",
        lastName: "",
        firstName: "",
        phone: "",
        city: "",
        school: "",
        otherCity: "",
        mailing: false,
        agreement: false,
    };

    handleChange = (e, data) => {
        let result = data.value;
        if (data.name === "mailing" || data.name === "agreement") {
            result = data.checked;
        }
        this.setState({
            [data.name]: result,
        });
    };

    handleRegister = () => {
        let { agreement, city, email, firstName, lastName, mailing, otherCity, password, phone, school } = this.state;
        if (!city || (city === "other" && !otherCity)) {
            alert("Выберите пожалуйста город");
            return;
        }
        if (!agreement) {
            alert("Вы должны согласиться с условиями сервиса для регистрации");
            return;
        }
        if (city === "other") {
            city = otherCity;
        }
        this.props
            .register(email, password, lastName, firstName, phone, city, school, mailing)
            .then(() => {
                // close modal after 3 seconds
                setTimeout(() => this.props.toggleRegisterModal(false), 3000);
            })
            .catch(error => {
                console.error(error);
            });
    };

    render() {
        const { agreement, city, email, firstName, lastName, mailing, otherCity, password, phone, school } = this.state;
        let successMsg;
        let errorMsg;
        if (this.props.done) {
            successMsg = (
                <div className="auth-modal-success-msg">
                    Вы успешно зарегистрированы, на вашу почту выслано письмо для подтверждения регистрации. Если вы не получили
                    письмо, проверьте папку Спам.
                </div>
            );
        }
        if (this.props.fail) {
            errorMsg = <div className="auth-modal-error-msg">Такой пользователь уже существует</div>;
        }

        return (
            <Modal open={this.props.showRegisterModal} onClose={() => this.props.toggleRegisterModal(false)} size="tiny">
                <div className="auth-modal">
                    <svg
                        className="auth-modal-close"
                        version="1.1"
                        xmlns="http://www.w3.org/2000/svg"
                        onClick={() => this.props.toggleRegisterModal(false)}>
                        <line x1="0" y1="0" x2="24" y2="24" stroke="black" strokeWidth="2" />
                        <line x1="24" y1="0" x2="0" y2="24" stroke="black" strokeWidth="2" />
                    </svg>
                    <div className="auth-modal-header">Регистрация</div>
                    <Message icon color="blue" size="large">
                        <Icon name="circle notched" />
                        <Message.Content>
                            <Message.Header>Доступ на сайт</Message.Header>
                            Количество устройств для входа с одного аккаунта - 2
                        </Message.Content>
                    </Message>
                    {errorMsg}
                    {successMsg}
                    <Form className="auth-modal-form" size="large" onSubmit={this.handleRegister}>
                        <Form.Input
                            name="email"
                            type="email"
                            required
                            placeholder="Email"
                            value={email}
                            onChange={this.handleChange}
                        />
                        <Form.Input
                            name="password"
                            type="password"
                            required
                            placeholder="Пароль"
                            value={password}
                            onChange={this.handleChange}
                        />
                        <Form.Input
                            name="lastName"
                            required
                            placeholder="Фамилия"
                            value={lastName}
                            onChange={this.handleChange}
                        />
                        <Form.Input
                            name="firstName"
                            required
                            placeholder="Имя"
                            value={firstName}
                            onChange={this.handleChange}
                        />
                        <Form.Input name="phone" placeholder="Телефон" value={phone} required onChange={this.handleChange} />
                        <Form.Dropdown
                            name="city"
                            placeholder="Город"
                            required
                            selection
                            options={cityOptions}
                            value={city}
                            onChange={this.handleChange}
                        />
                        {this.state.city === "other" ? (
                            <Form.Input
                                name="otherCity"
                                required
                                placeholder="Город"
                                value={otherCity}
                                onChange={this.handleChange}
                            />
                        ) : null}
                        <Form.Input name="school" required placeholder="Школа" value={school} onChange={this.handleChange} />
                        <Form.Checkbox
                            checked={mailing}
                            label="Я согласен получать почтовую рассылку от Qlabs"
                            name="mailing"
                            onChange={this.handleChange}
                        />
                        <Form.Checkbox
                            checked={agreement}
                            label="Я согласен с политикой Qlabs и ознакомлен с правилами"
                            name="agreement"
                            onChange={this.handleChange}
                        />
                        <Form.Button floated="right" primary size="large" type="submit">
                            Зарегистрироваться
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
            showRegisterModal: store.ui.showRegisterModal,
            pending: store.user.register.pending,
            done: store.user.register.done,
            fail: store.user.register.fail,
        }),
        {
            register,
            toggleRegisterModal,
        }
    )(RegisterModal)
);
