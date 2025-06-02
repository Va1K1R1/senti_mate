import React from "react";
import "./Button.css";

const Button = ({ text, onClick, type = "default" }) => {
    return (
        <button className={`Button Button_${type}`} onClick={onClick}>
            {text}
        </button>
    );
};

export default Button;
