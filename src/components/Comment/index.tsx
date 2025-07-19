import { Heart, MessageCircle } from "lucide-react";
import type { CommentType, PaginatedResponse, ReplyType } from "../../types";
import "./comment.css";
import { formatDateTime } from "../../utils/helpers";
import { useNavigate } from "@tanstack/react-router";
import { useCommentReplies, useCreateReply, useLikeComment, useUnlikeComment } from "../../hooks/useComments";
import { useEffect, useState, type FormEvent } from "react";
import toast from "react-hot-toast";
import { AxiosError } from "axios";
import ReplySkeleton from "../Reply/ReplySkeleton";
import Reply from "../Reply";

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

    const [showReplies, setShowReplies] = useState(false);


    const [replyText, setReplyText] = useState("");

    const createReply = useCreateReply(uuid)

    function handleAddReply(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();

        const text = replyText.trim();
        if (!text) {
            toast.error("Reply cannot be empty");
            return;
        }
        createReply.mutate({ text, comment_uuid: uuid })
        setReplyText("");
    }

    const {
        data,
        isLoading,
        isError,
        error,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
    } = useCommentReplies(uuid, 5, true)

    useEffect(() => {
        if (isError && error instanceof AxiosError) {
            toast.error((error.response?.data as { error?: string })?.error || "Failed to load comments");
        }
    }, [isError, error]);


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
                        onClick={() => setShowReplies(true)}
                    />
                    <span>{replies_count}</span>
                </div>

                <form className="add-reply-form" onSubmit={handleAddReply}>
                    <input
                        type="text"
                        placeholder="reply..."
                        className="reply-input"
                        value={replyText}
                        onChange={(e) => setReplyText(e.target.value)}
                        onFocus={() => setShowReplies(true)}
                    />
                    <button type="submit" className="reply-submit">reply</button>
                </form>

            </div>

            {showReplies && (
                <div className="comment-replies">
                    {isLoading ? (
                        <ReplySkeleton />
                    ) : (
                        <>
                            {data?.pages.map((page: PaginatedResponse<ReplyType>, pageIndex: number) => (
                                <div key={pageIndex}>
                                    {page.results.map((reply) => (
                                        <Reply
                                            key={reply.uuid}
                                            reply={reply}
                                            commentUuid={comment.uuid}
                                        />
                                    ))}

                                </div>

                            ))}
                            {isFetchingNextPage && <ReplySkeleton />}
                        </>
                    )}

                    {hasNextPage && !isFetchingNextPage && (
                        <button
                            className="view-more-replies"
                            onClick={() => fetchNextPage()}
                        >
                            View more replies
                        </button>
                    )}

                </div>
            )}
        </div>
    );
}
