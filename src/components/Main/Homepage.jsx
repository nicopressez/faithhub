import { useOutletContext } from "react-router-dom";
import Posts from "./Posts";
import NewPost from "./NewPost";
import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGear } from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { Transition } from "@headlessui/react";

const Homepage = () => {
  const [navVisible, isSmallDevice] = useOutletContext();
  const [allPosts, setAllPosts] = useState([]);

  const auth = useSelector((state) => state.auth);
  const { user } = auth;

  if (user)
    return (
      <div
        className={`bg-gray-100 w-screen min-h-screen pt-[0.5rem]
        ${navVisible && isSmallDevice ? "brightness-75 blur-sm" : null}`}
      >
        <NewPost setAllPosts={setAllPosts} />
        <Transition
          show={true}
          appear={true}
          enter="transition duration-300"
          enterFrom="opacity-0 transform -translate-y-10"
          enterTo="opacity-100 transform translate-y-0"
        >
          <div className="flex justify-center md:justify-normal mt-4 md:-mb-16 md:mt-4 font-Rubik relative">
            <Link
              to={`/profile/${user._id}/settings/preferences`}
              className=" bg-gray-200 md:ml-[63%] rounded-lg p-1
    text-gray-500 hover:brightness-95 hover:text-gray-600
    -mb-2 pl-4 pr-2"
            >
              <FontAwesomeIcon icon={faGear} className="w-3 h-3 pr-1" />

              <button>Feed preferences</button>
            </Link>
          </div>
        </Transition>
        <Posts allPosts={allPosts} setAllPosts={setAllPosts} />
      </div>
    );
};

export default Homepage;
