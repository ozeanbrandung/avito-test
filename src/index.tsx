import {createRoot} from "react-dom/client";
import {App} from "@/components/App";
import {createBrowserRouter, RouterProvider} from "react-router-dom";
import Film from "@/pages/Film";
import {StrictMode, Suspense} from "react";
import {QueryClient, QueryClientProvider} from "@tanstack/react-query";

const root = document.getElementById('root');

 if (!root) {
     throw new Error('root not found')
 }

 const container = createRoot(root);

const router = createBrowserRouter([
    {
        path: "/",
        element: <App />,
        children: [
            // {
            //     path: '/films',
            //     element: <Suspense fallback={'Loading...'}>
            //         <Films />
            //     </Suspense>
            // },
            {
                path: '/films/:filmId',
                element: <Suspense fallback={'Loading...'}>
                    <Film />
                </Suspense>
            }
        ]
    },
]);

const queryClient = new QueryClient(/*{defaultOptions: {queries: {}}}*/)

container.render(
    <StrictMode>
        <QueryClientProvider client={queryClient}>
            <RouterProvider router={router} />
        </QueryClientProvider>
    </StrictMode>
);