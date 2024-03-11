import { createBrowserRouter, RouterProvider } from "react-router-dom";
import App from "./App";
import Auth from "./components/Auth";
import Homepage from "./components/Main/Homepage";
import Profile from "./components/ProfilePage/Profile";
import SettingsInfo from "./components/ProfileSettings/SettingsInfo";
import ErrorPage from "./components/ErrorPage"
import Preferences from "./components/ProfileSettings/Preferences";
import Settings from "./components/ProfileSettings/Settings";
import MainPage from "./components/Main/MainPage";

const Router = () => {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <App />,
      children: [
        {
          path: "/home",
          element: <MainPage />,
          children: [
            {
              index: true,
              element: <Homepage />,
            },
          ],
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
              element: <Settings />,
              children: [
                {
                  path: "/profile/:id/settings/info",
                  element: <SettingsInfo />,
                },
                {
                  path: "/profile/:id/settings/preferences",
                  element: <Preferences />,
                },
              ],
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
      element: <ErrorPage />,
    },
  ]);
  return <RouterProvider router={router} />;
};

export default Router;
