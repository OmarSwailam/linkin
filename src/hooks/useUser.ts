import { useQuery, useMutation, useQueryClient, useInfiniteQuery } from "@tanstack/react-query";
import type { InfiniteData } from "@tanstack/react-query";
import type { User, UpdateUserResponse, UpdateUserPayload, PaginatedResponse } from "../types";
import { addSkill, fetchFollowList, fetchUser, followUser, removeSkill, unfollowUser, updateUser } from "../api/users";
import toast from "react-hot-toast";
import type { AxiosError } from "axios";
import { isAuthenticated } from "../utils/auth";

export function useUser(uuid?: string) {
    return useQuery<User, Error>({
        queryKey: ["user", uuid || "me"],
        queryFn: () => fetchUser({ uuid }),
        staleTime: uuid ? 0 : 1000 * 60 * 60 * 24,
        enabled: isAuthenticated(),
    });
}

export function useUpdateUser() {
    const queryClient = useQueryClient()

    return useMutation<UpdateUserResponse, AxiosError, UpdateUserPayload>({
        mutationFn: updateUser,
        onSuccess: (data) => {
            queryClient.setQueryData(["user", "me"], data.user);
            toast.success(data.message);
        },
        onError: (error) => {
            const err = error as AxiosError<{ error: string }>;
            return toast.error(err.response?.data?.error || "Failed to update user.");
        },
    })
}

export function useAddSkill() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: addSkill,
        onSuccess: (_, payload) => {
            queryClient.setQueryData<User>(["user", "me"], (old) =>
                old ? { ...old, skills: [payload.name, ...old.skills] } : old
            )
        },
        onError: (error) => {
            const err = error as AxiosError<{ error: string }>;
            return toast.error(err.response?.data?.error || "Failed to add skill.");
        },
    })
}

export function useRemoveSkill() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: removeSkill,
        onSuccess: (_, payload) => {
            queryClient.setQueryData<User>(["user", "me"], (old) =>
                old ? { ...old, skills: old.skills.filter((s) => s !== payload.name) } : old
            )
        },
        onError: (error) => {
            const err = error as AxiosError<{ error: string }>;
            return toast.error(err.response?.data?.error || "Failed to remove skill.");
        },
    })
}

export function useFollowUser(userUuid: string) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: () => followUser(userUuid),
        onSuccess: (data) => {
            toast.success(data.message);

            // Update target user data
            queryClient.setQueryData<User>(["user", userUuid], (old) =>
                old ? {
                    ...old,
                    is_following: true,
                    followers_count: old.followers_count + 1,
                } : old
            );

            // Update current user's following count
            queryClient.setQueryData<User>(["user", "me"], (old) =>
                old ? {
                    ...old,
                    following_count: old.following_count + 1,
                } : old
            );

            // Update follow lists
            queryClient.setQueriesData<InfiniteData<PaginatedResponse<User>>>(
                { queryKey: ['follow-list'] },
                (old: InfiniteData<PaginatedResponse<User>> | undefined) => {
                    if (!old) return old;
                    return {
                        ...old,
                        pages: old.pages.map((page: PaginatedResponse<User>) => ({
                            ...page,
                            results: page.results.map((user: User) =>
                                user.uuid === userUuid
                                    ? { ...user, is_following: true, followers_count: user.followers_count + 1 }
                                    : user
                            )
                        }))
                    };
                }
            );
        },
        onError: (err: any) => {
            toast.error(err?.response?.data?.error || "Failed to follow user");
        },
    });
}

export function useUnfollowUser(userUuid: string) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: () => unfollowUser(userUuid),
        onSuccess: (data) => {
            toast.success(data.message);

            queryClient.setQueryData<User>(["user", userUuid], (old) =>
                old ? {
                    ...old,
                    is_following: false,
                    followers_count: Math.max(0, old.followers_count - 1),
                } : old
            );

            queryClient.setQueryData<User>(["user", "me"], (old) =>
                old ? {
                    ...old,
                    following_count: Math.max(0, old.following_count - 1),
                } : old
            );

            queryClient.setQueriesData<InfiniteData<PaginatedResponse<User>>>(
                { queryKey: ['follow-list'] },
                (old: InfiniteData<PaginatedResponse<User>> | undefined) => {
                    if (!old) return old;
                    return {
                        ...old,
                        pages: old.pages.map((page: PaginatedResponse<User>) => ({
                            ...page,
                            results: page.results.map((user: User) =>
                                user.uuid === userUuid
                                    ? { ...user, is_following: false, followers_count: Math.max(0, user.followers_count - 1) }
                                    : user
                            )
                        }))
                    };
                }
            );
        },
        onError: (err: any) => {
            toast.error(err?.response?.data?.error || "Failed to unfollow user");
        },
    });
}

export function useFollowList(type: 'followers' | 'following', userUuid?: string) {
    return useInfiniteQuery<PaginatedResponse<User>, AxiosError>({
        queryKey: ['follow-list', type, userUuid || 'me'],
        queryFn: ({ pageParam = 1 }) =>
            fetchFollowList(userUuid, type, { page: pageParam as number | undefined, page_size: 10 }),
        initialPageParam: 1,
        getNextPageParam: (lastPage) => {
            const hasMore = lastPage.page * lastPage.page_size < lastPage.total;
            return hasMore ? lastPage.page + 1 : undefined;
        },
        enabled: type === 'followers' || type === 'following'
    });
}