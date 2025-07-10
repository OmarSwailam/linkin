import { useInfiniteQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { createPost, fetchUserPosts, likePost, unlikePost } from "../api/posts"
import type { CreatePostPayload, CreatePostResponse, PaginatedResponse, Post } from "../types";
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

export function usePosts(userUuid: string) {
    const key = ["user", `${userUuid}`, "posts"] 
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

export function useCreatePost() {
    const queryClient = useQueryClient()

    return useMutation<CreatePostResponse, Error, CreatePostPayload>({
        mutationFn: createPost,
        onSuccess: (data) => {
            queryClient.setQueryData(["my-posts"], (oldData: any) => {
                if (!oldData || !Array.isArray(oldData.pages)) return oldData;

                return {
                    ...oldData,
                    pages: [
                        {
                            ...oldData.pages[0],
                            results: [data, ...oldData.pages[0].results],
                        },
                        ...oldData.pages.slice(1),
                    ],
                };
            });

            toast.success("Post created");
        },
        onError: (error) => {
            const message = (error as any)?.response?.data?.error || "Failed to create post";
            toast.error(message);
        },
    });
}