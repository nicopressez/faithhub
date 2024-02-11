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
          element: <Profile />,
          children: [
            {
              path: "/profile/settings",
              element: <ProfileSettings />
            }
          ]
        }
      ],
    },
  ]);
  return <RouterProvider router={router} />;
};

export default Router;
