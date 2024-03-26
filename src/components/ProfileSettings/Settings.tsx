import { Outlet } from "react-router-dom";
import SettingsNav from "./SettingsNav";
import { useAppSelector } from "../../reducers/hooks";
import { useParams } from "react-router-dom";
import ErrorPage from "../ErrorPage";
import { useMediaQuery } from "@uidotdev/usehooks";
import React from "react";

const ProfileSettings = () => {
  const { id } = useParams();

  const auth = useAppSelector((state) => state.auth);
  const sideNav = useAppSelector((state) => state.sideNav);

  const { user } = auth;
  const { navVisible } = sideNav;

  // Get device sizes to adjust the navbar logic for phones
  const isLargeDevice = useMediaQuery("only screen and (min-width: 1040px)");

  if (user && user._id === id)
    return (
      <>
        <SettingsNav />
        <Outlet context={[navVisible, isLargeDevice]} />
      </>
    );

  if (user && user._id !== id) return <ErrorPage />;
};

export default ProfileSettings;
