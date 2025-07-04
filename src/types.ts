export interface User {
    uuid: string;
    first_name: string;
    last_name: string;
    title: string | null;
    email: string;
    followers_count: number;
    following_count: number;
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
    profile_image?: string | undefined;
    title?: string | undefined;
}

export interface Post {
    uuid: string;
    text: string;
    images: string[];
    created_at: string;
    created_by: PostCreator;
    comments_count: number;
    likes_count: number;
    liked: boolean;
}
export interface PaginatedResponse<T> {
    page: number;
    page_size: number;
    total: number;
    results: T[];
}

export type UserPostsResponse = PaginatedResponse<Post>;

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