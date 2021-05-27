// modules
import React, { Component } from "react";
import { connect } from "react-redux";
import DocumentTitle from "react-document-title";
import axios from "axios";
import crypto from "crypto";
import nanoid from "nanoid";
// assets
import none from "assets/images/none.jpg";
import { header, property } from "assets/formatUtils";
import { dashboardRoutes } from "assets/routes";
// styles
import { Button, Grid, Header, Image, Loader, Modal, Responsive, Segment, Icon } from "semantic-ui-react";
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
        // get exams
        this.getExams();
        // get courses
        this.getCourses();
    }

    componentWillUnmount() {
        this.mounted = false;
    }

    getExams = async () => {
        this.setState({ loading: true });
        // axios call
        const response = await axios.get(dashboardRoutes.getExams()).catch(() => {
            if (this.mounted) {
                this.setState({ loading: false });
                this.props.logout();
            }
        });
        console.log(response.data.message);
        // set exams
        if (!!response && this.mounted) {
            // console.log(response.data.message);
            this.setState({ loading: false, exams: response.data.message });
        }
    };

    getCourses = async () => {
        if (this.mounted) {
            this.setState({ loading: true });
        }
        // axios call
        const response = await axios.get(dashboardRoutes.getCourses()).catch(error => {
            if (this.mounted) {
                this.setState({ loading: false });
            }
            console.error(error);
            this.props.logout();
        });
        if (!!response && this.mounted) {
            // set courses to state
            this.setState({ loading: false, courses: response.data.message });
        }
    };

    openModal = (id, title) => {
        this.setState({ showModal: true, purchaseCourseId: id, purchaseCourseTitle: title });
    };

    closeModal = () => {
        this.setState({ showModal: false, purchaseCourseId: "", purchaseCourseTitle: "" });
    };

    enroll = () => {
        // this.setState({ enrolling: true });
        // // axios call
        // axios
        //     .post(dashboardRoutes.enroll(id))
        //     .then(() => {
        //         this.setState({ enrolling: false });
        //         this.getCourses();
        //     })
        //     .catch(error => {
        //         this.setState({ enrolling: false });
        //         console.error(error);
        //     });

        let data = {
            merchant_id: "513178",
            amount: "10000",
            currency: "KZT",
            description: this.state.purchaseCourseTitle,
            salt: nanoid(16),
            user_id: this.props.user._id,
            course_id: this.state.purchaseCourseId,
            secret: "emslpJYMvPFQ0vW1"
        };

        let url = `https://api.paybox.money/payment.php?pg_merchant_id=${data.merchant_id}&pg_amount=${
            data.amount
        }&pg_currency=${data.currency}&pg_description=${data.description}&pg_salt=${data.salt}&user_id=${
            data.user_id
        }&course_id=${data.course_id}`;
        let sig = crypto
            .createHash("md5")
            .update(
                `payment.php;${data.course_id};${data.amount};${data.currency};${data.description};${
                    data.merchant_id
                };${data.salt};${data.user_id};${data.secret}`
            )
            .digest("hex");
        url += `&pg_sig=${sig}`;

        window.location = url;
    };

    enrollToExam = (examId, examTitle, price) => {
        let r = window.confirm(
            `Стоимость экзамена - ${price} тг. Не передавайте ваш аккаунт другим пользователям! В случае открытия экзамена со второго устройства, ваша сессия может быть заблокирована. Вы уверены что хотите приобрести его?`
        );
        if (r) {
            let data = {
                merchant_id: "513178",
                amount: price,
                currency: "KZT",
                description: examTitle,
                salt: nanoid(16),
                user_id: this.props.user._id,
                exam_id: examId,
                secret: "emslpJYMvPFQ0vW1"
            };

            let url = `https://api.paybox.money/payment.php?pg_merchant_id=${data.merchant_id}&pg_amount=${
                data.amount
            }&pg_currency=${data.currency}&pg_description=${data.description}&pg_salt=${data.salt}&user_id=${
                data.user_id
            }&exam_id=${data.exam_id}`;
            let sig = crypto
                .createHash("md5")
                .update(
                    `payment.php;${data.exam_id};${data.amount};${data.currency};${data.description};${
                        data.merchant_id
                    };${data.salt};${data.user_id};${data.secret}`
                )
                .digest("hex");
            url += `&pg_sig=${sig}`;

            window.location = url;
        }
    };

    redirect = link => {
        window.location = link;
    };

    render() {
        let exams = [];
        let courses = [];
        exams = this.state.exams.filter(exam => !exam.hidden || exam.paid);
        exams = exams.map((exam, i) => (
            <Segment color="blue" className="dashboard-courses-course" key={`dashboard-exams-exam-${i}`} padded>
                <p className="dashboard-courses-course-title">{exam.title}</p>
                <div className="dashboard-courses-course-text">
                    {property("Предмет", exam.subject)}
                    {property("Описание", exam.description ? exam.description : "не указано")}
                </div>
                {exam.paid ? (
                    <div>
                        <Button
                            content={
                                exam.purchased
                                    ? exam.answered
                                        ? "Экзамен уже пройден"
                                        : exam.hidden
                                        ? "Вы приобрели этот экзамен, но он пока еще не доступен"
                                        : "Перейти к экзамену"
                                    : `Приобрести экзамен (${exam.price} тг)`
                            }
                            disabled={(exam.hidden && exam.purchased) || exam.answered}
                            floated="right"
                            icon="right arrow"
                            labelPosition="right"
                            positive
                            size="small"
                            onClick={
                                exam.purchased
                                    ? () => this.redirect(`/dashboard/exams/${exam._id}`)
                                    : () => this.enrollToExam(exam._id, exam.title, exam.price)
                            }
                        />
                    </div>
                ) : (
                    <Button
                        content={exam.answered ? "Экзамен уже пройден" : "Перейти к экзамену"}
                        disabled={exam.answered}
                        floated="right"
                        icon="right arrow"
                        labelPosition="right"
                        positive
                        size="small"
                        onClick={() => this.redirect(`/dashboard/exams/${exam._id}`)}
                    />
                )}
            </Segment>
        ));
        courses = this.state.courses.map((course, i) => (
            <Segment color="blue" className="dashboard-courses-course" key={`dashboard-courses-course-${i}`} padded>
                <Responsive minWidth={850}>
                    <Grid columns={2}>
                        <Grid.Column width={3}>
                            <p className="dashboard-courses-course-title">{course.title}</p>
                            <Image
                                alt=""
                                circular
                                src={course.logo ? course.logo : none}
                                size="small"
                                style={{ marginBottom: "1em" }}
                            />
                        </Grid.Column>
                        <Grid.Column width={9}>
                            <div className="dashboard-courses-course-text">
                                {property("Категория", course.category)}
                                {property("Описание", course.description ? course.description : "не указано")}
                            </div>
                        </Grid.Column>
                        <Grid.Column width={4} verticalAlign="bottom">
                            {!!course.enrolled ? (
                                <Button
                                    content="Курс уже куплен"
                                    disabled
                                    floated="right"
                                    primary
                                    style={{ marginBottom: "1em" }}
                                />
                            ) : (
                                <Button
                                    content="Приобрести курс (10,000 тг)"
                                    floated="right"
                                    primary
                                    onClick={() => this.openModal(course._id, course.title)}
                                    style={{ marginBottom: "1em" }}
                                />
                            )}
                            <Button
                                content={!!course.enrolled ? "Перейти к курсу" : "Пробная версия"}
                                floated="right"
                                icon="right arrow"
                                labelPosition="right"
                                positive
                                onClick={() => this.redirect(`/dashboard/courses/${course._id}`)}
                            />
                        </Grid.Column>
                    </Grid>
                </Responsive>
                <Responsive maxWidth={850} minWidth={600}>
                    <Grid columns={2}>
                        <Grid.Column width={4}>
                            <p className="dashboard-courses-course-title">{course.title}</p>
                            <Image
                                alt=""
                                circular
                                src={course.logo ? course.logo : none}
                                size="tiny"
                                style={{ marginBottom: "1em" }}
                            />
                        </Grid.Column>
                        <Grid.Column width={8}>
                            <div className="dashboard-courses-course-text">
                                {property("Категория", course.category)}
                                {property("Описание", course.description ? course.description : "не указано")}
                            </div>
                        </Grid.Column>
                        <Grid.Column width={4} verticalAlign="bottom">
                            {!!course.enrolled ? (
                                <Button
                                    content="Курс уже куплен"
                                    disabled
                                    floated="right"
                                    primary
                                    size="tiny"
                                    style={{ marginBottom: "1em" }}
                                />
                            ) : (
                                <Button
                                    content="Приобрести курс (10,000 тг)"
                                    floated="right"
                                    primary
                                    onClick={() => this.openModal(course._id, course.title)}
                                    size="tiny"
                                    style={{ marginBottom: "1em" }}
                                />
                            )}
                            <Button
                                content={!!course.enrolled ? "Перейти к курсу" : "Пробная версия"}
                                floated="right"
                                icon="right arrow"
                                labelPosition="right"
                                positive
                                size="tiny"
                                onClick={() => this.redirect(`/dashboard/courses/${course._id}`)}
                            />
                        </Grid.Column>
                    </Grid>
                </Responsive>
                <Responsive maxWidth={600}>
                    <p className="dashboard-courses-course-title">{course.title}</p>
                    <Grid columns={2}>
                        <Grid.Column width={4}>
                            <Image
                                alt=""
                                circular
                                src={course.logo ? course.logo : none}
                                size="small"
                                style={{ marginBottom: "1em" }}
                            />
                        </Grid.Column>
                        <Grid.Column width={12}>
                            <div className="dashboard-courses-course-text">
                                {property("Категория", course.category)}
                                {property("Описание", course.description ? course.description : "не указано")}
                            </div>
                        </Grid.Column>
                    </Grid>
                    {!!course.enrolled ? (
                        <Button
                            content="Курс уже куплен"
                            disabled
                            floated="right"
                            primary
                            size="tiny"
                            style={{ marginBottom: "1em" }}
                        />
                    ) : (
                        <Button
                            content="Приобрести курс (10,000 тг)"
                            floated="right"
                            primary
                            onClick={() => this.openModal(course._id, course.title)}
                            size="tiny"
                            style={{ marginBottom: "1em" }}
                        />
                    )}
                    <Button
                        content={!!course.enrolled ? "Перейти к курсу" : "Пробная версия"}
                        floated="right"
                        icon="right arrow"
                        labelPosition="right"
                        positive
                        size="tiny"
                        onClick={() => this.redirect(`/dashboard/courses/${course._id}`)}
                    />
                </Responsive>
            </Segment>
        ));

        return (
            <DocumentTitle title="Курсы">
                <div className="dashboard-courses-wrapper">
                    <Modal basic open={this.state.showModal} size="small">
                        <Header icon="money bill alternate" content="Купить курс" />
                        <Modal.Content>
                            <p>
                                Стоимость курса - 10,000 тг. Курс будет доступен для вас 1 месяц - 30 дней с момента
                                покупки. Количество устройств для входа с одного аккаунта - 2.
                            </p>
                        </Modal.Content>
                        <Modal.Actions>
                            <Button basic color="red" inverted onClick={this.closeModal}>
                                <Icon name="remove" />
                                Отмена
                            </Button>
                            <Button color="green" inverted onClick={this.enroll}>
                                <Icon name="checkmark" />
                                Купить
                            </Button>
                        </Modal.Actions>
                    </Modal>
                    <div className="dashboard-courses-header">Мои курсы</div>
                    {this.state.loading ? (
                        <Loader active size="large" />
                    ) : (
                        <div>
                            {header("Пробные экзамены", 16, "bold")}
                            <div className="dashboard-courses-holder">{exams}</div>
                            {header("Курсы", 16, "bold")}
                            <div className="dashboard-courses-holder">{courses}</div>
                        </div>
                    )}
                </div>
            </DocumentTitle>
        );
    }
}

export default connect(
    store => ({
        isAuthenticated: !!store.user.user.email,
        user: store.user.user
    }),
    {
        logout
    }
)(Courses);
