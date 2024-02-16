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
  const isSmallDevice = useMediaQuery("only screen and (max-width : 768px)");

  const { navVisible } = sideNav;

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
         }`}
    >
      <NavLink
        to={"/home"}
        style={({ isActive }) => {
          return {
            backgroundColor: isActive ? "#F3F4F6" : "",
          };
        }}
        className={"pr-4 pl-4 md:pr-0 md:pl-8 p-2 hover:bg-[#FAFAFA]"}
      >
        <FontAwesomeIcon
          icon={faHouse}
          className="w-4 h-4 pr-2 text-gray-600"
        />
        Home
      </NavLink>
      <NavLink
        style={({ isActive }) => {
          return {
            backgroundColor: isActive ? "" : "",
          };
        }}
        className={"pr-4 pl-4 md:pr-0 md:pl-8 p-2 hover:bg-[#FAFAFA]"}
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
        className={"pr-4 pl-4 md:pr-0 md:pl-8 p-2 hover:bg-[#FAFAFA]"}
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
        className={" pr-4 pl-4 md:pr-0 md:pl-8 p-2 hover:bg-[#FAFAFA]"}
      >
        <FontAwesomeIcon
          icon={faCalendarDays}
          className="w-4 h-4 pr-2 text-gray-600"
        />
        Events
      </NavLink>
      <div className="flex-grow"></div>
    </div>
  );
};

export default Nav;
