import { createBrowserRouter, RouterProvider } from "react-router-dom";
import App from "./App";
import Auth from "./reducers/auth";


const Router = () => {
    const router = createBrowserRouter([
        {
            path: "/",
            element: <App />,
            children: [
                {
                    path:"/authentication",
                    element: <Auth />

                }
            ]
        }
    ])
    return <RouterProvider router={router} />
}

export default Router