// modules
import React, { Component } from "react";
import FroalaEditor from "react-froala-wysiwyg";
// assets
import "froala-editor/js/froala_editor.pkgd.min.js";
import "froala-editor/js/plugins/image.min.js";
// styles
import { Button } from "semantic-ui-react";
import "froala-editor/css/froala_style.min.css";
import "froala-editor/css/froala_editor.pkgd.min.css";
import "font-awesome/css/font-awesome.css";
// components
// redux

class EditorComponent extends Component {
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

    editQuestion = () => {
        const r = window.confirm("Редактировать текст вопроса?");
        if (r) {
            this.props.onEdit(this.props.question, this.state.model);
        }
    };

    deleteQuestion = () => {
        const r = window.confirm("Удалить вопрос?");
        if (r) {
            this.props.onDelete(this.props.question);
        }
    };

    render() {
        const { model } = this.state;

        return (
            <div>
                <FroalaEditor
                    config={{
                        placeholderText: "Поле для вопроса",
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
                <Button primary size="small" style={{ marginTop: "1em" }} onClick={this.editQuestion}>
                    Редактировать текст вопроса
                </Button>
                <Button negative size="small" style={{ marginBottom: "2em" }} onClick={this.deleteQuestion}>
                    Удалить вопрос
                </Button>
            </div>
        );
    }
}

export default EditorComponent;
