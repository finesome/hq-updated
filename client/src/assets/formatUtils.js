import React from "react";

// bold text
export const bold = text => (
    <p>
        <b>{text}</b>
    </p>
);

// bolder text
export const bolder = (text, fontSize) => (
    <p style={{ fontSize: fontSize }}>
        <b>{text}</b>
    </p>
);

// italics text
export const italics = text => (
    <p>
        <i>{text}</i>
    </p>
);

// centered bold large text
export const header = (text, fontSize, fontWeight) => (
    <div style={{ textAlign: "center", fontSize: fontSize, fontWeight: fontWeight, lineHeight: 1.5, marginBottom: "1.5em" }}>
        {text}
    </div>
);

// bold name and standard value
export const property = (name, value) => (
    <p>
        <b>{name}: </b>
        {value}
    </p>
);

// format seconds into minutes and seconds
export const time = seconds => (
    <span>
        {Math.floor(seconds / 60)} мин. {seconds % 60} сек.
    </span>
);
