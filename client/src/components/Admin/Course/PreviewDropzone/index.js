// modules
import React, { Component } from "react";
import Dropzone from "react-dropzone";
// assets
// styles
import { Image } from "semantic-ui-react";
// components
// redux

const baseStyle = {
    padding: 24,
    width: "100%",
    borderWidth: 1,
    borderColor: "#c9c9c9",
    borderStyle: "solid",
    borderRadius: 4,
    textAlign: "center",
};
const activeStyle = {
    borderStyle: "solid",
    borderColor: "#6c6",
};
const rejectStyle = {
    borderStyle: "solid",
    borderColor: "#c66",
};
const thumb = {
    marginTop: 16,
    textAlign: "center",
};

class PreviewDropzone extends Component {
    state = {
        files: [],
    };

    onDrop = files => {
        if (files.length > 1) {
            alert("Выберите только один файл");
            return;
        }
        // send to parent component
        this.props.handleDrop(files[0]);
        // set blob URLs
        this.setState({
            files: files.map(file =>
                Object.assign(file, {
                    preview: URL.createObjectURL(file),
                })
            ),
        });
    };

    componentWillUnmount() {
        // Make sure to revoke the data uris to avoid memory leaks
        this.state.files.forEach(file => URL.revokeObjectURL(file.preview));
    }

    render() {
        const { files } = this.state;

        const thumbs = files.map(file => (
            <div style={thumb} key={file.name}>
                <p>Предпросмотр:</p>
                <Image alt="" centered src={file.preview} size="small" />
            </div>
        ));

        return (
            <Dropzone accept="image/*" onDrop={this.onDrop}>
                {({ getRootProps, getInputProps, isDragActive, isDragAccept, isDragReject, acceptedFiles, rejectedFiles }) => {
                    let styles = { ...baseStyle };
                    styles = isDragActive ? { ...styles, ...activeStyle } : styles;
                    styles = isDragReject ? { ...styles, ...rejectStyle } : styles;
                    return (
                        <div {...getRootProps()} style={styles}>
                            <input {...getInputProps()} />
                            <div>{isDragAccept ? "Можете отпускать" : "Нажмите или перетащите сюда файл"}</div>
                            {isDragReject && <div>Формат файла на поддерживается...</div>}
                            {thumbs}
                        </div>
                    );
                }}
            </Dropzone>
        );
    }
}

export default PreviewDropzone;
