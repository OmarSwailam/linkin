import { useState, type FormEvent } from "react";
import { useLogin } from "../../hooks/useAuth";
import toast from 'react-hot-toast';
import type { AxiosError } from "axios";

export default function LoginForm() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const loginMutation = useLogin();

    function handleSubmit(e: FormEvent<HTMLFormElement>) {
        e.preventDefault();
        if (!email || !password) return;
        loginMutation.mutate(
            { email, password },
            {
                onSuccess: () => {
                    setEmail("");
                    setPassword("");
                },
            }
        );

        if (loginMutation.isError) {
            const axiosError = loginMutation.error as AxiosError<{ error: string }>;
            const status = axiosError.response?.status;
            const apiMessage = axiosError.response?.data?.error;

            let message = apiMessage || "Something went wrong, please try again.";

            if (status === 500) {
                message = "Internal server error. Please try again later.";
            }

            toast.error(message);
        }
    }

    return <form className="auth-form" onSubmit={handleSubmit}>
        <label htmlFor="email">Email</label>
        <input value={email} onChange={(e) => setEmail(e.target.value)}
            id="email" name="email" type="email" placeholder="johndoe@example.com" required />

        <label htmlFor="password">Password</label>
        <input value={password} onChange={(e) => setPassword(e.target.value)}
            id="password" name="password" type="password" placeholder="********" required />

        {
            loginMutation.isPending ?
                <button type="submit" disabled>LOGIN...</button>
                : <button type="submit">LOGIN</button>
        }

    </form>
}