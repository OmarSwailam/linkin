import { useInfiniteQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { fetchUserPosts, likePost, unlikePost } from "../api/posts"
import type { PaginatedResponse, Post } from "../types";
import toast from "react-hot-toast";

export function useMyPosts() {
    return useInfiniteQuery({
        queryKey: ["my-posts"],
        queryFn: ({ pageParam = 1 }) =>
            fetchUserPosts(undefined, { page: pageParam, page_size: 10 }),
        staleTime: 0,
        getNextPageParam: (lastPage: PaginatedResponse<Post>) => {
            const hasMore = lastPage.page * lastPage.page_size < lastPage.total;
            return hasMore ? lastPage.page + 1 : undefined;
        },
        refetchOnWindowFocus: true
    });
}

export function usePosts(userUuid?: string) {
    // TODO: make this function deal with a user posts by uuid only and not the current user posts
    const key = userUuid ? ["user", `${userUuid}`, "posts"] : ["my-posts"]
    return useInfiniteQuery({
        queryKey: key,
        queryFn: ({ pageParam = 1 }) => fetchUserPosts(userUuid, { page: pageParam, page_size: 10 }),
        staleTime: 0,
        getNextPageParam: (lastPage: PaginatedResponse<Post>) => {
            const hasMore = lastPage.page * lastPage.page_size < lastPage.total;
            return hasMore ? lastPage.page + 1 : undefined;
        },
        refetchOnWindowFocus: true
    })
}

export function useLikePost() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: likePost,
        onSuccess: (data, postUuid) => {
            queryClient.setQueriesData(["my-posts"], (oldData: any) => {
                if (!oldData || !Array.isArray(oldData.pages)) return oldData;

                return {
                    ...oldData,
                    pages: oldData.pages.map((page: any) => ({
                        ...page,
                        results: Array.isArray(page.results)
                            ? page.results.map((post: any) =>
                                post.uuid === postUuid
                                    ? {
                                        ...post,
                                        liked: true,
                                        likes_count: post.likes_count + 1,
                                    }
                                    : post
                            )
                            : [],
                    })),
                };
            });
        },
        onError: (err) => {
            toast.error(err.response?.data?.error || "Failed to like post.");
        },
    });
}

export function useUnlikePost() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: unlikePost,
        onSuccess: (data, postUuid) => {
            queryClient.setQueriesData(["my-posts"], (oldData: any) => {
                if (!oldData || !Array.isArray(oldData.pages)) return oldData;

                return {
                    ...oldData,
                    pages: oldData.pages.map((page: any) => ({
                        ...page,
                        results: Array.isArray(page.results)
                            ? page.results.map((post: any) =>
                                post.uuid === postUuid
                                    ? {
                                        ...post,
                                        liked: false,
                                        likes_count: Math.max(post.likes_count - 1, 0),
                                    }
                                    : post
                            )
                            : [],
                    })),
                };
            });
        },
        onError: (err) => {
            toast.error(err.response?.data?.error || "Failed to unlike post.");
        },
    });
}