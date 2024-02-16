import { NavLink } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logoutSuccess } from "../../reducers/auth";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faRightFromBracket,
  faGear,
  faUser,
} from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import { useMediaQuery } from "@uidotdev/usehooks";

const SettingsNav = () => {
  const auth = useSelector((state) => state.auth);
  const sideNav = useSelector((state) => state.sideNav);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { user } = auth;
  const { navVisible } = sideNav;

  // Get device size to adjust the navbar logic for phones
  const isSmallDevice = useMediaQuery("only screen and (max-width : 768px)");

  const handleLogout = () => {
    dispatch(logoutSuccess());
    navigate("/auth");
  };

  //    if (isSmallDevice && user && navVisible
  //    || !isSmallDevice  && user)
  if (user)
    return (
      <div
        className={`h-[38rem] p-2 mt-[3.5rem] gap-1 w-[70%]
        bg-white md:h-[91%] md:w-[15%] fixed font-Rubik
        md:ml-5 md:mr-2 md:mt-[4.3rem] shadow-xl md:rounded-lg md:pt-5
        flex flex-col md:gap-2 md:text-lg z-10 md:p-0
         ${isSmallDevice ? "transition duration-300 ease-in-out transform" : ""}
         ${
           isSmallDevice && navVisible
             ? "translate-x-0"
             : isSmallDevice
               ? "-translate-x-full"
               : ""
         }
      `}
      >
        <NavLink
          to={`/profile/${user._id}/settings/info`}
          style={({ isActive }) => {
            return {
              backgroundColor: isActive ? "#F3F4F6" : "",
            };
          }}
          className={"pr-4 pl-4 md:pr-0 md:pl-8 p-2 hover:bg-[#FAFAFA]"}
        >
          <FontAwesomeIcon
            icon={faUser}
            className="w-4 h-4 pr-2 text-gray-600"
          />
          Account info
        </NavLink>
        <NavLink
          to={`/profile/${user._id}/settings/preferences`}
          style={({ isActive }) => {
            return {
              backgroundColor: isActive ? "#F3F4F6" : "",
            };
          }}
          className={"pr-4 pl-4 md:pr-0 md:pl-8 p-2 hover:bg-[#FAFAFA]"}
        >
          <FontAwesomeIcon
            icon={faGear}
            className="w-4 h-4 pr-2 text-gray-600"
          />
          Preferences
        </NavLink>
        <div className="flex-grow"></div>
        <button
          className=" text-red-600 text-left mb-2 md:mb-5
                pr-4 pl-4 md:pr-0
                  hover:bg-[#FAFAFA] p-2"
          onClick={handleLogout}
        >
          <FontAwesomeIcon
            icon={faRightFromBracket}
            className="w-4 h-4 pr-2 md:pl-8"
          />
          Log out
        </button>
      </div>
    );
};

export default SettingsNav;
