import type { CreatePostPayload, CreatePostResponse, PaginatedResponse, PaginationQueryParams, PostType } from "../types"
import api from "./axios"

export async function fetchUserPosts(userUuid?: string, queryParams?: PaginationQueryParams): Promise<PaginatedResponse<PostType>> {
    const endpoint = userUuid ? `/users/${userUuid}/posts` : "/posts/my-posts"
    const response = await api.get<PaginatedResponse<PostType>>(endpoint, {
        params: queryParams
    })
    return response.data
}

export async function fetchFeedPosts(queryParams?: PaginationQueryParams): Promise<PaginatedResponse<PostType>> {
    const response = await api.get<PaginatedResponse<PostType>>("/api/feed", {
        params: queryParams,
    });
    return response.data;
}

export async function createPost(payload: CreatePostPayload): Promise<CreatePostResponse> {
    const response = await api.post<CreatePostResponse>("/posts", payload)
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

