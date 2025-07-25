import { useParams } from "@tanstack/react-router";
import ProfileInfo from "../../components/ProfileInfo";
import "./profile.css"
import { useUser } from "../../hooks/useUser";
import ProfileInfoSkeleton from "../../components/ProfileInfo/ProfileInfoSkeleton";
import toast from "react-hot-toast";
import { useEffect } from "react";
import { AxiosError } from "axios";
import { useMyPosts, useUserPosts } from "../../hooks/usePosts";
import Post from "../../components/Post";
import PostSkeleton from "../../components/Post/PostsSkeleton";
import type { PaginatedResponse, PostType as PostType } from "../../types";
import CreatePostForm from "../../components/CreatePostForm";


export default function ProfilePage({ isOwnProfile = false }: { isOwnProfile?: boolean }) {
    const params = isOwnProfile ? undefined : useParams({ from: "/profile/$uuid" });
    const userUuid = params?.uuid;

    const {
        data: profileInfoData,
        isLoading: profileInfoIsLoading,
        isError: profileInfoIsError,
        error: profileInfoError
    } = useUser(userUuid);

    const {
        data: profilePostsData,
        isLoading: profilePostsIsLoading,
        isError: profilePostsIsError,
        error: profilePostsError,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
    } = userUuid ? useUserPosts(userUuid) : useMyPosts();

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



    useEffect(() => {
        const handleScroll = async () => {
            if (
                window.innerHeight + document.documentElement.scrollTop + 1 >=
                document.documentElement.scrollHeight
            ) {
                if (hasNextPage) {
                    fetchNextPage()
                }
            }
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, [hasNextPage, fetchNextPage]);

    return (
        <div className="page profile-page">
            {profileInfoIsLoading ? <ProfileInfoSkeleton /> : <ProfileInfo user={profileInfoData} isOwnProfile={isOwnProfile} />}
            {profileInfoIsError && <p style={{ textAlign: "center", margin: "1em" }}>Page does not exist</p>}
            <hr />
            <div className="profile-posts">
                {isOwnProfile ? <CreatePostForm /> : null}
                {profilePostsIsLoading ? (
                    <PostSkeleton />
                ) : (
                    <>
                        {profilePostsData?.pages.map((page: PaginatedResponse<PostType>, pageIndex: number) => (
                            <div key={pageIndex}>
                                {page.results.map((post) => (
                                    <Post key={post.uuid} post={post} />
                                ))}
                            </div>
                        ))}
                        {isFetchingNextPage && <PostSkeleton />}
                    </>
                )}
            </div>
        </div>
    )


}