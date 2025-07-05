import {
    useInfiniteQuery,
    useMutation,
    useQueryClient,
    type UseInfiniteQueryResult,
} from "@tanstack/react-query";
import { getPostComments, likeComment, unlikeComment } from "../api/comments";
import type { CommentType, PaginatedResponse } from "../types";
import toast from "react-hot-toast";

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
