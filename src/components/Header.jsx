import { useSelector, useDispatch } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faMessage,
  faBell,
  faGear,
  faRightFromBracket,
  faUser,
  faMagnifyingGlass,
  faBars,
  faArrowDown
} from "@fortawesome/free-solid-svg-icons";
import { Menu, Transition } from "@headlessui/react";
import { logoutSuccess } from "../reducers/auth";
import { Link, useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { toggleNavBar, hideNavBar } from "../reducers/sidenav";
import SearchBar from "./SearchBar";
import { useMediaQuery } from "@uidotdev/usehooks";
import { useEffect, useState } from "react";

const Header = () => {

   // Get device size for big screens
   const isLargeDevice = useMediaQuery("only screen and (min-width: 1040px)");

  const [searchVisible, setSearchVisible] = useState(false)
  const [sideMenu, setSideMenu] = useState(false)

  const auth = useSelector((state) => state.auth);

  const location = useLocation()
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { user } = auth;

  useEffect(() => {
    // Only show the sidenav menu when needed for navigation
    if(location.pathname === "/home" ||
    /\/profile\/.*\/settings\//.test(location.pathname)){
      setSideMenu(true)
    }

  },[location.pathname])

  const handleLogout = () => {
    dispatch(logoutSuccess());
    navigate("/auth");
  };

  const toggleSearchBar = () => {
    if (searchVisible) {
      setSearchVisible(false)
    } else {
      setSearchVisible(true);
  }
  }


  if (!localStorage.getItem("token"))
    return (
      <div 
        className="bg-white font-Rubik h-[3.5rem] drop-shadow 
    fixed top-0 w-screen z-50"
      >
        <h1
          className=" text-cyan-400 font-bold tracking-wide
         text-2xl lg:text-4xl text-center pt-3 lg:pt-[0.4rem]"
        >
          FaithHub
        </h1>
      </div>
    );

  return (
    <>
      <div
        className="bg-white font-Rubik h-[3.5rem] drop-shadow 
    fixed top-0 w-screen z-[10000] flex flex-row items-center "
      >
        {sideMenu && 
        <Transition
        appear={true}
        show={true}
        enter="transition duration-100"
        enterFrom="opacity-0 transform scale-x-0 origin-left"
        enterTo="opacity-100 transform scale-x-100 origin-left"
        >
        <FontAwesomeIcon
          icon={faBars}
          className="ml-2 h-5 w-5
         text-gray-600 visible lg:hidden bg-gray-100 rounded-full p-2"
          onClick={() => dispatch(toggleNavBar())}
        />
        </Transition>}
        <Link
          to={"/home"}
          className="flex"
          onClick={() => dispatch(hideNavBar())}
        >
            {(isLargeDevice || (!isLargeDevice &&  !searchVisible))
             &&
             <h1
             className="text-2xl ml-2  text-cyan-400 font-extrabold tracking-wide
           md:text-3xl lg:ml-6 "
           >
            FaithHub
            </h1>}
        </Link>
        {isLargeDevice ?
        <SearchBar setSearchVisible={setSearchVisible}
        searchVisible={searchVisible}
        /> :
        searchVisible &&
        <SearchBar setSearchVisible={setSearchVisible}
        searchVisible={searchVisible}
        />}
        <div className="flex-grow"></div>
        <FontAwesomeIcon
          icon={faMagnifyingGlass}
          onClick={toggleSearchBar}
          className="flex lg:hidden mr-1 md:mr-2 lg:mr-4 w-6 h-6 text-cyan-400 bg-gray-100 rounded-full p-3"
        />
        <FontAwesomeIcon
          icon={faMessage}
          className=" mr-1 md:mr-3 lg:mr-4 w-6 h-6 text-cyan-400 bg-gray-100 rounded-full p-3"
        />
        <FontAwesomeIcon
          icon={faBell}
          className="mr-1 md:mr-3 lg:mr-4 w-6 h-6   text-cyan-400 bg-gray-100 rounded-full p-3"
        />

        {(isLargeDevice || (!isLargeDevice &&  !searchVisible))
             &&
        <Menu as="div" className="relative">
          <Menu.Button>
            <div className="group w-9 h-9 mr-2 md:mr-6 md:w-10 md:h-10 lg:w-11 lg:h-11 rounded-full object-cover relative">
            <img
              className="w-9 h-9 mr-2 md:mr-6 md:w-10 md:h-10 lg:w-11 lg:h-11 rounded-full object-cover"
              src={
                user &&
                `https://faithhub-backend.fly.dev/${user.profile_picture}`
              }
            />
            <FontAwesomeIcon icon={faArrowDown} 
            className="  absolute -bottom-1 -right-1 bg-gray-200 p-[0.15rem] rounded-full h-3 w-3 md:h-4 md:w-4 opacity-80 
            group-hover:opacity-90 transition-opacity duration-100"/>
            </div>
          </Menu.Button>
          <Transition
            enter="transition duration-200 ease-out"
            enterFrom="transform scale-y-0 opacity-0"
            enterTo="transform scale-y-100 opacity-100"
            leave="transition duration-200 ease-out"
            leaveFrom="transform scale-y-100 opacity-100"
            leaveTo="transform scale-y-100 opacity-0"
          >
            <Menu.Items
              className="absolute mt-2 mr-2 right-0 w-52 md:w-64 flex
       flex-col bg-white gap-1 drop-shadow-xl rounded-lg text-lg 
         pt-2 pb-2 justify-center"
            >
              <Menu.Item>
                {({ active }) => (
                  <a
                    className={`${active && "bg-gray-100"} pl-2`}
                    href={`/profile/${user._id}`}
                  >
                    <FontAwesomeIcon
                      icon={faUser}
                      className="h-4 w-4 pr-2"
                      onClick={() => dispatch(hideNavBar())}
                    />
                    Profile
                  </a>
                )}
              </Menu.Item>
              <Menu.Item>
                {({ active }) => (
                  <a
                    className={`${active && "bg-gray-100"} pl-2`}
                    href={`/profile/${user._id}/settings/info`}
                  >
                    <FontAwesomeIcon
                      icon={faGear}
                      className="w-4 h-4 pr-2"
                      onClick={() => dispatch(hideNavBar())}
                    />
                    Account settings
                  </a>
                )}
              </Menu.Item>
              <Menu.Item>
                {({ active }) => (
                  <button
                    className={`${active && "bg-gray-100"} text-red-500 pl-2 text-left`}
                    onClick={handleLogout}
                  >
                    <FontAwesomeIcon
                      icon={faRightFromBracket}
                      className="w-4 h-4 pr-2"
                      onClick={() => dispatch(hideNavBar())}
                    />
                    Log out
                  </button>
                )}
              </Menu.Item>
            </Menu.Items>
          </Transition>
        </Menu>
      }
      </div>
      
    </>
  );
};

export default Header;
