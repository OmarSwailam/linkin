import { useQuery } from "@tanstack/react-query";
import type { User } from "../types";
import { fetchUser } from "../api/users";

export function useUser(uuid?: string) {
    const hasToken = !!localStorage.getItem("access_token");

    return useQuery<User, Error>({
        queryKey: ["user", uuid || "me"],
        queryFn: () => fetchUser({ uuid }),
        staleTime: uuid ? 0 : 1000 * 5 * 60,
        enabled: hasToken,
    });
}
