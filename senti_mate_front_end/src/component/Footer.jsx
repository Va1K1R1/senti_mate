import React from "react";
import "./Footer.css";

const Footer = () => {
    return (
        <footer className="Footer">
            <div className="FooterContent">
                <div className="FooterSection">
                    <h3 style={{ color: "#ffffff" }}>SentiMate</h3>
                    <p>A weary and exhausting day,<br/>
                        with an emotional partner who understands <br/>without words.
                    </p>
                </div>
                <div className="FooterSection">
                    <h3 style={{ color: "#ffffff" }}>Quick Links</h3>
                    <ul>
                        <li><a href="/">Home</a></li>
                        <li><a href="/diary">Diary</a></li>
                        <li><a href="/todo">Todo</a></li>
                    </ul>
                </div>
                <div className="FooterSection">
                    <h3 style={{ color: "#ffffff" }}>Contact</h3>
                    <p>Email: realisshobeen@naver.com</p>
                    <p>Phone: +82 010-6649-8606</p>
                </div>
            </div>
            <div className="FooterBottom">
                <p>&copy; {new Date().getFullYear()} SentiMate. All rights reserved.</p>
            </div>
        </footer>
    );
};

export default Footer;