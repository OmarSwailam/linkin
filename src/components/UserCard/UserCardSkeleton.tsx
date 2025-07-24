import "./UserCard.css"

export default function UserCardSkeleton() {
    return (
        <div className="user-card skeleton-user-card">
            <div className="avatar skeleton-avatar" />
            <div className="user-info">
                <div className="skeleton-line skeleton-name" />
                <div className="skeleton-line skeleton-title" />
                <div className="skeleton-line skeleton-degree" />
            </div>
        </div>
    )
}
