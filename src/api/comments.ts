import type { PaginatedResponse, PaginationQueryParams, CommentType } from "../types"
import api from "./axios"


export async function getPostComments(postUuid?: string, queryParams?: PaginationQueryParams) {
    const endpoint = `/posts/${postUuid}/comments`
    const response = await api.get<PaginatedResponse<CommentType>>(endpoint, {
        params: queryParams
    })
    return response.data
}
