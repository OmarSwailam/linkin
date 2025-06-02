import { useParams } from "@tanstack/react-router";
import ProfileInfo from "../../components/Profile";
import "./profile.css"
import { useUser } from "../../hooks/useUser";
import ProfileSkeleton from "../../components/Profile/ProfileSkeleton";
import type { AxiosError } from "axios";


export default function ProfilePage({ isOwnProfile = false }: { isOwnProfile?: boolean }) {
    const params = isOwnProfile ? undefined : useParams({ from: "/profile/$uuid" });
    const uuid = params?.uuid;

    const { data, isLoading, isError, error } = useUser(uuid);

    if (isError) {
        return <p style={{ textAlign: "center", margin: "1em" }}>{`${error.response.data.error}`}</p>;
    }

    return (
        <div className="page profile-page">
            {isLoading ? <ProfileSkeleton /> : <ProfileInfo user={data} isOwnProfile={isOwnProfile} />}
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