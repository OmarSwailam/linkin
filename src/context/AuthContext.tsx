import { createContext, useContext, useState, useEffect, type ReactNode } from "react";

type User = {
    uuid: string;
    first_name: string;
    last_name: string;
    email: string;
    profile_image: string;
};

type AuthContextType = {
    isAuthenticated: boolean;
    user: User | null;
    accessToken: string | null;
    login: (data: { access_token: string; refresh_token: string; user: User }) => void;
    logout: () => void;
};

const AuthContext = createContext<AuthContextType>({
    isAuthenticated: false,
    user: null,
    accessToken: null,
    login: () => { },
    logout: () => { },
});

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [accessToken, setAccessToken] = useState<string | null>(null);


    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        const user = storedUser && storedUser !== "undefined" ? JSON.parse(storedUser) : null;
        setUser(user);

        const storedToken = localStorage.getItem("access_token");
        const token = storedToken && storedToken !== "undefined" ? storedToken : null;
        setAccessToken(token);
    }, []);

    const login = (data: { access_token: string; refresh_token: string; user: User }) => {
        localStorage.setItem("access_token", data.access_token);
        localStorage.setItem("refresh_token", data.refresh_token);
        localStorage.setItem("user", JSON.stringify(data.user));

        setUser(data.user);
        setAccessToken(data.access_token);
    };

    const logout = () => {
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
        localStorage.removeItem("user");

        setUser(null);
        setAccessToken(null);

    };

    return (
        <AuthContext.Provider value={{ isAuthenticated: !!user, user, accessToken, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    return useContext(AuthContext);
}
