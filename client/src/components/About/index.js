// modules
import React, { Component } from "react";
import { connect } from "react-redux";
import DocumentTitle from "react-document-title";
// assets
import aldiyar from "assets/images/aldiyar.jpg";
import anuar from "assets/images/anuar.jpg";
import birzhan from "assets/images/birzhan.jpg";
import dina from "assets/images/dina.jpg";
import madina from "assets/images/madina.jpg";
import mansur from "assets/images/mansur.jpg";
import minura from "assets/images/minura.jpg";
import nazerke from "assets/images/nazerke.jpg";
import nurlybek from "assets/images/nurlybek.jpg";
import zhansen from "assets/images/zhansen.jpg";
import { bold, property } from "assets/formatUtils";
// styles
import { Image } from "semantic-ui-react";
import "./index.css";
// components
// redux
import { logout } from "store/User";

class Courses extends Component {
    state = {
        courses: [],
        exams: [],
        enrolling: false,
        loading: false,
        showModal: false
    };

    componentDidMount() {
        this.mounted = true;
    }

    componentWillUnmount() {
        this.mounted = false;
    }

    render() {
        return (
            <DocumentTitle title="О нас">
                <div className="about-wrapper">
                    <div className="about-header">О нас</div>
                    <div className="about-block">
                        <Image bordered className="about-block-img" src={zhansen} />
                        <div className="about-block-text">
                            <h3>🔷 Cofounder, Tutor of Physics - Zhansen Akhmetov</h3>
                            <p>3rd year SEng student, Electrical Engineer</p>
                            <p>
                                <b>🌀 Achievements:</b>
                            </p>
                            <ul className="about-block-text-list-dots">
                                <li>ABC Hackathon 2018, Astana: Winner of 1st place</li>
                                <li>ABC Quick Start: Finalist</li>
                                <li>Winner of Olympiads in Physics</li>
                            </ul>
                            <p>
                                <b>🌐 Experience:</b>
                            </p>
                            <ul className="about-block-text-list">
                                <li>🔅 Internship in the company “Business and Technology Services” 2018. </li>
                                <li>🔅 Worked in the educational company “iPrep”. </li>
                                <li>🔅 Currently assisting 2 Researches in the area of Power Electronics in NU. </li>
                                <li>🔅 3-year experience of teaching Physics, Math. </li>
                            </ul>
                            <p>
                                <b>🎯 MOTTO: </b>“Each of us has the power to change the world 🌎”
                            </p>
                        </div>
                    </div>
                    <div className="about-block">
                        <Image bordered className="about-block-img" src={anuar} />
                        <div className="about-block-text">
                            <h3>✅ Cofounder, Tutor of Maths - Anuar Akhynov </h3>
                            <p>3rd year SEng student</p>
                            <ul className="about-block-text-list-dots">
                                <li>Semey KTL Graduate’15</li>
                                <li>School of Economics (London University, KBTU)’16</li>
                                <li>Winner of hackaton, and grant accelerators.</li>
                            </ul>
                        </div>
                    </div>
                    <div className="about-block">
                        <Image bordered className="about-block-img" src={aldiyar} />
                        <div className="about-block-text">
                            <h3>✅Tutor of Mathematics - Aldiyar Kuntubek</h3>
                            <p>3rd year Chemical and Materials Engineering student</p>
                            <ul className="about-block-text-list">
                                <li>🔅3rd place Winner of Republican Science Olympiad in Math </li>
                                <li>🔅Summer Intern in Lawrence Berkeley National Laboratory, Berkeley, California</li>
                                <li>🔅2-year teaching experience of Math Olympiad </li>
                                <li>🌀learning to play dombra</li>
                                <li>🌀Play football and read books</li>
                            </ul>
                        </div>
                    </div>
                    <div className="about-block">
                        <Image bordered className="about-block-img" src={birzhan} />
                        <div className="about-block-text">
                            <h3>🔷Tutor of Biology - Birzhan Abdikhan</h3>
                            <p>2nd year student of Biological Sciences</p>
                            <p>
                                <b>Trivia:</b>
                            </p>
                            <ul className="about-block-text-list-dots">
                                <li>Teacher of Biology in “Zhas camp” summer school</li>
                                <li>Assistant in research on Transgenic plants</li>
                            </ul>
                            <p>
                                <b>🎯 MOTTO: </b>“It is never too late to get prepared”
                            </p>
                        </div>
                    </div>
                    <div className="about-block">
                        <Image bordered className="about-block-img" src={madina} />
                        <div className="about-block-text">
                            <h3>✅Tutor of Critical Thinking - Madina Kazhen</h3>
                            <p>2nd year Student of SHSS, Economics with minor in Math</p>
                            <ul className="about-block-text-list">
                                <li>🔅Graduate from gymnasium’16</li>
                                <li>🔅Prizes in chemistry, geography Olympiads</li>
                                <li>🔅Assisting Research in Sociology</li>
                                <li>🔅2-year experience of teaching IELTS and Critical Thinking</li>
                                <li>🔅Interested in Spanish and French languages</li>
                            </ul>
                            <p>
                                <b>MOTTO: </b>“Be the better of you every day!”
                            </p>
                        </div>
                    </div>
                    <div className="about-block">
                        <Image bordered className="about-block-img" src={dina} />
                        <div className="about-block-text">
                            <h3>✅ Tutor of critical thinking - Dina Baigurmanova</h3>
                            <p>2nd year SHSS Economics student</p>
                            <ul className="about-block-text-list">
                                <li>⭐ Prizes in English olympiads</li>
                                <li>⭐ Was awarded at the contest of essays among NIS students</li>
                                <li>⭐ “Work and Travel-2018” program participant</li>
                                <li>⭐ 2 years experience of teaching IELTS</li>
                                <li>⭐ Interested in French and German languages</li>
                            </ul>
                        </div>
                    </div>
                    <div className="about-block">
                        <Image bordered className="about-block-img" src={nazerke} />
                        <div className="about-block-text">
                            <h3>🌀 Tutor of Critical Thinking - Nazerke Amangeldiyeva</h3>
                            <p>2 year SHSS Economics Student</p>
                            <ul className="about-block-text-list">
                                <li>🔅3-year experience in tutoring IELTS and Critical Thinking</li>
                                <li>🔅Speaks Chinese, learning Italian</li>
                                <li>🔅Loves acting and literature</li>
                            </ul>
                            <p>
                                <b>MOTTO: </b>“Do one thing everyday that scares you.”
                            </p>
                        </div>
                    </div>
                    <div className="about-block">
                        <Image bordered className="about-block-img" src={mansur} />
                        <div className="about-block-text">
                            <h3>Tutor of Chemistry - Mansur Alibekov</h3>
                            <p>NUFYP student</p>
                            <ul className="about-block-text-list">
                                <li>🛡️ Winner and Prize-winner of National Chemistry Olympiad - 4 years</li>
                                <li>🛡️ Honourauble mention of Mendeleyev International Olympiad - 2017</li>
                                <li>🛡️ Member of the jury in Regional Chemistry Olympiad - 2019</li>
                                <li>🛡️ Participant of International Science Camp in Ulsan, UNIST, South Korea</li>
                                <li>📚 1- year experience of teaching chemistry</li>
                                <li>📚 Play football and read books</li>
                            </ul>
                        </div>
                    </div>
                    <div className="about-block">
                        <Image bordered className="about-block-img" src={nurlybek} />
                        <div className="about-block-text">
                            <h3>Tutor of Chemistry - Nurlybek Kattabayev</h3>
                            <p>NUFYP student</p>
                            <ul className="about-block-text-list-dots">
                                <li>Semey KTL Graduate '18</li>
                                <li>Medalist of the Republican Olympiad</li>
                            </ul>
                        </div>
                    </div>
                    <div className="about-block">
                        <Image bordered className="about-block-img" src={minura} />
                        <div className="about-block-text">
                            <h3>Tutor of Biology - Minura Kypshakbayeva</h3>
                            <p>NUFYP student</p>
                            <ul className="about-block-text-list-dots">
                                <li>NIS Aktobe Graduate'18</li>
                                <li>Winner of Biology Olympiads </li>
                                <li>Winner of International competition "The Big Progress" place</li>
                                <li>Interested in Medicine</li>
                                <li>Playing volleyball, singing, running, reading books.</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </DocumentTitle>
        );
    }
}

export default connect(
    store => ({}),
    {}
)(Courses);
