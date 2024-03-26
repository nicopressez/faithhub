import React from "react";
import { NavLink } from "react-router-dom";
import { useAppSelector, useAppDispatch } from "../../reducers/hooks";
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
  const auth = useAppSelector((state) => state.auth);
  const sideNav = useAppSelector((state) => state.sideNav);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const { user } = auth;
  const { navVisible } = sideNav;

  // Get device size to adjust the navbar logic for phones
  const isLargeDevice = useMediaQuery("only screen and (min-width: 1040px)");

  const handleLogout = () => {
    dispatch(logoutSuccess());
    navigate("/auth");
  };
  if (user)
    return (
      <div
        className={`h-full p-2 mt-[3.5rem] max-w-[25rem] gap-1 w-[70%]
        bg-white lg:h-[91%] lg:w-[15%] fixed font-Rubik
        lg:ml-5 lg:mr-2 lg:mt-[4.3rem] shadow-xl lg:rounded-lg lg:pt-5
        flex flex-col lg:gap-2 text-lg z-10 lg:p-0
         ${!isLargeDevice ? "transition duration-300 ease-in-out transform" : ""}
         ${
           !isLargeDevice && navVisible
             ? "translate-x-0"
             : !isLargeDevice
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
