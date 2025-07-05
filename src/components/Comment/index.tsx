import { Heart, MessageCircle } from "lucide-react";
import type { CommentType } from "../../types";
import "./comment.css";
import { formatDateTime } from "../../utils/helpers";
import { useNavigate } from "@tanstack/react-router";
import { useLikeComment, useUnlikeComment } from "../../hooks/useComments";

interface CommentProps {
    comment: CommentType;
    postUuid: string;
}

export default function Comment({ comment, postUuid }: CommentProps) {
    const navigate = useNavigate();

    const likeComment = useLikeComment(postUuid)
    const unlikeComment = useUnlikeComment(postUuid)

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

    function handleLike() {
        if (liked) {
            unlikeComment.mutate(uuid)
        } else {
            likeComment.mutate(uuid)
        }
    }

    function setReplaysComments(arg0: boolean): void {
        throw new Error("Function not implemented.");
    }

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
                <div className="comment-action">
                    <Heart
                        className={liked ? "comment-like-icon liked" : "comment-like-icon"}
                        size={18}
                        onClick={handleLike}
                    />
                    <span>{likes_count}</span>
                </div>
                <div className="comment-action" >
                    <MessageCircle className="comment-reply-icon" size={18}
                        onClick={() => setReplaysComments(true)}
                    />
                    <span>{replies_count}</span>
                </div>
            </div>
        </div>
    );
}
