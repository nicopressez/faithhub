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
} from "@fortawesome/free-solid-svg-icons";
import { Menu, Transition } from "@headlessui/react";
import { logoutSuccess } from "../reducers/auth";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { toggleNavBar, hideNavBar } from "../reducers/sidenav";

const Header = () => {
  const auth = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { user } = auth;

  const handleLogout = () => {
    dispatch(logoutSuccess());
    navigate("/auth");
  };

  const handleSearch = async(e) => {
    const query = e.target.value
    console.log(query)
    try  {
      const response = await fetch(`https://faithhub-backend.fly.dev/profile/searchbar?query=${query}`)
      const data = await response.json()
      console.log(data)
    } catch (err) {
      // TODO: Add error handling
      console.log(err)
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
    fixed top-0 w-screen z-50 flex flex-row items-center "
      >
        <FontAwesomeIcon
          icon={faBars}
          className="ml-3 h-5 w-5
         text-gray-600 visible lg:hidden"
          onClick={() => dispatch(toggleNavBar())}
        />
        <Link
          to={"/home"}
          className="flex"
          onClick={() => dispatch(hideNavBar())}
        >
          <h1
            className="text-lg ml-2  text-cyan-400 font-extrabold tracking-wide
          md:text-3xl lg:ml-8 "
          >
            FaithHub
          </h1>
        </Link>
        <form>
          <input
            onChange={handleSearch}
            type="text"
            placeholder="Search... "
            className="
            bg-gray-100 hidden lg:flex lg:w-auto p-1 lg:pl-3 pr-3 lg:pr-10 ml-3 lg:ml-8 rounded-large"
          ></input>
        </form>
        <div className="flex-grow"></div>
        <FontAwesomeIcon
          icon={faMagnifyingGlass}
          className="flex lg:hidden mr-3 md:mr-4 lg:mr-6 w-6 h-6 text-cyan-400"
        />
        <FontAwesomeIcon
          icon={faMessage}
          className=" mr-3 md:mr-4 lg:mr-6 w-6 h-6 text-cyan-400"
        />
        <FontAwesomeIcon
          icon={faBell}
          className="mr-3 md:mr-4 lg:mr-6 w-6 h-6   text-cyan-400"
        />

        <Menu as="div" className="relative">
          <Menu.Button>
            <img
              className="w-9 h-9 mr-2 md:mr-6 md:w-10 md:h-10 lg:w-11 lg:h-11 rounded-full object-cover"
              src={
                user &&
                `https://faithhub-backend.fly.dev/${user.profile_picture}`
              }
            />
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
      </div>
    </>
  );
};

export default Header;
