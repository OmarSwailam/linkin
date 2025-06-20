import { useQuery } from "@tanstack/react-query"
import { fetchUserPosts } from "../api/posts"
import type { PaginationQueryParams } from "../types"

export function usePosts(uuid?: string, queryParams?: PaginationQueryParams) {
    const key = uuid ? ["user", `${uuid}`, "posts"] : ["my-posts"]
    return useQuery({
        queryKey: key,
        queryFn: () => fetchUserPosts(uuid, queryParams),
        staleTime: uuid ? 0 : 1000 * 60 * 60 * 24,
    })
}