// modules
import React from "react";
// assets
// styles
import { Container, Message } from "semantic-ui-react";
import "./index.css";
// components
// redux

const Home = props => (
    <Container>
        <div className="admin-home-header">Управление курсами</div>
        <Message info icon="question circle" content="Используй навигацию в левой части экрана" />
    </Container>
);

export default Home;
