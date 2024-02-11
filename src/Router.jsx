import { createBrowserRouter, RouterProvider } from "react-router-dom";
import App from "./App";
import Auth from "./components/Auth";
import Homepage from "./components/Homepage";
import Profile from "./components/Profile";
import ProfileSettings from "./components/ProfileSettings";
import ErrorPage from "./components/ErrorPage";

const Router = () => {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <App />,
      children: [
        {
          path: "/home",
          element: <Homepage />,
        },
        {
          path: "/auth",
          element: <Auth />,
        },
        {
          path: "/profile",
          children: [
            {
              path: "/profile/:id/settings",
              element: <ProfileSettings />,
            },
            {
              path: "/profile/:id",
              element: <Profile />,
            },
          ],
        },
      ],
    },
    {
      path: "*",
      element: <ErrorPage />
    }
  ]);
  return <RouterProvider router={router} />;
};

export default Router;
