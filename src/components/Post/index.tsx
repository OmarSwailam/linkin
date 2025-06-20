import type { Post as PostType } from "../../types";
import "./post.css"

export default function Post({ post }: { post: PostType }) {
    return (
        <div className="post">
            <div className="post-info">
                <div className="created-by">
                    <img src={post.created_by.profile_image} alt={`${post.created_by.name}'s profile image`} />
                    <div className="created-by-info">
                        <h4 className="created-by-name">{post.created_by.name}</h4>
                        <h5 className="created-by-title">{post.created_by.title}</h5>
                    </div>
                </div>
                <p className="post-created-at">{post.created_at}</p>

                {post.images.length > 0 && (
                    <div className={`post-images layout-${Math.min(post.images.length, 5)}`}>
                        {post.images.map((image, idx) => (
                            <img key={idx} src={image} alt={`Post image ${idx + 1}`} />
                        ))}
                    </div>
                )}

                <p className="post-body">{post.text}</p>
            </div>
        </div>
    );
}