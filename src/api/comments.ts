import type { PaginatedResponse, PaginationQueryParams, CommentType } from "../types"
import api from "./axios"


export async function getPostComments(postUuid?: string, queryParams?: PaginationQueryParams) {
    const endpoint = `/posts/${postUuid}/comments`
    const response = await api.get<PaginatedResponse<CommentType>>(endpoint, {
        params: queryParams
    })
    return response.data
}

export async function likeComment(commentUuid: string) {
    const endpoint = `/comments/${commentUuid}/like`
    const response = await api.post(endpoint)
    return response.data
}

export async function unlikeComment(commentUuid: string) {
    const endpoint = `/comments/${commentUuid}/like`
    const response = await api.delete(endpoint)
    return response.data
}
