import { useEffect } from "react";
import { useSearch } from "@tanstack/react-router";
import { useUsers } from "../../hooks/useUser";
import { AxiosError } from "axios";
import UserCard from "../../components/UserCard";
import toast from "react-hot-toast";
import "./users.css";

export default function UsersPage() {
    const search = useSearch({ from: "/users" });

    const {
        data,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
        isLoading,
        isError,
        error,
    } = useUsers(search);

    const allUsers = data?.pages.flatMap((page) => page.results) ?? [];

    useEffect(() => {
        const handleScroll = async () => {
            if (
                window.innerHeight + document.documentElement.scrollTop + 1 >=
                document.documentElement.scrollHeight
            ) {
                if (hasNextPage) {
                    fetchNextPage();
                }
            }
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, [hasNextPage, fetchNextPage]);

    useEffect(() => {
        if (isError && error instanceof AxiosError) {
            toast.error(
                (error.response?.data as { error?: string })?.error ||
                "Failed to load users"
            );
        }
    }, [isError, error]);

    return (
        <div className="users-page">
            {isLoading && <p>Loading...</p>}
            {!isLoading && allUsers.length === 0 && <p>No users found.</p>}

            <div className="users-grid">
                {allUsers.map((user) => (
                    <UserCard
                        key={user.uuid}
                        user={user}
                        showFollowButton
                    />
                ))}
            </div>

            {isFetchingNextPage && (
                <p className="loading-more">Loading more users...</p>
            )}
        </div>
    );
}
