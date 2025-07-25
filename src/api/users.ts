import type { FollowResponse, PaginatedResponse, PaginationQueryParams, SkillPayload, UpdateUserPayload, UpdateUserResponse, User, UserSearchParams } from "../types";
import { sleep } from "../utils/helpers";
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

export async function fetchSuggestedFriends(
    queryParams: PaginationQueryParams
): Promise<PaginatedResponse<User>> {
    sleep(5000)
    const response = await api.get<PaginatedResponse<User>>("/users/suggested", {
        params: queryParams,
    });
    return response.data;
}

export async function fetchUsers(params: UserSearchParams = {}): Promise<PaginatedResponse<User>> {
    const query = new URLSearchParams()

    if (params.page) query.append("page", String(params.page))
    if (params.page_size) query.append("page_size", String(params.page_size))
    if (params.title) query.append("title", params.title)
    if (params.name) query.append("name", params.name)
    if (params.skills?.length)
        query.append("skills", params.skills.join(","))
    if (params.sort_by) query.append("sort_by", params.sort_by)
    if (params.sort_dir) query.append("sort_dir", params.sort_dir)
    if (params.q) query.append("q", params.q)

    const { data } = await api.get<PaginatedResponse<User>>(`/users/?${query.toString()}`)

    return data
}