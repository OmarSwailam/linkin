import type { CommentType, PaginatedResponse, PostType } from "../../types";
import { Heart, MessageCircle, Edit2 } from "lucide-react";
import { useLikePost, useUnlikePost } from "../../hooks/usePosts";
import toast from "react-hot-toast";

import "./post.css"
import { formatDateTime } from "../../utils/helpers";
import { usePostComments, useCreateCommentOnPost } from "../../hooks/useComments";
import { useEffect, useState } from "react";
import { AxiosError } from "axios";
import CommentSkeleton from "../Comment/CommentSkeleton";
import Comment from "../Comment";
import { useNavigate } from "@tanstack/react-router";
import { useUser } from "../../hooks/useUser";
import EditPostForm from "../EditPostForm";
import Modal from "../Modal";


export default function Post({ post }: { post: PostType }) {
    const navigate = useNavigate();

    const likePost = useLikePost(post.created_by.uuid)
    const unlikePost = useUnlikePost(post.created_by.uuid)

    const [showComments, setShowComments] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);

    function handleLike() {
        if (post.liked) {
            unlikePost.mutate(post.uuid)
        } else {
            likePost.mutate(post.uuid)
        }
    }

    const {
        data,
        isLoading,
        isError,
        error,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
    } = usePostComments(post.uuid, 5, showComments);

    useEffect(() => {
        if (isError && error instanceof AxiosError) {
            toast.error((error.response?.data as { error?: string })?.error || "Failed to load comments");
        }
    }, [isError, error]);

    const handleUserClick = () => {
        navigate({ to: "/profile/$uuid", params: { uuid: post.created_by.uuid } });
    };

    const [commentText, setCommentText] = useState("");
    const createComment = useCreateCommentOnPost(post.uuid);

    function handleAddComment(e: React.FormEvent) {
        e.preventDefault();

        const text = commentText.trim();
        if (!text) {
            toast.error("Comment cannot be empty");
            return;
        }

        createComment.mutate({ text, post_uuid: post.uuid });
        setCommentText("");
    }

    const { data: user } = useUser();

    const canEdit = post.created_by.uuid === user?.uuid

    return (
        <div className="post">
            <div className="post-info">
                {
                    canEdit &&
                    <div className="post-actions">
                        <button className="edit-post-btn" onClick={() => setShowEditModal(true)}>
                            <Edit2 size={18} />
                        </button>
                    </div>
                }
                <div className="created-by">
                    <img src={post.created_by.profile_image || ""} alt={`${post.created_by.name}'s profile image`}
                        onClick={handleUserClick}
                    />
                    <div className="created-by-info">
                        <h4 className="created-by-name" onClick={handleUserClick}>{post.created_by.name}</h4>
                        <h5 className="created-by-title">{post.created_by.title}</h5>
                    </div>
                </div>
                <p className="post-created-at">{formatDateTime(post?.created_at)}</p>

                {post?.images?.length > 0 && (
                    <div className={`post-images layout-${Math.min(post?.images.length, 5)}`}>
                        {post?.images.map((image, idx) => (
                            <img key={idx} src={image} alt={`Post image ${idx + 1}`}
                                onClick={() => window.open(image)}
                            />
                        ))}
                    </div>
                )}

                <p className="post-body">{post?.text}</p>

                <div className="post-counts">
                    <div className="post-count">
                        <Heart
                            className={post.liked ? "likes-icon liked" : " likes-icon"}
                            size={20}
                            onClick={handleLike}
                        />
                        <span>{post.likes_count}</span>
                    </div>
                    <div
                        className="post-count"
                        onClick={() => setShowComments(true)}
                    >
                        <MessageCircle className="comments-icon" size={20} />
                        <span className="comments-count">{post.comments_count}</span>
                    </div>
                </div>

                <form className="add-comment-form" onSubmit={handleAddComment}>
                    <input
                        type="text"
                        placeholder="Write a comment..."
                        className="comment-input"
                        value={commentText}
                        onChange={(e) => setCommentText(e.target.value)}
                        onFocus={() => setShowComments(true)}
                    />
                    <button type="submit" className="comment-submit">Comment</button>
                </form>
            </div>
            {showComments && (
                <div className="post-comments">

                    {isLoading ? (
                        <CommentSkeleton />
                    ) : (
                        <>
                            {data?.pages.map((page: PaginatedResponse<CommentType>, pageIndex: number) => (
                                <div key={pageIndex}>
                                    {page.results.map((comment) => (
                                        <Comment
                                            key={comment.uuid}
                                            comment={comment}
                                            postUuid={post.uuid}
                                        />
                                    ))}

                                </div>

                            ))}
                            {isFetchingNextPage && <CommentSkeleton />}
                        </>
                    )}

                    {hasNextPage && !isFetchingNextPage && (
                        <button
                            className="view-more-comments"
                            onClick={() => fetchNextPage()}
                        >
                            View more comments
                        </button>
                    )}
                </div>
            )}

            {showEditModal && (
                <Modal title="Edit Post" onClose={() => setShowEditModal(false)}>
                    <EditPostForm
                        post={post}
                        onClose={() => setShowEditModal(false)}
                    />
                </Modal>
            )}
        </div>

    );
}