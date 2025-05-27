import { useMutation } from "@tanstack/react-query";
import { signup, login as loginAPI } from "../api/auth";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";
import { useNavigate } from "@tanstack/react-router";

export function useSignup() {
    const { login } = useAuth();
    const navigate = useNavigate();

    return useMutation({
        mutationFn: signup,
        onSuccess: (data) => {
            login(data);
            toast.success("Account Created!");
            navigate({ to: "/profile" });
        },
    });
}


export function useLogin() {
    const { login } = useAuth();
    const navigate = useNavigate();

    return useMutation({
        mutationFn: loginAPI,
        onSuccess: (data) => {
            login(data);
            toast.success("Welcome Back!");
            navigate({ to: "/" });
        },
    });
}