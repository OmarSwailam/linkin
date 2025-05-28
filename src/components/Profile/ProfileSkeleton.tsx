import "./profile.css"

export default function ProfileSkeleton() {
    return (
        <div className="profile-info">
            <div className="skeleton profile-image" />
            <div className="skeleton profile-name" />
            <div className="skeleton title" />
            <div className="numbers">
                <div className="skeleton number" />
                <div className="skeleton number" />
            </div>
            <p className="skills-label">Skills</p>
            <div className="skills">
                {Array.from({ length: 6 }).map((_, i) => (
                    <div className="skeleton skill" key={i} />
                ))}
            </div>
        </div>
    );
}
