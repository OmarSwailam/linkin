import {
    useInfiniteQuery,
    useMutation,
    useQueryClient,
    type InfiniteData,
    type UseInfiniteQueryResult,
} from "@tanstack/react-query";
import { createCommentOnPost, createReplayOnComment, getCommentReplies, getPostComments, likeComment, likeReply, unlikeComment, unlikeReply } from "../api/comments";
import type { CommentReplyType, CommentType, CreateCommentPayload, CreateCommentResponse, CreateReplayPayload, PaginatedResponse } from "../types";
import toast from "react-hot-toast";
import type { AxiosError } from "axios";

// typescript is shit

export function usePostComments(
    postUuid?: string,
    pageSize = 10,
    enabled = true
) {
    return useInfiniteQuery<PaginatedResponse<CommentType>>({
        queryKey: ["post-comments", postUuid],
        initialPageParam: 1,
        queryFn: ({ pageParam = 1 }: { pageParam: unknown }) =>
            getPostComments(postUuid, { page: pageParam as number | undefined, page_size: pageSize }),
        getNextPageParam: (lastPage) => {
            const hasMore =
                lastPage.page * lastPage.page_size < lastPage.total;
            return hasMore ? lastPage.page + 1 : undefined;
        },
        enabled: !!postUuid && enabled,

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

    return useMutation<CreateCommentResponse, Error, CreateCommentPayload>({
        mutationFn: createCommentOnPost,
        onSuccess: (newComment, variables) => {

        },
        onError: (error) => {
            toast.error(error.message || "Failed to create comment.");
        },
    });
}

// export function useCommentReplies(commentUuid: string, pageSize = 5, enabled = true) {
//     return useInfiniteQuery<PaginatedResponse<CommentReplyType>>({
//         queryKey: ["comment-replies", commentUuid],
//         queryFn: ({ pageParam = 1 }) =>
//             getCommentReplies(commentUuid, { page: pageParam, page_size: pageSize }),
//         initialPageParam: 1,
//         enabled: !!commentUuid && enabled,
//         getNextPageParam: (lastPage) => {
//             const hasMore = lastPage.page * lastPage.page_size < lastPage.total;
//             return hasMore ? lastPage.page + 1 : undefined;
//         },
//     });
// }

// export function useLikeReply(commentUuid: string) {
//     const queryClient = useQueryClient();

//     return useMutation({
//         mutationFn: likeReply,
//         onSuccess: (data, replyUuid) => {
//             queryClient.setQueriesData(["comment-replies", commentUuid], (oldData: any) => {
//                 if (!oldData || !Array.isArray(oldData.pages)) return oldData;

//                 return {
//                     ...oldData,
//                     pages: oldData.pages.map((page: any) => ({
//                         ...page,
//                         results: Array.isArray(page.results)
//                             ? page.results.map((reply: any) =>
//                                 reply.uuid === replyUuid
//                                     ? {
//                                         ...reply,
//                                         liked: true,
//                                         likes_count: reply.likes_count + 1,
//                                     }
//                                     : reply
//                             )
//                             : [],
//                     })),
//                 };
//             });
//         },
//         onError: (err: any) => {
//             toast.error(err.response?.data?.error || "Failed to like reply.");
//         },
//     });
// }

// export function useUnlikeReply(commentUuid: string) {
//     const queryClient = useQueryClient();

//     return useMutation({
//         mutationFn: unlikeReply,
//         onSuccess: (data, replyUuid) => {
//             queryClient.setQueriesData(["comment-replies", commentUuid], (oldData: any) => {
//                 if (!oldData || !Array.isArray(oldData.pages)) return oldData;

//                 return {
//                     ...oldData,
//                     pages: oldData.pages.map((page: any) => ({
//                         ...page,
//                         results: Array.isArray(page.results)
//                             ? page.results.map((reply: any) =>
//                                 reply.uuid === replyUuid
//                                     ? {
//                                         ...reply,
//                                         liked: false,
//                                         likes_count: Math.max(reply.likes_count - 1, 0),
//                                     }
//                                     : reply
//                             )
//                             : [],
//                     })),
//                 };
//             });
//         },
//         onError: (err: any) => {
//             toast.error(err.response?.data?.error || "Failed to unlike reply.");
//         },
//     });
// }

// export function useCreateReplyOnComment(commentUuid: string, postUuid: string) {
//     const queryClient = useQueryClient();

//     return useMutation<CommentReplyType, Error, CreateReplayPayload>({
//         mutationFn: createReplayOnComment,
//         onSuccess: (newReply, variables) => {
//             toast.success("Reply added");

//             queryClient.setQueriesData(
//                 ["comment-replies", commentUuid],
//                 (
//                     oldData: InfiniteData<PaginatedResponse<CommentReplyType>> | undefined
//                 ) => {
//                     if (!oldData?.pages || !Array.isArray(oldData.pages)) return oldData;

//                     const firstPage = oldData.pages[0];
//                     const rest = oldData.pages.slice(1);

//                     return {
//                         ...oldData,
//                         pages: [
//                             {
//                                 ...firstPage,
//                                 results: [newReply, ...firstPage.results],
//                                 total: firstPage.total + 1,
//                             },
//                             ...rest,
//                         ],
//                         pageParams: oldData.pageParams ?? [1],
//                     };
//                 }
//             );

//             queryClient.invalidateQueries(["post-comments", postUuid]);
//         },
//         onError: (error) => {
//             toast.error(error.message || "Failed to add reply.");
//         },
//     });
// }
