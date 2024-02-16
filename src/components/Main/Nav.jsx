import { NavLink } from "react-router-dom"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCalendarDays,
         faUsers,
         faChurch,
         faHouse } from "@fortawesome/free-solid-svg-icons";



const Nav = () => {

    return (
        <div className="bg-white h-[91%] w-[15%] fixed font-Rubik,
        ml-5 mr-2 mt-[4.3rem] shadow-xl rounded-lg pt-5
        flex flex-col gap-2 text-lg">
            <NavLink 
            to={"/home"}
            style={({ isActive }) => {
                return {
                  backgroundColor: isActive ? "#F3F4F6" : "",
                };
              }}
              className={" pl-8 p-2 hover:bg-[#FAFAFA]"}
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
              className={" pl-8 p-2 hover:bg-[#FAFAFA]"}>
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
              className={" pl-8 p-2 hover:bg-[#FAFAFA]"}>
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
              className={" pl-8 p-2 hover:bg-[#FAFAFA]"}>
                <FontAwesomeIcon
                    icon={faCalendarDays}
                    className="w-4 h-4 pr-2 text-gray-600"
                />
                Events
            </NavLink>
            <div className="flex-grow"></div>
        </div>
    )
}

export default Nav