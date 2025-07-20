import { useNavigate } from "@tanstack/react-router";
import { useFollowList, useFollowUser, useUnfollowUser, useUser } from "../../hooks/useUser";
import type { User } from "../../types";
import { useEffect, useRef } from "react";
import "./followList.css";

interface FollowListProps {
    type: 'followers' | 'following';
    userUuid?: string;
}

export default function FollowList({ type, userUuid }: FollowListProps) {
    const navigate = useNavigate();
    const listRef = useRef<HTMLDivElement>(null);
    const { data: currentUser } = useUser();

    const {
        data,
        isLoading,
        error,
        hasNextPage,
        fetchNextPage,
        isFetchingNextPage
    } = useFollowList(type, userUuid);

    useEffect(() => {
        const element = listRef.current;
        if (!element) return;

        const handleScroll = () => {
            const { scrollTop, scrollHeight, clientHeight } = element;
            if (scrollHeight - scrollTop <= clientHeight * 1.5) {
                if (hasNextPage && !isFetchingNextPage) {
                    fetchNextPage();
                }
            }
        };

        element.addEventListener("scroll", handleScroll);
        return () => element.removeEventListener("scroll", handleScroll);
    }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

    if (isLoading) return <div className="follow-list-loading">Loading...</div>;
    if (error) return <div className="follow-list-error">Failed to load {type}</div>;

    const FollowButton = ({ user }: { user: User }) => {
        // Don't show follow button if:
        // 1. It's the current user
        // 2. In following list (we already follow them)
        // 3. In followers list and they follow us back
        if (user.uuid === currentUser?.uuid ||
            type === 'following' ||
            (type === 'followers' && user.follows_me)) {
            return null;
        }

        const followUser = useFollowUser(user.uuid);
        const unfollowUser = useUnfollowUser(user.uuid);

        const handleFollowToggle = (e: React.MouseEvent) => {
            e.stopPropagation();
            if (user.is_following) {
                unfollowUser.mutate();
            } else {
                followUser.mutate();
            }
        };

        const isFollowPending = followUser.isPending || unfollowUser.isPending;

        return (
            <button
                onClick={handleFollowToggle}
                disabled={isFollowPending}
                className={`follow-btn ${user.is_following ? "unfollow" : "follow"}`}
            >
                {user.is_following ? "Unfollow" : "Follow"}
            </button>
        );
    };

    return (
        <div className="follow-list" ref={listRef}>
            {data?.pages.map((page, i) => (
                <div key={i}>
                    {page.results.map((user: User) => (
                        <div
                            key={user.uuid}
                            className="follow-list-item"
                            onClick={() => navigate({
                                to: "/profile/$uuid",
                                params: { uuid: user.uuid }
                            })}
                        >
                            <img
                                src={user.profile_image || "/profile-placeholder.png"}
                                alt={`${user.first_name} ${user.last_name}`}
                                className="follow-list-avatar"
                            />
                            <div className="follow-list-info">
                                <h3>{user.first_name} {user.last_name}</h3>
                                {user.title && <p>{user.title}</p>}
                            </div>
                            <FollowButton user={user} />
                        </div>
                    ))}
                </div>
            ))}
            {isFetchingNextPage && (
                <div className="follow-list-loading">Loading more...</div>
            )}
        </div>
    );
}