import { useInfiniteQuery } from "@tanstack/react-query"
import { fetchUserPosts } from "../api/posts"
import type { PaginatedResponse, Post } from "../types";

export function usePosts(uuid?: string) {
    const key = uuid ? ["user", `${uuid}`, "posts"] : ["my-posts"]
    return useInfiniteQuery({
        queryKey: key,
        queryFn: ({ pageParam = 1 }) => fetchUserPosts(uuid, { page: pageParam, page_size: 10 }),
        staleTime: uuid ? 0 : 1000 * 60 * 60 * 24,
        getNextPageParam: (lastPage: PaginatedResponse<Post>) => {
            const hasMore = lastPage.page * lastPage.page_size < lastPage.total;
            return hasMore ? lastPage.page + 1 : undefined;
        },
        refetchOnWindowFocus: false
    })
}