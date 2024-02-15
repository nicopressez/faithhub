import { Link } from "react-router-dom"
import { useSelector, useDispatch } from "react-redux";
import { logoutSuccess } from "../../reducers/auth";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faRightFromBracket } from "@fortawesome/free-solid-svg-icons";
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

    return (
        <div className="bg-white h-[91%] w-1/6 fixed font-Rubik,
        ml-5 mr-2 mt-[4.3rem] shadow-lg rounded-lg pl-12 pt-10
        flex flex-col gap-4 text-lg">
            <Link to={`/profile/${user._id}/settings/info`}
            className="">
                Personal info
            </Link>
            <Link to={`/profile/${user._id}/settings/preferences`}>
                Preferences
            </Link>
            <button
                    className={` "bg-gray-200" text-red-500 text-left`}
                    onClick={handleLogout}
                  >
                    <FontAwesomeIcon
                      icon={faRightFromBracket}
                      className="w-4 h-4 pr-2"
                    />
                    Log out
                  </button>
        </div>
    )
}

export default SettingsNav