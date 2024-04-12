import {Navigate, RouteObject} from "react-router-dom";
import {Suspense} from "react";
import {Films, Film} from "@/pages";

export const routerConfig:RouteObject[] = [
    {
        path: '/',
        element: <Navigate to="/films" replace />,
    },
    {
        path: '/films',
        element: (
            <Suspense fallback={'Loading...'}>
                <Films />
            </Suspense>
        ),
    },
    {
        path: '/films/:filmId',
        element: (
            <Suspense fallback={'Loading...'}>
                <Film />
            </Suspense>
        )
    }
]