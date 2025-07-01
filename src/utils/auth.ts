import { jwtDecode } from "jwt-decode";


export function storeTokens({ access_token, refresh_token }: { access_token: string; refresh_token: string }) {
    localStorage.setItem("access_token", access_token);
    localStorage.setItem("refresh_token", refresh_token);
}

export function clearTokens() {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
}


export function isAuthenticated(): boolean {
    const token = localStorage.getItem("access_token");
    if (!token) return false;

    try {
        const decoded: { exp: number } = jwtDecode(token);
        const now = Math.floor(Date.now() / 1000);
        return decoded.exp > now;
    } catch {
        return false;
    }
}