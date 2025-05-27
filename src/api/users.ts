import type { User } from "../types";
import api from "./axios"

export async function user({ uuid }: { uuid?: string }) {
    let endpoint = uuid ? `/users/${uuid}` : "/users/me"
    const response = await api.get<User>(endpoint);
    return response.data
}