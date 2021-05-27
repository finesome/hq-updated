// modules
import React, { Component } from "react";
import { connect } from "react-redux";
import DocumentTitle from "react-document-title";
import Slider from "react-slick";
// styles
import "./index.css";
// assets
import six from "assets/images/6.jpg";
import carousel1 from "assets/images/carousel_1.jpg";
import carousel2 from "assets/images/carousel_2.jpg";
import carousel3 from "assets/images/carousel_3.jpg";
import landing2 from "assets/images/landing_2.jpg";
import landing3 from "assets/images/landing_3.jpg";
import success from "assets/images/success.png";
import video from "assets/images/video.png";
import contract from "assets/images/contract.png";
import exam from "assets/images/exam.png";
import test from "assets/images/test.png";
import physics from "assets/images/physics.png";
import maths from "assets/images/maths.png";
import chemistry from "assets/images/chemistry.png";
import biology from "assets/images/biology.png";
import critical from "assets/images/critical.png";
import practice from "assets/images/practice.png";
// components
// redux
import { toggleLoginModal, toggleRegisterModal } from "store/UI";

// text to type in typewriter
const insertText = "We offer";

// type text in the typewriter
// keeps calling itself until the text is finished
const typeWriter = (text, i, fnCallback) => {
    // check if text isn't finished yet
    if (i < text.length) {
        // add next character to "Quality Education"
        let header = document.querySelector(".landing-carousel-header-insert");
        if (header) {
            header.innerHTML = text.substring(0, i + 1);
        }
        // wait for a while and call this function again for next character
        if (i === text.length - 1) {
            setTimeout(function() {
                typeWriter(text, i + 1, fnCallback);
            }, 2000);
        } else {
            setTimeout(function() {
                typeWriter(text, i + 1, fnCallback);
            }, 200);
        }
    }
    // text finished, call callback if there is a callback function
    else {
        // call callback after timeout
        setTimeout(fnCallback, 4000);
        let header = document.querySelector(".landing-carousel-header-insert");
        if (header) {
            header.innerHTML = "";
        }
    }
};

// start a typewriter animation for a text in the dataText array
const StartTextAnimation = () => {
    typeWriter(insertText, 0, () => {
        StartTextAnimation();
    });
};

class Landing extends Component {
    componentDidMount() {
        // start the text animation
        StartTextAnimation();
    }

    scrollToRef = id => {
        let offset = document.getElementById(id).offsetTop;
        window.scrollTo({
            top: offset,
            behavior: "smooth"
        });
    };

    redirect = link => {
        if (this.props.isAuthenticated) {
            window.location = link;
        } else {
            this.props.toggleLoginModal(true);
        }
    };

    render() {
        const settings = {
            fade: true,
            infinite: true,
            autoplay: true,
            speed: 2000,
            autoplaySpeed: 5000,
            adaptiveHeight: true,
            arrows: false
        };

        // console.log("Verified:", this.props.verified);

        return (
            <DocumentTitle title="Главная страница Qlabs">
                <div>
                    <div className="landing-carousel">
                        <Slider ref={c => (this.slider = c)} {...settings}>
                            <img alt="" className="landing-img" src={carousel1} />
                            <img alt="" className="landing-img" src={carousel2} />
                            <img alt="" className="landing-img" src={carousel3} />
                        </Slider>
                        <div className="landing-section-centered">
                            <div className="landing-carousel-header">
                                <div className="landing-carousel-header-insert" />
                                <div className="landing-carousel-header-text">Quality Education</div>
                                <div className="landing-carousel-header-subtext">
                                    Мы - полностью онлайн образовательный центр
                                </div>
                                <div className="landing-carousel-header-subtext">
                                    Проходите курсы прямо на сайте и Поступайте в университет с нами!
                                </div>
                            </div>
                            <button
                                className="landing-section-centered-button"
                                onClick={() => {
                                    if (this.props.isAuthenticated) {
                                        window.location = this.props.role === "admin" ? "/admin" : "/dashboard";
                                    } else {
                                        this.props.toggleLoginModal(true);
                                    }
                                }}
                            >
                                Купить курсы
                            </button>
                        </div>
                        <div className="landing-section-bottom">
                            <span>Аналог NUFYPET от Qlabs!</span>
                            <div className="landing-section-bottom-arrow">
                                <svg
                                    width="40"
                                    height="16"
                                    viewBox="0 0 94 20"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                    style={{ cursor: "pointer" }}
                                    onClick={() => this.scrollToRef("test")}
                                >
                                    <path d="M1 3L47.5 16.5L93 3" stroke="white" strokeWidth="6" />
                                </svg>
                            </div>
                        </div>
                    </div>
                    <div id="test" className="landing-section">
                        <img alt="" className="landing-img" src={landing2} />
                        <div className="landing-section-centered">
                            <div className="landing-section-centered-header">Проверь себя в NUFYPET уже сейчас!</div>
                            <div className="landing-section-centered-subheader">Пройди аналог NUFYPET'а от Qlabs!</div>
                            <div className="landing-section-centered-subheader">
                                После покупки, экзамен будет открыт для вас с 16 февраля 12:00 по 17 февраля 23:59
                            </div>
                            <button
                                className="landing-section-centered-button"
                                onClick={() => {
                                    if (this.props.isAuthenticated) {
                                        window.location = this.props.role === "admin" ? "/admin" : "/dashboard";
                                    } else {
                                        this.props.toggleLoginModal(true);
                                    }
                                }}
                            >
                                Приобрести тест!
                            </button>
                        </div>
                        <div className="landing-section-bottom">
                            <ul className="landing-list">
                                <li className="landing-list-li">
                                    <i className="landing-list-number">1</i>
                                    <p className="landing-list-text">Выбери свои предметы</p>
                                </li>
                                <li className="landing-list-li">
                                    <i className="landing-list-number">2</i>
                                    <p className="landing-list-text">Оформи покупку</p>
                                </li>
                                <li className="landing-list-li">
                                    <i className="landing-list-number">3</i>
                                    <p className="landing-list-text">Ощути полноценный 2-х часовой экзамен</p>
                                </li>
                            </ul>
                        </div>
                        <div className="landing-section-bottom">
                            <span>Что ты получишь от Quality Education?</span>
                            <div className="landing-section-bottom-arrow">
                                <svg
                                    width="40"
                                    height="16"
                                    viewBox="0 0 94 20"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                    style={{ cursor: "pointer" }}
                                    onClick={() => this.scrollToRef("about")}
                                >
                                    <path d="M1 3L47.5 16.5L93 3" stroke="white" strokeWidth="4" />
                                </svg>
                            </div>
                        </div>
                    </div>
                    <div id="about" className="landing-section">
                        <img alt="" className="landing-img landing-section-img-dark" src={landing3} />
                        <div className="landing-section-centered">
                            <div className="landing-point-wrapper">
                                <div className="landing-point-block-header">О наших курсах</div>
                                <div className="landing-point-block">
                                    <img alt="" className="landing-point-block-img" src={success} />
                                    <span>Успешные и опытные разработчики</span>
                                </div>
                                <div className="landing-point-block">
                                    <img alt="" className="landing-point-block-img" src={video} />
                                    <span>Информативные и занимательные видео</span>
                                </div>
                                <div className="landing-point-block">
                                    <img alt="" className="landing-point-block-img" src={contract} />
                                    <span>Познавательные лекции</span>
                                </div>
                                <div className="landing-point-block">
                                    <img alt="" className="landing-point-block-img" src={exam} />
                                    <span>Куизы для закрепления материала</span>
                                </div>
                                <div className="landing-point-block">
                                    <img alt="" className="landing-point-block-img" src={test} />
                                    <span>Имитация NUFYPET в режиме онлайн</span>
                                </div>
                            </div>
                            <button
                                className="landing-section-centered-button"
                                onClick={() => {
                                    // console.log("Clicked register");
                                    this.props.toggleRegisterModal(true);
                                }}
                            >
                                Register!
                            </button>
                        </div>
                        <div className="landing-section-bottom">
                            <span>Посмотри список курсов!</span>
                            <div className="landing-section-bottom-arrow">
                                <svg
                                    width="40"
                                    height="16"
                                    viewBox="0 0 94 20"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                    style={{ cursor: "pointer" }}
                                    onClick={() => this.scrollToRef("subjects")}
                                >
                                    <path d="M1 3L47.5 16.5L93 3" stroke="white" strokeWidth="4" />
                                </svg>
                            </div>
                        </div>
                    </div>
                    <div id="subjects" className="landing-section">
                        <img alt="" className="landing-img-no" src={six} />
                        <div className="landing-section-grid">
                            <div className="landing-section-grid-header">Готовьтесь к экзаменам с нами</div>
                            <div
                                className="landing-section-grid-box"
                                onClick={() => this.redirect("/dashboard/courses")}
                            >
                                <div>
                                    <img alt="" className="landing-section-grid-box-img" src={physics} />
                                </div>
                                <div>
                                    <span>Physics (10,000 тг)</span>
                                </div>
                            </div>
                            <div
                                className="landing-section-grid-box"
                                onClick={() => this.redirect("/dashboard/courses")}
                            >
                                <div>
                                    <img alt="" className="landing-section-grid-box-img" src={maths} />
                                </div>
                                <div>
                                    <span>Math (10,000 тг)</span>
                                </div>
                            </div>
                            <div
                                className="landing-section-grid-box"
                                onClick={() => this.redirect("/dashboard/courses")}
                            >
                                <div>
                                    <img alt="" className="landing-section-grid-box-img" src={chemistry} />
                                </div>
                                <div>
                                    <span>Chemistry (10,000 тг)</span>
                                </div>
                            </div>
                            <div
                                className="landing-section-grid-box"
                                onClick={() => this.redirect("/dashboard/courses")}
                            >
                                <div>
                                    <img alt="" className="landing-section-grid-box-img" src={biology} />
                                </div>
                                <div>
                                    <span>Biology (10,000 тг)</span>
                                </div>
                            </div>
                            <div
                                className="landing-section-grid-box"
                                onClick={() => this.redirect("/dashboard/courses")}
                            >
                                <div>
                                    <img alt="" className="landing-section-grid-box-img" src={critical} />
                                </div>
                                <div>
                                    <span style={{ width: "100%" }}>Critical Thinking (10,000 тг)</span>
                                </div>
                            </div>
                            <div
                                className="landing-section-grid-box"
                                onClick={() => this.redirect("/dashboard/courses")}
                            >
                                <div>
                                    <img alt="" className="landing-section-grid-box-img" src={practice} />
                                </div>
                                <div>
                                    <span style={{ width: "100%" }}>Пробный экзамен (1,000 тг)</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </DocumentTitle>
        );
    }
}

export default connect(
    store => ({
        isAuthenticated: !!store.user.user.email,
        role: store.user.user.scope
    }),
    {
        toggleLoginModal,
        toggleRegisterModal
    }
)(Landing);
