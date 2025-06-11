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