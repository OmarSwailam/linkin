import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import "./navSearch.css";

export default function NavbarSearch() {
    const [query, setQuery] = useState("");
    const navigate = useNavigate();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const trimmed = query.trim();
        if (trimmed) {
            navigate({
                to: "/users",
                search: { q: trimmed },
            });
        }
    };

    return (
        <form onSubmit={handleSubmit} className="nav-search-form">
            <button className="nav-search-button" type="submit">
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="18"
                    height="18"
                    fill="currentColor"
                    viewBox="0 0 16 16"
                >
                    <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.397l3.85 3.85a1 1 0 0 0 
            1.415-1.414l-3.85-3.85zm-5.242 1.656a5.5 5.5 0 
            1 1 0-11 5.5 5.5 0 0 1 0 11z" />
                </svg>
            </button>

            <input
                type="text"
                className="nav-search-input"
                placeholder="Search name, title, skills…"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
            />
        </form>
    );
}