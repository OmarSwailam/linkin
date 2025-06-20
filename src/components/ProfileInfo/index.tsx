import type { User } from "../../types";
import { useState } from "react";
import ProfileEditModal from "../ProfileEditModal";
import "./profileInfo.css"

export default function ProfileInfo({ user, isOwnProfile }: { user?: User, isOwnProfile: boolean }) {
    const profileImage = user?.profile_image || "/profile-placeholder.png";

    const [showForm, setShowForm] = useState(false)

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

            <div className="skills">
                {user?.skills.map(skill => <div key={skill} className="skill">{skill}</div>)}
            </div>
        </div>
    )
}