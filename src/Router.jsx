import { createBrowserRouter, RouterProvider } from "react-router-dom";
import App from "./App";
import Auth from "./components/Auth";
import Homepage from "./components/Homepage";


const Router = () => {
    const router = createBrowserRouter([
        {
            path: "/",
            element: <App />,
            children: [
                {
                 path: "/home",
                 element: <Homepage />
                },
                {
                    path: "/auth",
                    element: <Auth />
                }
            ],
        }
    ])
    return <RouterProvider router={router} />
}

export default Router