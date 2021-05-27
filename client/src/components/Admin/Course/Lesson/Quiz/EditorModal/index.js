// modules
import React, { Component } from "react";
import FroalaEditor from "react-froala-wysiwyg";
// assets
import "froala-editor/js/froala_editor.pkgd.min.js";
import "froala-editor/js/plugins/image.min.js";
// styles
import { Button, Modal } from "semantic-ui-react";
import "froala-editor/css/froala_style.min.css";
import "froala-editor/css/froala_editor.pkgd.min.css";
import "font-awesome/css/font-awesome.css";
// components
// redux

class EditorModal extends Component {
    state = {
        model: this.props.model,
    };

    componentDidUpdate(prevProps, prevState) {
        if (prevProps.model !== this.props.model) {
            this.setState({ model: this.props.model });
        }
    }

    handleModel = model => {
        this.setState({ model: model });
    };

    editOption = () => {
        const r = window.confirm("Редактировать этот вариант ответа?");
        if (r) {
            this.props.onEdit(this.props.question, this.props.option, this.state.model);
        }
    };

    render() {
        const { model } = this.state;

        return (
            <Modal size="small" open={this.props.open} onClose={this.props.onClose}>
                <Modal.Header>
                    <p style={{ fontSize: "20px" }}>Редактирование варианта ответа</p>
                </Modal.Header>
                <Modal.Content>
                    <FroalaEditor
                        config={{
                            placeholderText: "Поле для варианта ответа",
                            imageUploadURL: "/api/admin/image",
                            imageUploadMethod: "POST",
                            events: {
                                "froalaEditor.image.error": (e, editor, error) => {
                                    console.log(error);
                                },
                            },
                        }}
                        tag="textarea"
                        model={model}
                        onModelChange={this.handleModel}
                    />
                </Modal.Content>
                <Modal.Actions>
                    <Button negative content="Отменить" size="small" onClick={this.props.onClose} />
                    <Button
                        primary
                        icon="checkmark"
                        labelPosition="right"
                        content="Изменить"
                        size="small"
                        onClick={this.editOption}
                    />
                </Modal.Actions>
            </Modal>
        );
    }
}

export default EditorModal;
