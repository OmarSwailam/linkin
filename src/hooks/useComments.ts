import {
    useInfiniteQuery,
    useMutation,
    useQueryClient,
    type InfiniteData,
} from "@tanstack/react-query";
import { createCommentOnPost, createReply, getCommentReplies, getPostComments, likeComment, likeReply, unlikeComment, unlikeReply } from "../api/comments";
import type { CommentType, CreateCommentPayload, CreateCommentResponse, CreateReplyPayload, CreateReplyResponse, PaginatedResponse, ReplyType } from "../types";
import toast from "react-hot-toast";

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


export function useCreateCommentOnPost(postUuid: string) {
    const queryClient = useQueryClient()

    return useMutation<CreateCommentResponse, Error, CreateCommentPayload>({
        mutationFn: createCommentOnPost,
        onSuccess: (newComment) => {
            toast.success("Comment posted")

            queryClient.setQueriesData<InfiniteData<PaginatedResponse<CommentType>>>(
                { queryKey: ["post-comments", postUuid] },
                (oldData) => {
                    if (!oldData?.pages?.[0]) return oldData

                    const updatedPages = [...oldData.pages]
                    updatedPages[0] = {
                        ...updatedPages[0],
                        results: [newComment, ...updatedPages[0].results],
                        total: updatedPages[0].total + 1,
                    }

                    return { ...oldData, pages: updatedPages }
                }
            )
        },
        onError: (err) => {
            toast.error(err.message || "Failed to post comment")
        },
    })
}

export function useLikeComment(postUuid: string) {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: likeComment,
        onSuccess: (_, commentUuid) => {
            queryClient.setQueriesData<InfiniteData<PaginatedResponse<CommentType>>>(
                { queryKey: ["post-comments", postUuid] },
                (oldData) => {
                    if (!oldData) return oldData

                    const updatedPages = oldData.pages.map((page) => ({
                        ...page,
                        results: page.results.map((comment) =>
                            comment.uuid === commentUuid
                                ? {
                                    ...comment,
                                    liked: true,
                                    likes_count: comment.likes_count + 1,
                                }
                                : comment
                        ),
                    }))

                    return { ...oldData, pages: updatedPages }
                }
            )
        },
        onError: (err) => {
            toast.error((err as any)?.response?.data?.error || "Failed to like comment.")
        },
    })
}

export function useUnlikeComment(postUuid: string) {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: unlikeComment,
        onSuccess: (_, commentUuid) => {
            queryClient.setQueriesData<InfiniteData<PaginatedResponse<CommentType>>>(
                { queryKey: ["post-comments", postUuid] },
                (oldData) => {
                    if (!oldData) return oldData

                    const updatedPages = oldData.pages.map((page) => ({
                        ...page,
                        results: page.results.map((comment) =>
                            comment.uuid === commentUuid
                                ? {
                                    ...comment,
                                    liked: false,
                                    likes_count: Math.max(comment.likes_count - 1, 0),
                                }
                                : comment
                        ),
                    }))

                    return { ...oldData, pages: updatedPages }
                }
            )
        },
        onError: (err) => {
            toast.error((err as any)?.response?.data?.error || "Failed to unlike comment.")
        },
    })
}


export function useCommentReplies(
    commentUuid?: string,
    pageSize: number = 5,
    enabled: boolean = true
) {
    return useInfiniteQuery<PaginatedResponse<ReplyType>>({
        queryKey: ["comment-replies", commentUuid],
        initialPageParam: 1,
        queryFn: ({ pageParam = 1 }: { pageParam: unknown }) =>
            getCommentReplies(commentUuid!, { page: pageParam as number | undefined, page_size: pageSize }),
        getNextPageParam: (lastPage) => {
            const hasMore =
                lastPage.page * lastPage.page_size < lastPage.total;
            return hasMore ? lastPage.page + 1 : undefined;
        },
        enabled: !!commentUuid && enabled,
    })
}


export function useCreateReply(commentUuid: string) {
    const queryClient = useQueryClient()

    return useMutation<CreateReplyResponse, Error, CreateReplyPayload>({
        mutationFn: createReply,
        onSuccess: (newReply) => {
            toast.success("Reply added")

            queryClient.setQueriesData<InfiniteData<PaginatedResponse<ReplyType>>>(
                { queryKey: ["comment-replies", commentUuid] },
                (oldData) => {
                    if (!oldData?.pages?.[0]) return oldData

                    const updatedPages = [...oldData.pages]
                    updatedPages[0] = {
                        ...updatedPages[0],
                        results: [newReply, ...updatedPages[0].results],
                        total: updatedPages[0].total + 1,
                    }

                    return { ...oldData, pages: updatedPages }
                }
            )
        },
        onError: (err) => {
            toast.error(err.message || "Failed to add reply")
        },
    })
}


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
