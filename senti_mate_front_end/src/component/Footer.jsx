import React from "react";
import "./Footer.css";

const Footer = () => {
    return (
        <footer className="Footer">
            <div className="FooterContent">
                <div className="FooterSection">
                    <h3>SentiMate</h3>
                    <p>Your personal health diary companion</p>
                </div>
                <div className="FooterSection">
                    <h3>Quick Links</h3>
                    <ul>
                        <li><a href="/">Home</a></li>
                        <li><a href="/diary">Diary</a></li>
                        <li><a href="/todo">Todo</a></li>
                    </ul>
                </div>
                <div className="FooterSection">
                    <h3>Contact</h3>
                    <p>Email: support@sentimate.com</p>
                    <p>Phone: +1 (123) 456-7890</p>
                </div>
            </div>
            <div className="FooterBottom">
                <p>&copy; {new Date().getFullYear()} SentiMate. All rights reserved.</p>
            </div>
        </footer>
    );
};

export default Footer;