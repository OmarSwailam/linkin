import type { User } from "../../types";
import { useState } from "react";
import ProfileEditModal from "../ProfileEditModal";
import "./profileInfo.css"
import { useAddSkill, useRemoveSkill } from "../../hooks/useUser";

export default function ProfileInfo({ user, isOwnProfile }: { user?: User, isOwnProfile: boolean }) {
    const profileImage = user?.profile_image || "/profile-placeholder.png";

    const [showForm, setShowForm] = useState(false)
    const addSkill = useAddSkill()
    const removeSkill = useRemoveSkill()
    const [newSkill, setNewSkill] = useState("")

    return (
        <div className="profile-info">
            {isOwnProfile && <p onClick={() => setShowForm(true)} className="edit-profile-btn">Edit</p>}
            {showForm && <ProfileEditModal user={user} onClose={() => setShowForm(false)} />}

            <img className="profile-image" key={profileImage} src={profileImage} />
            <h2 className="profile-name">{user?.first_name} {user?.last_name}</h2>
            <h3 className="title">{user?.title}</h3>
            <div className="numbers">
                <p className="followers"><span>{user?.followers_count}</span> Followers</p>
                <p className="following"><span>{user?.following_count}</span> Following</p>
            </div>
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