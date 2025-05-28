import { useQuery } from "@tanstack/react-query";
import type { User } from "../types";
import { fetchUser } from "../api/users";

export function useUserProfile(uuid?: string) {
    return useQuery<User, Error>({
        queryKey: ["user", uuid || "me"],
        queryFn: () => fetchUser({ uuid }),
        staleTime: 1000 * 5 * 60,
    });
}
