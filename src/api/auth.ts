import api from "./axios";

export async function signup(data: {
    first_name: string;
    last_name: string;
    email: string;
    password: string;
}) {
    const response = await api.post("/users/register", data);
    return response.data;
}

export async function login(data: {
    email: string;
    password: string;
}) {
    const response = await api.post("/users/login", data);
    return response.data;
}