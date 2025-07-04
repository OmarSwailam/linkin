import { Heart, MessageCircle } from "lucide-react";
import type { CommentType } from "../../types";
import "./comment.css";
import { formatDateTime } from "../../utils/helpers";
import { useNavigate } from "@tanstack/react-router";

interface CommentProps {
    comment: CommentType;
    onLike?: (uuid: string) => void;
    onReply?: (uuid: string) => void;
}

export default function Comment({ comment, onLike, onReply }: CommentProps) {
    const navigate = useNavigate();

    const {
        uuid,
        text,
        created_at,
        likes_count,
        replies_count,
        liked,
        created_by,
    } = comment;

    const handleUserClick = () => {
        navigate({ to: "/profile/$uuid", params: { uuid: created_by.uuid } });
    };

    return (
        <div className="comment">
            <div className="comment-header">
                <div className="comment-header-left">
                    <img src={created_by.profile_image} alt={created_by.name} className="comment-avatar"
                        onClick={handleUserClick}
                    />
                    <div className="comment-meta">
                        <h4 className="comment-author" onClick={handleUserClick}>{created_by.name}</h4>
                        <p className="comment-title">{created_by.title}</p>
                    </div>
                </div>
                <span className="comment-time">{formatDateTime(created_at)}</span>
            </div>

            <p className="comment-text">{text}</p>

            <div className="comment-actions">
                <div className="comment-action" onClick={() => onLike?.(uuid)}>
                    <Heart
                        className={liked ? "comment-like-icon liked" : "comment-like-icon"}
                        size={18}
                    />
                    <span>{likes_count}</span>
                </div>
                <div className="comment-action" onClick={() => onReply?.(uuid)}>
                    <MessageCircle className="comment-reply-icon" size={18} />
                    <span>{replies_count}</span>
                </div>
            </div>
        </div>
    );
}
