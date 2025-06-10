import React from "react";
import { Link, useLocation } from "react-router-dom";
import "./Header.css";

const Header = ({ title, leftChild, rightChild }) => {
    const location = useLocation();
    const isHome = location.pathname === "/";

    return (
        <header className="Header">
            <div className="nav-left">
                {leftChild && <div className="left-child">{leftChild}</div>}
                {rightChild && <div className="right-child">{rightChild}</div>}
            </div>

            <div className="center-title">
                <h1 className="title">{title || "Senti Mate"}</h1>
            </div>

            {isHome && (
                <div className="nav-right">
                    <Link to="/login" className="nav-button">Login</Link>
                    <Link to="/register" className="nav-button">Register</Link>
                </div>
            )}
        </header>
    );
};

export default Header;
