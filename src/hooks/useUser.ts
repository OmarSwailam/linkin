import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { User, UpdateUserResponse, UpdateUserPayload } from "../types";
import { fetchUser, updateUser } from "../api/users";
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
        onError: (err) => {
            toast.error(err.response?.data?.error || "Failed to update user.");
        },
    })
}