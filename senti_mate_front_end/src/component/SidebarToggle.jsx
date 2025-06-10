import React from "react";
import "./SidebarToggle.css";

const SidebarToggle = ({ toggleSidebar }) => {
    return (
        <button className="SidebarToggle" onClick={toggleSidebar} aria-label="Toggle sidebar">
            <div className="SidebarToggleIcon">
                <span></span>
                <span></span>
                <span></span>
            </div>
        </button>
    );
};

export default SidebarToggle;