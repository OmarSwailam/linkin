export interface User {
    uuid: string;
    first_name: string;
    last_name: string;
    title: string | null;
    email: string;
    followers_count: number;
    following_count: number;
    is_following: boolean;
    follows_me: boolean;
    profile_image: string;
    skills: string[];
}

export type UpdateUserPayload = {
    first_name: string | null | undefined;
    last_name: string | null | undefined;
    title: string | null | undefined;
    profile_image: string | null | undefined;
}

export type UpdateUserResponse = {
    message: string;
    user: User;
}

export interface PostCreator {
    uuid: string;
    name: string;
    profile_image?: string | null;
    title?: string | null;
}

export interface PostType {
    uuid: string;
    text: string;
    images: string[];
    created_at: string;
    created_by: PostCreator;
    comments_count: number;
    likes_count: number;
    liked: boolean;
    priority?: number;
}

export interface PaginatedResponse<T> {
    page: number;
    page_size: number;
    total: number;
    results: T[];
}

export interface PaginationQueryParams {
    page?: number;
    page_size?: number;
}

export type LikePostResponse = {
    message: string;
}

export interface CommentAuthor {
    uuid: string;
    name: string;
    profile_image?: string;
    title?: string;
}

export interface CommentType {
    uuid: string;
    text: string;
    created_at: string;
    likes_count: number;
    replies_count: number;
    liked: boolean;
    created_by: CommentAuthor;
}


export interface CreatePostPayload {
    text?: string
    images?: string[]
}

export interface CreatePostResponse {
    post_uuid: string
    user_uuid: string
    text: string
    images: string[]
    created_at: string
    created_by: {
        uuid: string
        name: string
        profile_image: string
        title: string
    }
}

export interface CreateCommentPayload {
    text: string;
    post_uuid: string;
}

export type CreateCommentResponse = CommentType;

export interface ReplyAuthor {
    uuid: string
    name: string
    profile_image?: string
    title?: string
}

export interface ReplyType {
    uuid: string
    text: string
    created_at: string
    likes_count: number
    liked: boolean
    created_by: ReplyAuthor
}

export interface CreateReplyPayload {
    text: string
    comment_uuid: string
}

export interface CreateReplyResponse {
    uuid: string
    text: string
    created_at: string
    likes_count: number
    liked: boolean
    created_by: {
        uuid: string
        name: string
        profile_image?: string
        title?: string
    }
}

export interface SkillPayload {
    name: string
}

export interface FollowResponse {
    message: string;
}

export interface UpdatePostPayload {
    text?: string
    images?: string[]
}