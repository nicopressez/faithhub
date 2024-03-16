import { NavLink } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCalendarDays,
  faUsers,
  faChurch,
  faHouse,
} from "@fortawesome/free-solid-svg-icons";
import { useSelector } from "react-redux";
import { useMediaQuery } from "@uidotdev/usehooks";

const Nav = () => {
  const sideNav = useSelector((state) => state.sideNav);

  // Get device sizes to adjust the navbar logic for phones
  const isLargeDevice = useMediaQuery("only screen and (min-width: 1040px)");

  const { navVisible } = sideNav;

  return (
    <div
      className={`h-full p-2 mt-[3.5rem] gap-1 max-w-[25rem] w-[70%]
      bg-white lg:h-[91%] lg:w-[15%] fixed font-Rubik
      lg:ml-5 lg:mr-2 lg:mt-[4.3rem] shadow-xl lg:rounded-lg lg:pt-5
      flex flex-col lg:gap-2 text-lg z-[9999] lg:p-0
      ${!isLargeDevice ? "-translate-x-full transition duration-300 ease-in-out transform" : ""}
         ${
           !isLargeDevice && navVisible
             ? "translate-x-0"
             : !isLargeDevice
               ? "-translate-x-full"
               : ""
         }`}
    >
      <NavLink
        to={"/home"}
        style={({ isActive }) => {
          return {
            backgroundColor: isActive ? "#F3F4F6" : "",
          };
        }}
        className={"pr-4 pl-4 lg:pr-0 lg:pl-8 p-2 hover:bg-[#FAFAFA]"}
      >
        <FontAwesomeIcon
          icon={faHouse}
          className="w-4 h-4 pr-2 text-gray-600"
        />
        Home
      </NavLink>
      {/* 
      <NavLink
        style={({ isActive }) => {
          return {
            backgroundColor: isActive ? "" : "",
          };
        }}
        className={"pr-4 pl-4 lg:pr-0 lg:pl-8 p-2 hover:bg-[#FAFAFA]"}
      >
        <FontAwesomeIcon
          icon={faChurch}
          className="w-4 h-4 pr-2 text-gray-600"
        />
        Churches
      </NavLink>
      <NavLink
        style={({ isActive }) => {
          return {
            backgroundColor: isActive ? "" : "",
          };
        }}
        className={"pr-4 pl-4 lg:pr-0 lg:pl-8 p-2 hover:bg-[#FAFAFA]"}
      >
        <FontAwesomeIcon
          icon={faUsers}
          className="w-4 h-4 pr-2 text-gray-600"
        />
        Connect
      </NavLink>
      <NavLink
        style={({ isActive }) => {
          return {
            backgroundColor: isActive ? "" : "",
          };
        }}
        className={" pr-4 pl-4 lg:pr-0 lg:pl-8 p-2 hover:bg-[#FAFAFA]"}
      >
        <FontAwesomeIcon
          icon={faCalendarDays}
          className="w-4 h-4 pr-2 text-gray-600"
        />
        Events
      </NavLink>
      */}
      <div className="flex-grow"></div>
    </div>
  );
};

export default Nav;
