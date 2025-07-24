import { AxiosError } from "axios";
import { useFeedPosts } from "../../hooks/usePosts";
import toast from "react-hot-toast";
import { useEffect } from "react";
import CreatePostForm from "../../components/CreatePostForm";
import PostSkeleton from "../../components/Post/PostsSkeleton";
import type { PaginatedResponse, PostType } from "../../types";
import Post from "../../components/Post";
import "./home.css"


export default function HomePage() {
    const {
        data,
        isLoading,
        isError,
        error,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
    } = useFeedPosts();

    useEffect(() => {
        if (isError && error instanceof AxiosError) {
            toast.error(error.response?.data?.error || "Failed to load feed");
        }
    }, [isError, error]);

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


    return <>
        <div className="home-page">
            <CreatePostForm />
            {isLoading ? (
                <PostSkeleton />
            ) : (
                <>
                    {data?.pages.map((page: PaginatedResponse<PostType>, pageIndex: number) => (
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
    </>
}