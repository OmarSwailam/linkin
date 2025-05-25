import { Link } from "@tanstack/react-router"
import ThemeToggle from "../ThemeToggle"
import Logo from "../Logo"
import "./Navbar.css"
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "@tanstack/react-router";

export default function Navbar() {
    const { isAuthenticated, user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate({ to: "/login" });
    };

    const profileImage = user?.profile_image ? user.profile_image : "/profile-placeholder.png"

    return <nav>
        <Link to="/" className="logo-link"><Logo /></Link>
        <ThemeToggle />

        {isAuthenticated ? (
            <>
                <Link to="/" className="link">Feed</Link>
                <Link to="/profile" className="profile-image-link">
                    <img src={profileImage} alt="profile image" className="profile-image" />
                </Link>
                <button onClick={handleLogout} className="link">Logout</button>
            </>
        ) : (
            <>
                <Link to="/signup" className="link">Signup</Link>
                <Link to="/login" className="link">Login</Link>
            </>
        )}
    </nav>
}