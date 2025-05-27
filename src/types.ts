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