import { useParams } from "@tanstack/react-router";
import ProfileInfo from "../../components/ProfileInfo";
import "./profile.css"
import { useUser } from "../../hooks/useUser";
import ProfileInfoSkeleton from "../../components/ProfileInfo/ProfileInfoSkeleton";
import toast from "react-hot-toast";
import { useEffect } from "react";
import { AxiosError } from "axios";
import { usePosts } from "../../hooks/usePosts";
import ProfilePosts from "../../components/ProfilePosts";
import ProfilePostsSkeleton from "../../components/ProfilePosts/ProfilePostsSkeleton";


export default function ProfilePage({ isOwnProfile = false }: { isOwnProfile?: boolean }) {
    const params = isOwnProfile ? undefined : useParams({ from: "/profile/$uuid" });
    const uuid = params?.uuid;

    const {
        data: profileInfoData,
        isLoading: profileInfoIsLoading,
        isError: profileInfoIsError,
        error: profileInfoError
    } = useUser(uuid);

    const { data: profilePostsData,
        isLoading: profilePostsIsLoading,
        isError: profilePostsIsError,
        error: profilePostsError
    } = usePosts(uuid);

    useEffect(() => {
        if (profileInfoIsError && profileInfoError instanceof AxiosError) {
            toast.error(profileInfoError.response?.data?.error || "Failed to load user");
        }
    }, [profileInfoIsError, profileInfoError]);

    useEffect(() => {
        if (profilePostsIsError && profilePostsError instanceof AxiosError) {
            toast.error(profilePostsError.response?.data?.error || "Failed to load user");
        }
    }, [profilePostsIsError, profilePostsError]);


    return (
        <div className="page profile-page">
            {profileInfoIsLoading ? <ProfileInfoSkeleton /> : <ProfileInfo user={profileInfoData} isOwnProfile={isOwnProfile} />}
            {profileInfoIsError && <p style={{ textAlign: "center", margin: "1em" }}>Page does not exist</p>}
            <hr />
            {profilePostsIsLoading ? <ProfilePostsSkeleton /> : <ProfilePosts postsData={profilePostsData} isOwnProfile={isOwnProfile} />}
            {profileInfoIsError && <p style={{ textAlign: "center", margin: "1em" }}>Page does not exist</p>}
        </div>
    )


}