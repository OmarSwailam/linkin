import { useTheme } from "../../context/ThemeContext";

export default function Logo() {
    const { theme } = useTheme();

    const logoSrc = theme === "dark" ? "/logo-dark-mode.png" : "/logo-light-mode.png";

    return (
        <img
            src={logoSrc}
            alt="LINKIN Logo"
            className="logo"
        />
    );
}
