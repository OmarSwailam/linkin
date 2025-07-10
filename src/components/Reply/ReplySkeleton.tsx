export default function ReplySkeleton() {
    return (
        <div className="reply-skeleton">
            <div className="reply-header">
                <div className="avatar-skeleton skeleton" />
                <div className="header-text">
                    <div className="line-skeleton short skeleton" />
                    <div className="line-skeleton tiny skeleton" />
                </div>
            </div>
            <div className="line-skeleton skeleton" />
            <div className="line-skeleton skeleton" />
            <div className="reply-actions">
                <div className="action-skeleton skeleton" />
                <div className="action-skeleton skeleton" />
            </div>
        </div>
    );
}