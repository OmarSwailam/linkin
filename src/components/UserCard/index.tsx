import { useNavigate } from "@tanstack/react-router"
import type { User } from "../../types"
import "./UserCard.css"
import { useFollowUser, useUnfollowUser } from "../../hooks/useUser"
import { useState } from "react"

export default function UserCard({
    user,
    showFollowButton,
}: {
    user: User
    showFollowButton: boolean
}) {
    const navigate = useNavigate()
    const [isFollowing, setIsFollowing] = useState(user.is_following)

    const followUser = useFollowUser(user.uuid)
    const unfollowUser = useUnfollowUser(user.uuid)

    const handleUserClick = () => {
        navigate({ to: "/profile/$uuid", params: { uuid: user.uuid } })
    }

    const handleFollowToggle = () => {
        if (isFollowing) {
            setIsFollowing(false)
            unfollowUser.mutate(undefined, {
                onError: () => setIsFollowing(true),
            })
        } else {
            setIsFollowing(true)
            followUser.mutate(undefined, {
                onError: () => setIsFollowing(false),
            })
        }
    }

    const isPending = followUser.isPending || unfollowUser.isPending

    return (
        <div className="user-card">
            <div className="user-left">
                <img
                    src={user.profile_image || ""}
                    alt={`${user.first_name} ${user.last_name}`}
                    className="avatar"
                    onClick={handleUserClick}
                />
                <div className="user-info">
                    <p className="user-name" onClick={handleUserClick}>
                        {user.first_name} {user.last_name}
                    </p>

                    {user.title && (
                        <p className="user-title">
                            {user.title.length > 45 ? user.title.slice(0, 45) + "…" : user.title}
                        </p>
                    )}

                    {user.degree !== undefined && (
                        <p className="user-degree">+{user.degree} connection</p>
                    )}

                    {user.skills?.length > 0 && (
                        <div className="user-skills">
                            {user.skills.slice(0, 5).map((skill) => (
                                <span key={skill} className="skill-chip">{skill}</span>
                            ))}
                        </div>
                    )}
                </div>

            </div>

            {showFollowButton && (
                <button
                    onClick={handleFollowToggle}
                    disabled={isPending}
                    className={`follow-btn ${isFollowing ? "unfollow" : "follow"}`}
                >
                    {isFollowing ? "Unfollow" : "Follow"}
                </button>
            )}
        </div>
    )
}