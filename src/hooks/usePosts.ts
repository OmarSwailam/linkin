import { useInfiniteQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { createPost, fetchFeedPosts, fetchUserPosts, likePost, unlikePost, updatePost } from "../api/posts"
import type { CreatePostPayload, CreatePostResponse, PaginatedResponse, PostType, UpdatePostPayload } from "../types";
import toast from "react-hot-toast";

export function useUserPosts(userUuid?: string, pageSize = 10) {
    return useInfiniteQuery<PaginatedResponse<PostType>>({
        queryKey: ["user-posts", userUuid ?? "me"],
        initialPageParam: 1,
        queryFn: ({ pageParam = 1 }: { pageParam: unknown }) =>
            fetchUserPosts(userUuid, { page: pageParam as number | undefined, page_size: pageSize }),
        getNextPageParam: (lastPage) => {
            const { page, page_size, total } = lastPage;
            return page * page_size < total ? page + 1 : undefined;
        },
    });
}

export function useMyPosts(pageSize = 10) {
    return useUserPosts(undefined, pageSize);
}

export function useFeedPosts(pageSize = 10) {
    return useInfiniteQuery<PaginatedResponse<PostType>>({
        queryKey: ["feed-posts"],
        initialPageParam: 1,
        queryFn: ({ pageParam = 1 }: { pageParam: unknown }) =>
            fetchFeedPosts({ page: pageParam as number | undefined, page_size: pageSize }),
        getNextPageParam: (lastPage) => {
            const { page, page_size, total } = lastPage;
            return page * page_size < total ? page + 1 : undefined;
        },
    });
}

export function useCreatePost() {
    const queryClient = useQueryClient()

    return useMutation<CreatePostResponse, Error, CreatePostPayload>({
        mutationFn: createPost,
        onSuccess: (newPost, _) => {
            toast.success("Post created");

            queryClient.setQueryData(["user-posts", "me"], (oldData: any) => {
                if (!oldData || !Array.isArray(oldData.pages)) return oldData;

                const updatedPages = [...oldData.pages];
                updatedPages[0] = {
                    ...updatedPages[0],
                    results: [newPost, ...updatedPages[0].results],
                    total: updatedPages[0].total + 1,
                };

                return { ...oldData, pages: updatedPages };
            });

            queryClient.setQueryData(["feed-posts"], (oldData: any) => {
                if (!oldData || !Array.isArray(oldData.pages)) return oldData;

                const updatedPages = [...oldData.pages];
                updatedPages[0] = {
                    ...updatedPages[0],
                    results: [newPost, ...updatedPages[0].results],
                    total: updatedPages[0].total + 1,
                };

                return { ...oldData, pages: updatedPages };
            });
        },
        onError: (error) => {
            const message = (error as any)?.response?.data?.error || "Failed to create post";
            toast.error(message);
        },
    });
}

export function useLikePost(userUuid?: string) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: likePost,
        onSuccess: (_, postUuid) => {
            const keys = [["feed-posts"], ["user-posts", "me"]];
            if (userUuid && userUuid !== "me") {
                keys.push(["user-posts", userUuid]);
            }

            keys.forEach((key) => {
                queryClient.setQueriesData(
                    { queryKey: key },
                    (oldData: any) => {
                        if (!oldData || !Array.isArray(oldData.pages)) return oldData;

                        return {
                            ...oldData,
                            pages: oldData.pages.map((page: any) => ({
                                ...page,
                                results: page.results.map((post: PostType) =>
                                    post.uuid === postUuid
                                        ? {
                                            ...post,
                                            liked: true,
                                            likes_count: post.likes_count + 1,
                                        }
                                        : post
                                ),
                            })),
                        };
                    }
                );
            });
        },
        onError: (err) => {
            const errorMessage = (err as any)?.response?.data?.error || "Failed to like post.";
            toast.error(errorMessage);
        },
    });
}

export function useUnlikePost(userUuid?: string) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: unlikePost,
        onSuccess: (_, postUuid) => {
            const keys = [["feed-posts"], ["user-posts", "me"]];
            if (userUuid && userUuid !== "me") {
                keys.push(["user-posts", userUuid]);
            }

            keys.forEach((key) => {
                queryClient.setQueriesData(
                    { queryKey: key },
                    (oldData: any) => {
                        if (!oldData || !Array.isArray(oldData.pages)) return oldData;

                        return {
                            ...oldData,
                            pages: oldData.pages.map((page: any) => ({
                                ...page,
                                results: page.results.map((post: PostType) =>
                                    post.uuid === postUuid
                                        ? {
                                            ...post,
                                            liked: false,
                                            likes_count: Math.max(post.likes_count - 1, 0),
                                        }
                                        : post
                                ),
                            })),
                        };
                    }
                );
            });
        },
        onError: (err) => {
            const errorMessage = (err as any)?.response?.data?.error || "Failed to unlike post.";
            toast.error(errorMessage);
        },
    });
}

export function useUpdatePost(postUuid: string) {
    const queryClient = useQueryClient()

    return useMutation<PostType, Error, UpdatePostPayload>({
        mutationFn: (payload) => updatePost(postUuid, payload),
        onSuccess: (updatedPost) => {
            toast.success("Post updated")

            const keys: any[] = [["feed-posts"], ["user-posts", "me"]];

            if (updatedPost.created_by?.uuid && updatedPost.created_by.uuid !== "me") {
                keys.push(["user-posts", updatedPost.created_by.uuid]);
            }

            keys.forEach((key) => {
                queryClient.setQueriesData(
                    { queryKey: key },
                    (oldData: any) => {
                        if (!oldData || !Array.isArray(oldData.pages)) return oldData;

                        return {
                            ...oldData,
                            pages: oldData.pages.map((page: any) => ({
                                ...page,
                                results: page.results.map((post: PostType) =>
                                    post.uuid === updatedPost.uuid ? updatedPost : post
                                ),
                            })),
                        };
                    }
                );
            });

        },
        onError: (err) => {
            toast.error(err.message || "Failed to update post");
        },
    });
}
