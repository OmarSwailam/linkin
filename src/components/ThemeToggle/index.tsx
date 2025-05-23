import { useTheme } from "../../context/ThemeContext";
import { FiMoon, FiSun } from "react-icons/fi";
import "./ThemeToggle.css"; 

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button className="theme-toggle" onClick={toggleTheme}>
      {theme === "dark" ? <FiSun size={20} /> : <FiMoon size={20} />}
    </button>
  );
}
