import "./profilePosts.css"

export default function ProfilePostsSkeleton() {
    return (
        <div className="profile-posts">
            <h1>Posts</h1>
            {Array.from({ length: 3 }).map((_, i) => (
                <div className="skeleton-post" key={i}>
                    <div className="skeleton created-by">
                        <div className="skeleton avatar" />
                        <div className="skeleton author-info">
                            <div className="skeleton name" />
                            <div className="skeleton title" />
                        </div>
                    </div>
                    <div className="skeleton date" />
                    <div className="skeleton body" />
                    <div className="skeleton body short" />
                    <div className="skeleton image" />
                </div>
            ))}
        </div>
    );
}
