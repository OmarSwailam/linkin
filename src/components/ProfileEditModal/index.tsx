import { useState } from "react";
import type { User } from "../../types";
import "./ProfileEditModal.css"
import { useUpdateUser } from "../../hooks/useUser";

export default function ProfileEditModal({ user, onClose }: { user?: User, onClose: () => void }) {

    const [profileImage, setProfileImage] = useState(user?.profile_image)
    const [firstName, setFirstName] = useState(user?.first_name)
    const [lastName, setLastName] = useState(user?.last_name)
    const [title, setTitle] = useState(user?.title)

    const updateUser = useUpdateUser()

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        updateUser.mutate({
            profile_image: profileImage,
            first_name: firstName,
            last_name: lastName,
            title
        })
        onClose();
    }

    return (
        <div className="profile-edit-modal">
            <form className="profile-edit-form" onSubmit={handleSubmit}>
                <div className="close-icon" onClick={() => onClose()}>x</div>

                <label htmlFor="profile-image">Profile Image URL:</label>
                <input
                    type="text"
                    placeholder="https://image..."
                    id="profile-image"
                    name="profile-image"
                    value={profileImage}
                    onChange={e => setProfileImage(e.target.value)}
                />

                <label>Name:</label>
                <div className="name">
                    <input
                        type="text"
                        placeholder="john"
                        id="first-name"
                        name="first-name"
                        value={firstName}
                        onChange={e => setFirstName(e.target.value)}
                    />
                    <input
                        type="text"
                        placeholder="doe"
                        id="last-name"
                        name="last-name"
                        value={lastName}
                        onChange={e => setLastName(e.target.value)}
                    />
                </div>

                <label htmlFor="title">Title:</label>
                <input
                    type="text"
                    placeholder="Social Worker"
                    id="title"
                    name="title"
                    value={title ?? ""}
                    onChange={e => setTitle(e.target.value)}
                />

                <div className="buttons">
                    <button type="button" className="close-btn" onClick={() => onClose()}>Close</button>
                    <button type="submit" className="update-btn">Update</button>
                </div>
            </form>
        </div>
    )
}