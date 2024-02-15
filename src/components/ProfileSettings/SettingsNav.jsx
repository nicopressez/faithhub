import { NavLink } from "react-router-dom"
import { useSelector, useDispatch } from "react-redux";
import { logoutSuccess } from "../../reducers/auth";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faRightFromBracket,
         faGear,
         faUser } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";



const SettingsNav = () => {

    const auth = useSelector((state) => state.auth);
    const dispatch = useDispatch();
    const navigate = useNavigate()

    const { user } = auth;

    const handleLogout = () => {
        dispatch(logoutSuccess());
        navigate("/auth")
  };

    if (user) return (
        <div className="bg-white h-[91%] w-1/6 fixed font-Rubik,
        ml-5 mr-2 mt-[4.3rem] shadow-lg rounded-lg pt-5
        flex flex-col gap-2 text-lg">
            <NavLink 
            to={`/profile/${user._id}/settings/info`}
            style={({ isActive }) => {
                return {
                  backgroundColor: isActive ? "#F3F4F6" : "",
                };
              }}
              className={" pl-10 p-2 hover:bg-gray-100"}
            >
                <FontAwesomeIcon
                    icon={faUser}
                    className="w-4 h-4 pr-2 text-gray-500"
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
              className={" pl-10 p-2 hover:bg-gray-100"}>
                <FontAwesomeIcon
                    icon={faGear}
                    className="w-4 h-4 pr-2 text-gray-500"
                />
                Preferences
            </NavLink>
            <div className="flex-grow"></div>
            <button
                className=" text-red-500 text-left mb-5
                 mb hover:bg-gray-100"
                onClick={handleLogout}
                >
                <FontAwesomeIcon
                    icon={faRightFromBracket}
                    className="w-4 h-4 pr-2 pl-10"
                />
                Log out
            </button>
        </div>
    )
}

export default SettingsNav