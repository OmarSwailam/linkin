import { useState, type FormEvent } from "react";
import { useSignup } from "../../hooks/useAuth";
import toast from 'react-hot-toast';
import type { AxiosError } from "axios";
import { useNavigate, useSearch } from "@tanstack/react-router";

export default function SignupForm() {
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const search = useSearch({ from: '/login' });
    const navigate = useNavigate();

    const signupMutation = useSignup();

    function handleSubmit(e: FormEvent<HTMLFormElement>) {
        e.preventDefault();
        if (!firstName || !lastName || !email || !password) return;
        signupMutation.mutate(
            { first_name: firstName, last_name: lastName, email, password },
            {
                onSuccess: () => {
                    setFirstName("");
                    setLastName("");
                    setEmail("");
                    setPassword("");

                    const redirectTo = search.redirect || '/';
                    navigate({ to: redirectTo });

                },
            }
        );

        if (signupMutation.isError) {
            const axiosError = signupMutation.error as AxiosError<{ error: string }>;
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
        <label htmlFor="first-name">First Name</label>
        <input value={firstName} onChange={(e) => setFirstName(e.target.value)}
            id="first-name" name="first-name" type="text" placeholder="John" required />

        <label htmlFor="last-name">Last Name</label>
        <input value={lastName} onChange={(e) => setLastName(e.target.value)}
            id="last-name" name="last-name" type="text" placeholder="Doe" required />

        <label htmlFor="email">Email</label>
        <input value={email} onChange={(e) => setEmail(e.target.value)}
            id="email" name="email" type="email" placeholder="johndoe@example.com" required />

        <label htmlFor="password">Password</label>
        <input value={password} onChange={(e) => setPassword(e.target.value)}
            id="password" name="password" type="password" placeholder="********" required />

        {
            signupMutation.isPending ?
                <button type="submit" disabled>SIGNING...</button>
                : <button type="submit">SIGNUP</button>
        }

    </form>
}