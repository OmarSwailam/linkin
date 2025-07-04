import type { PaginatedResponse, PaginationQueryParams, Post } from "../types"
import api from "./axios"

export async function fetchUserPosts(userUuid?: string, queryParams?: PaginationQueryParams) {

    const endpoint = userUuid ? `/users/${userUuid}/posts` : "/posts/my-posts"
    const response = await api.get<PaginatedResponse<Post>>(endpoint, {
        params: queryParams
    })
    return response.data
}

export async function likePost(postUuid: string) {
    const endpoint = `/posts/${postUuid}/like`
    const response = await api.post(endpoint)
    return response.data
}

export async function unlikePost(postUuid: string) {
    const endpoint = `/posts/${postUuid}/like`
    const response = await api.delete(endpoint)
    return response.data
}