import { Outlet } from "react-router-dom";
import SettingsNav from "./SettingsNav";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import ErrorPage from "../ErrorPage";
import Loading from "../Loading";
import { useMediaQuery } from "@uidotdev/usehooks";

const ProfileSettings = () => {
  const { id } = useParams();

  const auth = useSelector((state) => state.auth);
  const sideNav = useSelector((state) => state.sideNav);

  const { user } = auth;
  const { navVisible } = sideNav;

  // Get device sizes to adjust the navbar logic for phones
  const isSmallDevice = useMediaQuery("only screen and (max-width : 768px)");

  if (user && user._id === id)
    return (
      <>
        <SettingsNav />
        <Outlet context={[navVisible, isSmallDevice]} />
      </>
    );

  if (user && user._id !== id) return <ErrorPage />;

  return <Loading />;
};

export default ProfileSettings;
