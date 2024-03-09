import { Outlet } from "react-router-dom";
import Nav from "./Nav";
import { useSelector } from "react-redux";
import { useMediaQuery } from "@uidotdev/usehooks";

const MainPage = () => {
  const sideNav = useSelector((state) => state.sideNav);
  const { navVisible } = sideNav;

  // Get device sizes to adjust the navbar logic for phones
  const isLargeDevice = useMediaQuery("only screen and (min-width: 1200px)");

  return (
    <div className="overflow-hidden">
      <Nav />
      <Outlet context={[navVisible, isLargeDevice]} />
    </div>
  );
};

export default MainPage;
