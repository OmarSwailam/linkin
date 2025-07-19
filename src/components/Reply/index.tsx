import { Heart } from "lucide-react";
import { formatDateTime } from "../../utils/helpers";
import { useNavigate } from "@tanstack/react-router";
import "./reply.css"
import type { ReplyType } from "../../types";

interface ReplyProps {
    reply: ReplyType;
    commentUuid: string;
}

export default function Reply({ reply, commentUuid }: ReplyProps) {
    const navigate = useNavigate();

    const {
        uuid,
        text,
        created_at,
        likes_count,
        liked,
        created_by,
    } = reply;

    const handleUserClick = () => {
        navigate({ to: "/profile/$uuid", params: { uuid: created_by.uuid } });
    };

    // const likeReply = useLikeReply(commentUuid);
    // const unlikeReply = useUnlikeReply(commentUuid);

    const handleLike = () => {
        // if (reply.liked) {
        //     unlikeReply.mutate(uuid);
        // } else {
        //     likeReply.mutate(uuid);
        // }
    };

    return (
        <div className="reply">
            <div className="reply-header">
                <div className="reply-header-left">
                    <img src={created_by.profile_image} alt={created_by.name} className="reply-avatar"
                        onClick={handleUserClick}
                    />
                    <div className="reply-meta">
                        <h4 className="reply-author" onClick={handleUserClick}>{created_by.name}</h4>
                        <p className="reply-title">{created_by.title}</p>
                    </div>
                </div>
                <span className="reply-time">{formatDateTime(created_at)}</span>
            </div>

            <p className="reply-text">{text}</p>

            <div className="reply-actions">
                <div className="reply-action">
                    <Heart
                        className={liked ? "reply-like-icon liked" : "reply-like-icon"}
                        size={18}
                        onClick={handleLike}
                    />
                    <span>{likes_count}</span>
                </div>
            </div>
        </div>
    );
}
