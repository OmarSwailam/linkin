import type { SkillPayload, UpdateUserPayload, UpdateUserResponse, User } from "../types";
import api from "./axios"

export async function fetchUser({ uuid }: { uuid?: string }) {
    let endpoint = uuid ? `/users/${uuid}` : "/users/me"
    const response = await api.get<User>(endpoint);
    return response.data
}

export async function updateUser(payload: UpdateUserPayload) {
    const response = await api.patch<UpdateUserResponse>("/users/me", payload);
    return response.data
}


export async function addSkill(payload: SkillPayload) {
    const res = await api.post("users/me/skill", payload)
    return res.data
}

export async function removeSkill(payload: SkillPayload) {
    const res = await api.delete("users/me/skill", { data: payload })
    return res.data
}