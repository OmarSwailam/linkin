import type { PaginatedResponse, PaginationQueryParams, Post } from "../types"
import api from "./axios"
import { sleep } from "../utils/helpers"

export async function fetchUserPosts(uuid?: string, queryParams?: PaginationQueryParams) {
    await sleep(6000);

    const endpoint = uuid ? `/users/${uuid}/posts` : "/posts/my-posts"
    const response = await api.get<PaginatedResponse<Post>>(endpoint, {
        params: queryParams
    })
    return response.data
}