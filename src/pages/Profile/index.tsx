import { useParams } from "@tanstack/react-router";
import { useUserProfile } from "../../hooks/useUser";

export default function ProfilePage() {
    let uuid: string | undefined;

    try {
        ({ uuid } = useParams({ from: "/profile/$uuid" }));
    } catch {
        uuid = undefined;
    }

    const { data, isLoading } = useUserProfile(uuid);
    console.log(data)

    return <div className="page profile-page">
        <div className="profile-info">
            <img className="profile-image" src="/profile-placeholder.png" />
            <h2 className="profile-name">{data?.first_name} {data?.last_name}</h2>
            <h3 className="title">{data?.title}</h3>
            <div className="counts">
                <p className="following">{data?.following_count} Following</p>
                <p className="followers">{data?.followers_count} Followers</p>
            </div>
            <div className="skills">
                {data?.skills.map(skill => <div>{skill}</div>)}
            </div>
        </div>

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
    </div>
}