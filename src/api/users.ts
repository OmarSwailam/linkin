import type { FollowResponse, PaginatedResponse, PaginationQueryParams, SkillPayload, UpdateUserPayload, UpdateUserResponse, User } from "../types";
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

export async function followUser(userUuid: string): Promise<FollowResponse> {
    const res = await api.post(`/users/${userUuid}/follow`);
    return res.data;
}

export async function unfollowUser(userUuid: string): Promise<FollowResponse> {
    const res = await api.delete(`/users/${userUuid}/follow`);
    return res.data;
}

export async function fetchFollowList(
    userUuid: string | undefined,
    type: 'followers' | 'following',
    params?: PaginationQueryParams
): Promise<PaginatedResponse<User>> {
    const endpoint = userUuid
        ? `/users/${userUuid}/${type}`
        : `/users/me/${type}`;

    const response = await api.get(endpoint, { params });
    return response.data;
}