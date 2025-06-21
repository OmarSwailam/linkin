import "./post.css"

export default function PostSkeleton() {
    return (
        <div className="skeleton-post">
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
    );
}
