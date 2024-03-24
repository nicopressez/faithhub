import { Outlet } from "react-router-dom";
import React from "react";
import Nav from "./Nav";
import { useAppSelector } from "../../reducers/hooks";
import { useMediaQuery } from "@uidotdev/usehooks";

// Define the type of the context
export interface OutletContextType {
  navVisible: boolean;
  isLargeDevice: boolean;
}

const MainPage = () => {
  const sideNav = useAppSelector((state) => state.sideNav);
  const { navVisible } = sideNav;

  // Get device sizes to adjust the navbar logic for phones
  const isLargeDevice = useMediaQuery("only screen and (min-width: 1200px)");

  const outletContext: OutletContextType = { navVisible, isLargeDevice };


  return (
    <div className="overflow-hidden">
      <Nav />
      <Outlet context={outletContext} />
    </div>
  );
};

export default MainPage;
