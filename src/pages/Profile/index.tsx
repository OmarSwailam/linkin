import { useParams } from "@tanstack/react-router";
import ProfileInfo from "../../components/Profile";
import "./profile.css"
import { useUserProfile } from "../../hooks/useUser";
import ProfileSkeleton from "../../components/Profile/ProfileSkeleton";


export default function ProfilePage({ isOwnProfile = false }: { isOwnProfile?: boolean }) {
    const params = isOwnProfile ? undefined : useParams({ from: "/profile/$uuid" });
    const uuid = params?.uuid;

    const { data, isLoading } = useUserProfile(uuid);

    return (
        <div className="page profile-page">
            {isLoading ? <ProfileSkeleton /> : <ProfileInfo user={data} />}
        </div>
    )

    {/* <div className="posts">
            <div className="post">
                <img />
                <div className="post-info">
                    <div className="created-by">
                        <img src="" alt="" />
                        <div className="created-by-info">
                            <h4 className="created-by-name">user1</h4>
                            <h5 className="created-by-title">engineer</h5>
                        </div>
                    </div>
                    <p className="post-created-at">2025-5-27</p>
                    <p className="post-body">
                        Lorem ipsum dolor sit, amet consectetur adipisicing elit. Asperiores sint laborum veritatis quaerat velit tempora assumenda quod id expedita atque.
                    </p>
                </div>
            </div>
        </div> */}
}