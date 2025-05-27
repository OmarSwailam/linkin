import { Link, useLocation } from "@tanstack/react-router"
import ThemeToggle from "../ThemeToggle"
import Logo from "../Logo"
import "./Navbar.css"
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "@tanstack/react-router";
import { useState } from "react";

export default function Navbar() {
    const { isAuthenticated, user, logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const [isMenuOpen, setIsMenuOpen] = useState(false);


    const handleLogout = () => {
        logout();
        navigate({ to: "/login" });
        setIsMenuOpen(false);
    };

    const profileImage = user?.profile_image ? user.profile_image : "/profile-placeholder.png"

    return (
        <nav>
            <div className="nav-left">
                <Link to="/" className="logo-link"><Logo /></Link>
            </div>

            <div className="nav-right">
                {isAuthenticated ? (
                    <><Link to="/" className="link">Feed</Link>
                        <div className="profile-menu">
                            <button
                                className="profile-menu-button"
                                onClick={() => setIsMenuOpen(!isMenuOpen)}
                            >
                                <img src={profileImage} alt="profile image" className="profile-image" />
                                <span className="arrow-icon">
                                    <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px">
                                        <path d="M480-360 280-560h400L480-360Z" />
                                    </svg>
                                </span>
                            </button>

                            {isMenuOpen && (
                                <div className="dropdown-menu">
                                    <Link to="/profile" className="dropdown-item" onClick={() => setIsMenuOpen(false)}>
                                        Profile
                                    </Link>
                                    <ThemeToggle />
                                    <button onClick={handleLogout} className="dropdown-item logout-btn">
                                        Logout
                                    </button>
                                </div>
                            )}
                        </div></>
                ) : (
                    <>
                        <ThemeToggle />
                        <Link
                            to="/signup"
                            search={{ redirect: location.pathname }}
                            className="link">Signup
                        </Link>
                        <Link
                            to="/login"
                            search={{ redirect: location.pathname }}
                            className="link">Login
                        </Link>
                    </>
                )}
            </div>
        </nav>
    );
}