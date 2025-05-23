import { Link } from "@tanstack/react-router"
import ThemeToggle from "../ThemeToggle"
import Logo from "../Logo"
import "./Navbar.css"

export default function Navbar() {
    return <nav>
        <Link to="/" className="logo-link"><Logo /></Link>

        <ThemeToggle />
        <Link to="/" className="feed-link">Feed</Link>
        <Link to="/profile" className="profile-image-link">
            <img src="/profile-placeholder.png" alt="profile image" className="profile-image" />
        </Link>
    </nav>
}