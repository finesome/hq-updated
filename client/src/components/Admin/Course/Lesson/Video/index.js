// modules
import React, { Component } from "react";
import axios from "axios";
// assets
import { bold, header } from "assets/formatUtils";
import { adminRoutes } from "assets/routes";
// styles
import { Input } from "semantic-ui-react";
// components
// redux

class Video extends Component {
    state = {
        video: this.props.video ? this.props.video : "",
        // percentCompleted: 0,
        // uploading: false,
    };

    shouldComponentUpdate(nextProps, nextState) {
        if (this.props !== nextProps) {
            return false;
        }
        return true;
    }

    handleChange = (e, data) => {
        this.setState({
            [data.name]: data.value,
        });
    };

    handleUploadVideo = async event => {
        // request config
        const config = {
            headers: {
                "Content-Type": "multipart/form-data",
            },
            onUploadProgress: progressEvent => {
                let percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                this.setState({ percentCompleted: percentCompleted });
            },
        };
        // create a new form data
        const data = new FormData();
        // append file
        const file = event.target.files[0];
        if (!file) {
            alert("Файл не указан, попробуйте снова");
            return;
        }
        data.append("file", file, file.name);
        this.setState({ uploading: true });
        // axios call
        await axios
            .post(adminRoutes.uploadVideo(this.props.courseId, this.props.lessonId), data, config)
            .then(response => {
                this.setState({ percentCompleted: 0, video: response.data.message, uploading: false });
            })
            .catch(error => {
                this.setState({ percentCompleted: 0, video: "", uploading: false });
                console.error("Error:", error.response);
                alert("Ошибка загрузки видео");
                // if (error.response.status === 413) {
                //     alert("Размер видео слишком большой");
                // }
            });
    };

    render() {
        return (
            <div>
                {header("Видео", 20, "bold")}
                {/* {this.props.lessonId ? (
                    <Message info>Можно указать ссылку на видео либо загрузить его с компьютера</Message>
                ) : (
                    <Message info>Загрузить видео можно только в уже созданный урок</Message>
                )} */}
                {bold("Vimeo ID")}
                <Input
                    fluid
                    name="video"
                    value={this.state.video}
                    onChange={this.handleChange}
                    style={{ marginBottom: "1em" }}
                />
                {/* {this.props.lessonId ? (
                    <div>
                        {bold("Загрузить видео")}
                        <div style={{ marginBottom: "1em", padding: "8px" }}>
                            <input type="file" accept="video/mp4,video/x-m4v,video/*" onChange={this.handleUploadVideo} />
                        </div>
                        {this.state.uploading ? (
                            <div style={{ marginBottom: "1em" }}>
                                {bold("Прогресс")}
                                <Progress percent={this.state.percentCompleted} indicating progress />
                            </div>
                        ) : null}
                    </div>
                ) : null} */}
            </div>
        );
    }
}

export default Video;
