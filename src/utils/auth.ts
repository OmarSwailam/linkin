export function storeTokens({ access_token, refresh_token }: { access_token: string; refresh_token: string }) {
    localStorage.setItem("access_token", access_token);
    localStorage.setItem("refresh_token", refresh_token);
}

export function clearTokens() {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
}


export function isAuthenticated() {
    return !!localStorage.getItem("access_token");
}