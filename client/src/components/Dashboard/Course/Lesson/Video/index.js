// modules
import React from "react";
// assets
// styles
import { Embed } from "semantic-ui-react";
import "./index.css";
// components
// redux

const Video = props => {
    return (
        <div className="dashboard-course-lesson-video-content">
            {props.video ? (
                <Embed
                    id={props.video}
                    iframe={{
                        allowFullScreen: true,
                    }}
                    source="vimeo"
                />
            ) : (
                <div>В этом уроке нет видео</div>
            )}
        </div>
    );
};

export default Video;
