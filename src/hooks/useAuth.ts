import { useMutation, useQueryClient } from "@tanstack/react-query";
import { signup, login } from "../api/auth";
import toast from "react-hot-toast";
import { useNavigate } from "@tanstack/react-router";
import { clearTokens, storeTokens } from "../utils/auth";

export function useSignup() {
    const navigate = useNavigate();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: signup,
        onSuccess: async (data) => {
            storeTokens(data);
            await queryClient.invalidateQueries({ queryKey: ["user", "me"] });
            toast.success("Account Created!");
            navigate({ to: "/profile" });
        },
    });
}


export function useLogin() {
    const navigate = useNavigate();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: login,
        onSuccess: async (data) => {
            storeTokens(data);
            await queryClient.invalidateQueries({ queryKey: ["user", "me"] });
            toast.success("Welcome Back!");
            navigate({ to: "/" });
        },
    });
}

export function useLogout() {
    const navigate = useNavigate();
    const queryClient = useQueryClient();

    return () => {
        clearTokens();
        queryClient.removeQueries({ queryKey: ["user", "me"] });
        toast.success("Logged out!");
        navigate({ to: "/login" });
    };
}