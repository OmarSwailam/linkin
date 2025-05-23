import { createRootRoute, createRoute, createRouter, Outlet } from "@tanstack/react-router";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Profile from "./pages/Profile";

const rootRoute = createRootRoute({
    component: () => {
        return <>
            <Navbar />
            <Outlet />
        </>
    }
})

const homeRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: "/",
    component: Home
})

const profileRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: "/profile",
    component: Profile
})

const routeTree = rootRoute.addChildren([homeRoute, profileRoute])

export const router = createRouter({ routeTree })

declare module '@tanstack/react-router' {
    interface Register {
        router: typeof router
    }
}

