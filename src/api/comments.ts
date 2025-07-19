import type {
    PaginatedResponse, PaginationQueryParams, CommentType, CreateCommentPayload, CreateCommentResponse,
    ReplyType,
    CreateReplyPayload,
    CreateReplyResponse
} from "../types"
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

export async function createCommentOnPost(
    payload: CreateCommentPayload
): Promise<CreateCommentResponse> {
    const response = await api.post<CreateCommentResponse>("/comments/", payload);
    return response.data;
}

export async function getCommentReplies(
    commentUuid: string,
    queryParams?: PaginationQueryParams
): Promise<PaginatedResponse<ReplyType>> {
    const res = await api.get(`/comments/${commentUuid}/replies`, {
        params: queryParams,
    })
    return res.data
}

export async function createReply(payload: CreateReplyPayload): Promise<CreateReplyResponse> {
    const res = await api.post("/comments/", payload)
    return res.data
}

export async function likeReply(replyUuid: string) {
    const endpoint = `/comments/${replyUuid}/like`;
    const response = await api.post(endpoint);
    return response.data;
}

export async function unlikeReply(replyUuid: string) {
    const endpoint = `/comments/${replyUuid}/like`;
    const response = await api.delete(endpoint);
    return response.data;
}