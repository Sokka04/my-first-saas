"use client";
import { useEffect, useState } from "react";

export default function TopHeader() {
    const [theme, setTheme] = useState<"light" | "dark">("light");

    useEffect(() => {
        // Init theme from localStorage on mount
        const savedTheme = window.localStorage.getItem("skoolis-theme");
        const currentTheme = savedTheme === "dark" ? "dark" : "light";
        
        setTheme(currentTheme);
        if (currentTheme === "dark") {
            document.documentElement.setAttribute("data-theme", "dark");
            document.querySelector('.container')?.setAttribute("data-theme", "dark");
        } else {
            document.documentElement.removeAttribute("data-theme");
            document.querySelector('.container')?.removeAttribute("data-theme");
        }
    }, []);

    const toggleTheme = () => {
        const newTheme = theme === "dark" ? "light" : "dark";
        setTheme(newTheme);
        
        if (newTheme === "dark") {
            document.documentElement.setAttribute("data-theme", "dark");
            document.querySelector('.container')?.setAttribute("data-theme", "dark");
        } else {
            document.documentElement.removeAttribute("data-theme");
            document.querySelector('.container')?.removeAttribute("data-theme");
        }
        
        // Save to localStorage
        window.localStorage.setItem("skoolis-theme", newTheme);
        // Save to cookie
        document.cookie = "skoolis-theme=" + newTheme + "; path=/; max-age=31536000; SameSite=Lax";
    };

    return (
        <header className="top-header">
            <div className="header-left">
                <h2>Skoolis - Tableau de bord</h2>
                <p>Bienvenue dans votre espace de gestion scolaire</p>
            </div>
            <div className="header-right">
                <div className="search-box">
                    <i className="fas fa-search"></i>
                    <input type="text" placeholder="Rechercher..." />
                </div>
                <div className="header-icons">
                    <button className="icon-btn notification">
                        <i className="fas fa-bell"></i>
                        <span className="badge">3</span>
                    </button>
                    <button className="icon-btn">
                        <i className="fas fa-envelope"></i>
                        <span className="badge">5</span>
                    </button>
                    <button className="icon-btn" id="themeToggle" onClick={toggleTheme}>
                        <i className={`fas ${theme === "dark" ? "fa-sun" : "fa-moon"}`}></i>
                    </button>
                    <button className="icon-btn">
                        <i className="fa-solid fa-arrow-right-from-bracket"></i>
                    </button>
                </div>
            </div>
        </header>
    );
}
