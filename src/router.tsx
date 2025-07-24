import { createRootRoute, createRoute, createRouter, Outlet, redirect } from "@tanstack/react-router";
import Navbar from "./components/Navbar";
import HomePage from "./pages/Home";
import ProfilePage from "./pages/Profile";
import SignupPage from "./pages/Signup";
import LoginPage from "./pages/Login";
import toast from "react-hot-toast";
import { isAuthenticated } from "./utils/auth";
import UsersPage from "./pages/Users";

const rootRoute = createRootRoute({
    component: () => {
        return <>
            <Navbar />
            <Outlet />
        </>
    }
})

const signupRoute = createRoute({
    path: "/signup",
    component: SignupPage,
    getParentRoute: () => rootRoute,
    beforeLoad: ({ location }) => {
        if (isAuthenticated()) {
            const redirectTo = new URLSearchParams(location.search).get('redirect') || '/';
            toast.success("You are already logged in.");
            throw redirect({ to: redirectTo });
        }
    },
})

const loginRoute = createRoute({
    path: "/login",
    component: LoginPage,
    getParentRoute: () => rootRoute,
    beforeLoad: ({ location }) => {
        if (isAuthenticated()) {
            const redirectTo = new URLSearchParams(location.search).get('redirect') || '/';
            toast.success("You are already logged in.");
            throw redirect({ to: redirectTo });
        }
    },

})

const homeRoute = createRoute({
    path: "/",
    component: HomePage,
    getParentRoute: () => rootRoute,
    beforeLoad: () => {
        if (!isAuthenticated()) {
            toast.error("You must be logged in to view this page.");
            throw redirect({
                to: "/login",
                search: { redirect: "/" }
            })
        }
    },

})

const myProfileRoute = createRoute({
    path: "/profile",
    component: () => <ProfilePage isOwnProfile={true} />,
    getParentRoute: () => rootRoute,
    beforeLoad: () => {
        if (!isAuthenticated()) {
            toast.error("You must be logged in to view this page.");
            throw redirect({
                to: "/login",
                search: { redirect: "/profile" }
            })
        }
    },

})

const userProfileRoute = createRoute({
    path: "/profile/$uuid",
    component: ProfilePage,
    getParentRoute: () => rootRoute,
    beforeLoad: ({ params }) => {
        if (!isAuthenticated()) {
            toast.error("You must be logged in to view this page.");
            throw redirect({
                to: "/login",
                search: { redirect: `/profile/${params.uuid}` }
            })
        }
    },

})

const usersRoute = createRoute({
    path: "/users",
    component: UsersPage,
    getParentRoute: () => rootRoute,
    beforeLoad: () => {
        if (!isAuthenticated()) {
            toast.error("You must be logged in to view this page.");
            throw redirect({
                to: "/login",
                search: { redirect: "/users" },
            });
        }
    },
})

const routeTree = rootRoute.addChildren(
    [signupRoute, loginRoute, homeRoute, myProfileRoute, userProfileRoute, usersRoute]
)

export const router = createRouter({ routeTree })

declare module '@tanstack/react-router' {
    interface Register {
        router: typeof router
    }
}

