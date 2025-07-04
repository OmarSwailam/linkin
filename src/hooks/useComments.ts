import {
    useInfiniteQuery,
    type UseInfiniteQueryResult,
} from "@tanstack/react-query";
import { getPostComments } from "../api/comments";
import type { CommentType, PaginatedResponse } from "../types";

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
