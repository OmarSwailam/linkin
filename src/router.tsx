import { createRootRoute, createRoute, createRouter, Outlet, redirect } from "@tanstack/react-router";
import Navbar from "./components/Navbar";
import HomePage from "./pages/Home";
import ProfilePage from "./pages/Profile";
import SignupPage from "./pages/Signup";
import LoginPage from "./pages/Login";
import type { AuthContextType } from "./context/AuthContext";
import toast from "react-hot-toast";

const rootRoute = createRootRoute({
    component: () => {
        return <>
            <Navbar />
            <Outlet />
        </>
    }
})

const signupRoute = createRoute({
    beforeLoad: ({ context, location }) => {
        const { isAuthenticated } = context;
        if (isAuthenticated) {
            const redirectTo= new URLSearchParams(location.search).get('redirect') || '/';
            toast.success("You are already logged in.");
            if (redirectParam) {
                toast.success("You are already logged in.");
                throw redirect({ to: redirectParam });
            }
            
        }
    },
    getParentRoute: () => rootRoute,
    path: "/signup",
    component: SignupPage
})

const loginRoute = createRoute({
    beforeLoad: ({ context, location }) => {
        const { isAuthenticated } = context;
        if (isAuthenticated) {
            const redirectTo = new URLSearchParams(location.search).get('redirect') || '/';
            toast.success("You are already logged in.");
            throw redirect({
                to: redirectTo
            });
        }
    },
    getParentRoute: () => rootRoute,
    path: "/login",
    component: LoginPage
})

const homeRoute = createRoute({
    beforeLoad: ({ context }) => {
        const { isAuthenticated } = context;
        if (!isAuthenticated) {
            toast.error("You must be logged in to view this page.");
            throw redirect({
                to: "/login",
                search: { redirect: "/" }
            })
        }
    },
    getParentRoute: () => rootRoute,
    path: "/",
    component: HomePage
})

const profileRoute = createRoute({
    beforeLoad: ({ context }) => {
        const { isAuthenticated } = context;
        if (!isAuthenticated) {
            toast.error("You must be logged in to view this page.");
            throw redirect({
                to: "/login",
                search: { redirect: "/profile" }
            })
        }
    },
    getParentRoute: () => rootRoute,
    path: "/profile",
    component: ProfilePage
})

const routeTree = rootRoute.addChildren([signupRoute, loginRoute, homeRoute, profileRoute])

export const router = createRouter({ routeTree })

declare module '@tanstack/react-router' {
    interface Register {
        router: typeof router
    }
}

