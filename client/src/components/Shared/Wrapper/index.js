// modules
import React, { Component } from "react";
import { NavLink } from "react-router-dom";
import { connect } from "react-redux";
// assets
import logo from "assets/images/logo.png";
// styles
import { Icon, Image } from "semantic-ui-react";
import "./index.css";
// components
import LoginModal from "../AuthModals/LoginModal";
import RegisterModal from "../AuthModals/RegisterModal";
// redux
import { toggleLoginModal, toggleRegisterModal } from "store/UI";
import { logout } from "store/User";

class Wrapper extends Component {
    render() {
        return (
            <div>
                <LoginModal />
                <RegisterModal />
                <header className="app-header">
                    <div className="app-header-logo">
                        <Image as="a" alt="Logo" href="/" src={logo} />
                    </div>
                    <nav className="app-header-nav">
                    <NavLink activeClassName="app-header-nav-link-active"
                    className="app-header-nav-link-auth"
                    to="/about">
                    О нас</NavLink>
                        {this.props.isAuthenticated ? (
                            <NavLink
                                activeClassName="app-header-nav-link-active"
                                className="app-header-nav-link-auth"
                                to={this.props.role === "admin" ? "/admin" : "/dashboard/courses"}>
                                {this.props.role === "admin" ? "Панель администратора" : "Мои курсы"}
                            </NavLink>
                        ) : (
                            <span className="app-header-nav-link-auth" onClick={() => this.props.toggleLoginModal(true)}>
                                Войти
                            </span>
                        )}
                        {this.props.isAuthenticated && this.props.role === "user" ? (
                            <NavLink
                                activeClassName="app-header-nav-link-active"
                                className="app-header-nav-link-auth"
                                to="/dashboard/profile">
                                Профиль
                            </NavLink>
                        ) : null}
                        {this.props.isAuthenticated ? (
                            <span className="app-header-nav-link-auth" onClick={this.props.logout}>
                                Выйти
                            </span>
                        ) : (
                            <span className="app-header-nav-link-auth" onClick={() => this.props.toggleRegisterModal(true)}>
                                Регистрация
                            </span>
                        )}
                    </nav>
                </header>
                <main>{this.props.children}</main>
                <footer className="app-footer">
                    <div>
                        <p>
                            <a href="https://vk.com/qualitylabs" target="_blank">
                                <Icon name="vk" />
                                VK
                            </a>
                        </p>
                        <p>
                            <a href="https://www.instagram.com/qlabsedu/" target="_blank">
                                <Icon name="instagram" />
                                Instagram
                            </a>
                        </p>
                        <p>© 2019 Qlabs</p>
                    </div>
                </footer>
            </div>
        );
    }
}

export default connect(
    store => ({
        isAuthenticated: !!store.user.user.email,
        role: store.user.user.scope,
        showLoginModal: store.ui.showLoginModal,
        showRegisterModal: store.ui.showRegisterModal,
    }),
    {
        logout,
        toggleLoginModal,
        toggleRegisterModal,
    }
)(Wrapper);
