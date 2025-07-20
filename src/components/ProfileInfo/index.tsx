import type { User } from "../../types";
import { useState } from "react";
import ProfileEditModal from "../ProfileEditModal";
import "./profileInfo.css"
import { useAddSkill, useFollowUser, useRemoveSkill, useUnfollowUser } from "../../hooks/useUser";
import Modal from "../Modal";
import FollowList from "../FollowList";

export default function ProfileInfo({ user, isOwnProfile }: { user?: User, isOwnProfile: boolean }) {
    const profileImage = user?.profile_image || "/profile-placeholder.png";

    const [showForm, setShowForm] = useState(false)
    const addSkill = useAddSkill()
    const removeSkill = useRemoveSkill()
    const [newSkill, setNewSkill] = useState("")

    const followUser = useFollowUser(user?.uuid || "");
    const unfollowUser = useUnfollowUser(user?.uuid || "");

    const handleFollowToggle = () => {
        if (!user) return;
        if (user.is_following) {
            unfollowUser.mutate();
        } else {
            followUser.mutate();
        }
    };

    const isFollowPending = followUser.isPending || unfollowUser.isPending;

    const [showFollowers, setShowFollowers] = useState(false);
    const [showFollowing, setShowFollowing] = useState(false);


    return (
        <div className="profile-info">
            {isOwnProfile && <p onClick={() => setShowForm(true)} className="edit-profile-btn">Edit</p>}
            {showForm && <ProfileEditModal user={user} onClose={() => setShowForm(false)} />}

            <img className="profile-image" key={profileImage} src={profileImage} />
            <h2 className="profile-name">{user?.first_name} {user?.last_name}</h2>
            <h3 className="title">{user?.title}</h3>
            <div className="numbers">
                <p
                    className="followers"
                    onClick={() => setShowFollowers(true)}
                >
                    <span>{user?.followers_count}</span> Followers
                </p>
                <p
                    className="following"
                    onClick={() => setShowFollowing(true)}
                >
                    <span>{user?.following_count}</span> Following
                </p>
            </div>

            {showFollowers && (
                <Modal onClose={() => setShowFollowers(false)} title="Followers">
                    <FollowList type="followers" userUuid={user?.uuid} />
                </Modal>
            )}

            {showFollowing && (
                <Modal onClose={() => setShowFollowing(false)} title="Following">
                    <FollowList type="following" userUuid={user?.uuid} />
                </Modal>
            )}

            {!isOwnProfile && user && (
                <button
                    onClick={handleFollowToggle}
                    disabled={isFollowPending}
                    className={`follow-btn ${user.is_following ? "unfollow" : "follow"}`}
                >
                    {user.is_following ? "Unfollow" : "Follow"}
                </button>
            )}


            <p className="skills-label">skills</p>

            {isOwnProfile && (
                <div className="skill-controls">
                    <input
                        placeholder="Add skill"
                        value={newSkill}
                        onChange={(e) => setNewSkill(e.target.value)}
                    />
                    <button
                        onClick={() => {
                            if (newSkill.trim()) {
                                addSkill.mutate({ name: newSkill.trim() })
                                setNewSkill("")
                            }
                        }}
                    >
                        Add
                    </button>
                </div>
            )}

            <div className="skills">
                {user?.skills.map(skill => <div key={skill} className="skill">
                    {skill}
                    {isOwnProfile && (
                        <span
                            className="remove-skill"
                            onClick={() => removeSkill.mutate({ name: skill })}
                        >
                            ✕
                        </span>
                    )}
                </div>)}
            </div>
        </div>
    )
}