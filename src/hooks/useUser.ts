import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { User, UpdateUserResponse, UpdateUserPayload } from "../types";
import { fetchUser, updateUser } from "../api/users";
import toast from "react-hot-toast";

export function useUser(uuid?: string) {
    const hasToken = !!localStorage.getItem("access_token");

    return useQuery<User, Error>({
        queryKey: ["user", uuid || "me"],
        queryFn: () => fetchUser({ uuid }),
        staleTime: uuid ? 0 : 1000 * 5 * 60,
        enabled: hasToken,
    });
}

export function useUpdateUser() {
    const queryClient = useQueryClient()

    return useMutation<UpdateUserResponse, Error, UpdateUserPayload>({
        mutationFn: updateUser,
        onSuccess: (data) => {
            queryClient.setQueryData(["user", "me"], data.user);
            toast.success(data.message);
        },
        onError: (err) => {
            toast.error(err.response.data.error || "Failed to update user.");
        },
    })
}