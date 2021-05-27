// modules
import React, { Component } from "react";
import FroalaEditor from "react-froala-wysiwyg";
// assets
import { header } from "assets/formatUtils";
import "froala-editor/js/froala_editor.pkgd.min.js";
import "froala-editor/js/plugins/image.min.js";
// styles
import "froala-editor/css/froala_style.min.css";
import "froala-editor/css/froala_editor.pkgd.min.css";
import "font-awesome/css/font-awesome.css";
// components
// redux

class Lecture extends Component {
    state = {
        model: this.props.lecture,
    };

    handleChange = model => {
        this.setState(
            {
                model: model,
            },
            () => {
                console.log(this.state.model);
            }
        );
    };

    shouldComponentUpdate(nextProps, nextState) {
        if (this.props !== nextProps) {
            return false;
        }
        return true;
    }

    render() {
        return (
            <div>
                {header("Лекция", 20, "bold")}
                <FroalaEditor
                    config={{
                        placeholderText: "Вводите текст лекции",
                        imageUploadURL: "/api/admin/image",
                        imageUploadMethod: "POST",
                        events: {
                            "froalaEditor.image.error": (e, editor, error) => {
                                console.log(error);
                            },
                        },
                    }}
                    tag="textarea"
                    model={this.state.model}
                    onModelChange={this.handleChange}
                />
            </div>
        );
    }
}

export default Lecture;
