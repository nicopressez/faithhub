import { createBrowserRouter, RouterProvider } from "react-router-dom";
import App from "./App";
import Auth from "./components/Auth";
import Homepage from "./components/Homepage";
import Profile from "./components/Profile";
import ProfileSettings from "./components/ProfileSettings";

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
              element: <ProfileSettings />
            },
            {
              path: "/profile/:id",
              element: <Profile />
            }
          ]
        }
      ],
    },
  ]);
  return <RouterProvider router={router} />;
};

export default Router;
