import { useInfiniteQuery } from "@tanstack/react-query"
import { fetchUserPosts } from "../api/posts"
import type { PaginatedResponse, Post } from "../types";

export function usePosts(userUuid?: string) {
    const key = userUuid ? ["user", `${userUuid}`, "posts"] : ["my-posts"]
    return useInfiniteQuery({
        queryKey: key,
        queryFn: ({ pageParam = 1 }) => fetchUserPosts(userUuid, { page: pageParam, page_size: 10 }),
        staleTime: userUuid ? 0 : 1000 * 60 * 60 * 24,
        getNextPageParam: (lastPage: PaginatedResponse<Post>) => {
            const hasMore = lastPage.page * lastPage.page_size < lastPage.total;
            return hasMore ? lastPage.page + 1 : undefined;
        },
        refetchOnWindowFocus: false
    })
}