import type { PaginatedResponse, Post as PostType } from "../../types";
import Post from "../Post";
import "./profilePosts.css"

export default function ProfilePosts({ postsData, isOwnProfile }: { postsData?: PaginatedResponse<PostType>, isOwnProfile?: boolean }) {
    console.log(postsData)
    console.log(isOwnProfile)
    return (
        <div className="profile-posts">
            <h1>Posts</h1>
            {postsData?.results?.map(post => {
                return <Post post={post} />
            })}
        </div>
    )
}