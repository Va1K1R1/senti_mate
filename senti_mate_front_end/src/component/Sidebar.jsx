import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./Sidebar.css";

const Sidebar = ({ isOpen, toggleSidebar }) => {
    const [activeSection, setActiveSection] = useState("home");

    const handleSectionClick = (section) => {
        setActiveSection(section);
        // On mobile, close sidebar after selection
        if (window.innerWidth < 768) {
            toggleSidebar();
        }
    };

    return (
        <div className={`Sidebar ${isOpen ? "open" : ""}`}>
            <div className="SidebarHeader">
                <h2>SentiMate</h2>
                <button className="CloseButton" onClick={toggleSidebar}>
                    &times;
                </button>
            </div>
            
            <div className="SidebarContent">
                <div className="SidebarSection">
                    <h3>Navigation</h3>
                    <ul>
                        <li className={activeSection === "home" ? "active" : ""}>
                            <Link to="/" onClick={() => handleSectionClick("home")}>
                                <span className="icon">🏠</span> Home
                            </Link>
                        </li>
                        <li className={activeSection === "diary" ? "active" : ""}>
                            <Link to="/diary" onClick={() => handleSectionClick("diary")}>
                                <span className="icon">📔</span> Diary
                            </Link>
                        </li>
                        <li className={activeSection === "todo" ? "active" : ""}>
                            <Link to="/todo" onClick={() => handleSectionClick("todo")}>
                                <span className="icon">✅</span> Todo
                            </Link>
                        </li>
                    </ul>
                </div>
                
                <div className="SidebarSection">
                    <h3>Health Data</h3>
                    <ul>
                        <li className={activeSection === "steps" ? "active" : ""}>
                            <Link to="/health/steps" onClick={() => handleSectionClick("steps")}>
                                <span className="icon">👣</span> Steps
                            </Link>
                        </li>
                        <li className={activeSection === "sleep" ? "active" : ""}>
                            <Link to="/health/sleep" onClick={() => handleSectionClick("sleep")}>
                                <span className="icon">😴</span> Sleep
                            </Link>
                        </li>
                        <li className={activeSection === "heart" ? "active" : ""}>
                            <Link to="/health/heart" onClick={() => handleSectionClick("heart")}>
                                <span className="icon">❤️</span> Heart Rate
                            </Link>
                        </li>
                    </ul>
                </div>
                
                <div className="SidebarSection">
                    <h3>Account</h3>
                    <ul>
                        <li className={activeSection === "profile" ? "active" : ""}>
                            <Link to="/profile" onClick={() => handleSectionClick("profile")}>
                                <span className="icon">👤</span> Profile
                            </Link>
                        </li>
                        <li className={activeSection === "settings" ? "active" : ""}>
                            <Link to="/settings" onClick={() => handleSectionClick("settings")}>
                                <span className="icon">⚙️</span> Settings
                            </Link>
                        </li>
                        <li>
                            <a href="#" onClick={() => alert("Logout functionality not implemented yet")}>
                                <span className="icon">🚪</span> Logout
                            </a>
                        </li>
                    </ul>
                </div>
            </div>
            
            <div className="SidebarFooter">
                <p>Version 1.0.0</p>
            </div>
        </div>
    );
};

export default Sidebar;