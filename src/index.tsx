import {createRoot} from "react-dom/client";
import {createBrowserRouter, RouterProvider} from "react-router-dom";
import {StrictMode} from "react";
import {QueryClient, QueryClientProvider} from "@tanstack/react-query";
import {routerConfig} from "@/router/config";
import './styles/reset.scss';
import './styles/default.scss';

const root = document.getElementById('root');

 if (!root) {
     throw new Error('root not found')
 }

 const container = createRoot(root);

const router = createBrowserRouter(routerConfig);

const queryClient = new QueryClient(/*{defaultOptions: {queries: {}}}*/)

container.render(
    <StrictMode>
        <QueryClientProvider client={queryClient}>
            <RouterProvider router={router} />
        </QueryClientProvider>
    </StrictMode>
);