import {
    useInfiniteQuery,
    useMutation,
    useQueryClient,
    type UseInfiniteQueryResult,
} from "@tanstack/react-query";
import { createCommentOnPost, getCommentReplies, getPostComments, likeComment, unlikeComment } from "../api/comments";
import type { CommentReplyType, CommentType, CreateCommentPayload, CreateCommentResponse, PaginatedResponse } from "../types";
import toast from "react-hot-toast";
import { updateCommentCountInAllPosts } from "../utils/helpers";

// typescript is shit

export function useComments(
    postUuid?: string,
    pageSize = 10,
    enabled = true
): UseInfiniteQueryResult<PaginatedResponse<CommentType>, Error> {
    return useInfiniteQuery<
        PaginatedResponse<CommentType>,
        Error,
        PaginatedResponse<CommentType>,
        [string, string?],
        number
    >({
        queryKey: ["post-comments", postUuid],
        queryFn: ({ pageParam = 1 }) =>
            getPostComments(postUuid, { page: pageParam, page_size: pageSize }),
        initialPageParam: 1,
        enabled: !!postUuid && enabled,
        getNextPageParam: (lastPage) => {
            const hasMore =
                lastPage.page * lastPage.page_size < lastPage.total;
            return hasMore ? lastPage.page + 1 : undefined;
        },
    });
}



export function useLikeComment(postUuid: string) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: likeComment,
        onSuccess: (data, commentUuid) => {
            queryClient.setQueriesData(["post-comments", postUuid], (oldData: any) => {
                if (!oldData || !Array.isArray(oldData.pages)) return oldData;

                return {
                    ...oldData,
                    pages: oldData.pages.map((page: any) => ({
                        ...page,
                        results: Array.isArray(page.results)
                            ? page.results.map((comment: any) =>
                                comment.uuid === commentUuid
                                    ? {
                                        ...comment,
                                        liked: true,
                                        likes_count: comment.likes_count + 1,
                                    }
                                    : comment
                            )
                            : [],
                    })),
                };
            });
        },
        onError: (err) => {
            toast.error(err.response?.data?.error || "Failed to like comment.");
        },
    });
}

export function useUnlikeComment(postUuid: string) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: unlikeComment,
        onSuccess: (data, commentUuid) => {
            queryClient.setQueriesData(["post-comments", postUuid], (oldData: any) => {
                if (!oldData || !Array.isArray(oldData.pages)) return oldData;

                return {
                    ...oldData,
                    pages: oldData.pages.map((page: any) => ({
                        ...page,
                        results: Array.isArray(page.results)
                            ? page.results.map((comment: CommentType) =>
                                comment.uuid === commentUuid
                                    ? {
                                        ...comment,
                                        liked: false,
                                        likes_count: Math.max(comment.likes_count - 1, 0),
                                    }
                                    : comment
                            )
                            : [],
                    })),
                };
            });
        },
        onError: (err) => {
            toast.error(err.response?.data?.error || "Failed to unlike comment.");
        },
    });
}

export function useCreateCommentOnPost(postUuid: string) {
    const queryClient = useQueryClient();

    return useMutation<CreateCommentResponse, Error, CreateCommentPayload>({
        mutationFn: createCommentOnPost,
        onSuccess: (newComment, variables) => {
            toast.success("Comment created");

            queryClient.setQueriesData(
                ["post-comments", postUuid],
                (oldData: PaginatedResponse<CommentType> | undefined) => {
                    if (!oldData || !Array.isArray(oldData.pages)) return oldData;

                    return {
                        ...oldData,
                        pages: [
                            {
                                ...oldData.pages[0],
                                results: [newComment, ...oldData.pages[0].results],
                            },
                            ...oldData.pages.slice(1),
                        ],
                    };
                }
            );

            if (variables.post_uuid) {
                updateCommentCountInAllPosts(queryClient, variables.post_uuid);
            }
        },
        onError: (error) => {
            toast.error(error.message || "Failed to create comment.");
        },
    });
}

export function useCommentReplies(commentUuid: string, pageSize = 5, enabled = true) {
    return useInfiniteQuery<PaginatedResponse<CommentReplyType>>({
        queryKey: ["comment-replies", commentUuid],
        queryFn: ({ pageParam = 1 }) =>
            getCommentReplies(commentUuid, { page: pageParam, page_size: pageSize }),
        initialPageParam: 1,
        enabled: !!commentUuid && enabled,
        getNextPageParam: (lastPage) => {
            const hasMore = lastPage.page * lastPage.page_size < lastPage.total;
            return hasMore ? lastPage.page + 1 : undefined;
        },
    });
}