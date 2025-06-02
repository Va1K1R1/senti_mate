import React from "react";
import "./Header.css";

const Header = ({ title, leftChild, rightChild }) => {
    return (
        <header className="Header">
            {leftChild && <div className="left-child">{leftChild}</div>}
            <h1 className="title">{title}</h1>
            {rightChild && <div className="right-child">{rightChild}</div>}
        </header>
    );
};

export default Header;
