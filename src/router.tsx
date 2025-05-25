import { createRootRoute, createRoute, createRouter, Outlet } from "@tanstack/react-router";
import Navbar from "./components/Navbar";
import HomePage from "./pages/Home";
import ProfilePage from "./pages/Profile";
import SignupPage from "./pages/Signup";
import LoginPage from "./pages/Login";

const rootRoute = createRootRoute({
    component: () => {
        return <>
            <Navbar />
            <Outlet />
        </>
    }
})

const signupRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: "/signup",
    component: SignupPage
})

const loginRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: "/login",
    component: LoginPage
})

const homeRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: "/",
    component: HomePage
})

const profileRoute = createRoute({
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

