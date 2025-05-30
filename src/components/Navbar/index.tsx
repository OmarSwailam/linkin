import { Link, useLocation } from "@tanstack/react-router";
import ThemeToggle from "../ThemeToggle";
import Logo from "../Logo";
import "./Navbar.css";
import { useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { useLogout } from "../../hooks/useAuth";
import { useUser } from "../../hooks/useUser";

export default function Navbar() {
    const navigate = useNavigate();
    const location = useLocation();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const logout = useLogout();

    const { data: user, isLoading, error } = useUser();
    const profileImage = user?.profile_image ?? "/profile-placeholder.png";

    const handleLogout = () => {
        logout();
        setIsMenuOpen(false);
        navigate({ to: "/login" });
    };

    return (
        <nav>
            <div className="nav-left">
                <Link to="/" className="logo-link">
                    <Logo />
                </Link>
            </div>

            <div className="nav-right">
                <ThemeToggle />

                {isLoading ? (
                    <p className="nav-loading">Loading...</p>
                ) : error ? (
                    <>
                        <Link to="/login" className="link">
                            Login
                        </Link>
                        <Link to="/signup" className="link">
                            Signup
                        </Link>
                    </>
                ) : user ? (
                    <>
                        <Link to="/" className="link">
                            Feed
                        </Link>
                        <div className="profile-menu">
                            <button
                                className="profile-menu-button"
                                onClick={() => setIsMenuOpen(!isMenuOpen)}
                            >
                                <img
                                    src={profileImage}
                                    alt="profile image"
                                    className="nav-profile-image"
                                />
                                <span className="arrow-icon">
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        height="24px"
                                        viewBox="0 -960 960 960"
                                        width="24px"
                                    >
                                        <path d="M480-360 280-560h400L480-360Z" />
                                    </svg>
                                </span>
                            </button>

                            {isMenuOpen && (
                                <div className="dropdown-menu">
                                    <Link
                                        to="/profile"
                                        className="dropdown-item"
                                        onClick={() => setIsMenuOpen(false)}
                                    >
                                        Profile
                                    </Link>
                                    <button onClick={handleLogout} className="dropdown-item logout-btn">
                                        Logout
                                    </button>
                                </div>
                            )}
                        </div>
                    </>
                ) : (
                    <>
                        <Link
                            to="/signup"
                            search={{ redirect: location.pathname }}
                            className="link"
                        >
                            Signup
                        </Link>
                        <Link
                            to="/login"
                            search={{ redirect: location.pathname }}
                            className="link"
                        >
                            Login
                        </Link>
                    </>
                )}
            </div>
        </nav>
    );
}
