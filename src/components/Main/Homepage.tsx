import { useOutletContext } from "react-router-dom";
import Posts from "./Posts";
import NewPost from "./NewPost";
import React,{ useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGear } from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";
import { useAppSelector } from "../../reducers/hooks";
import { Transition } from "@headlessui/react";
import { OutletContextType } from "./MainPage";

export interface PostsType {
  _id: string;
  anonymous: boolean;
  content: string;
  comments: string[];
  likes: string[];
  edited:boolean;
  date: string;
  type:string;
  author: {
    _id: string;
    profile_picture: string;
    first_name: string;
    last_name: string;
  }
}

const Homepage = () => {
  const outletContext = useOutletContext<OutletContextType>();
  const { navVisible, isLargeDevice } = outletContext;
  const [allPosts, setAllPosts] = useState<PostsType[]>([]);

  const auth = useAppSelector((state) => state.auth);
  const { user } = auth;

  if (user)
    return (
      <div
        className={`bg-gray-100 w-screen min-h-screen pt-[0.5rem] pr-2 pl-2 md:pr-7 md:pl-5 pb-10
        ${navVisible && !isLargeDevice ? "brightness-75 blur-sm" : null}`}
      >
        <NewPost setAllPosts={setAllPosts} />
        <Transition
          show={true}
          appear={true}
          enter="transition duration-300"
          enterFrom="opacity-0 transform -translate-y-10"
          enterTo="opacity-100 transform translate-y-0"
        >
          <div className="flex mt-4 md:-mb-6 lg:-mb-16 md:mt-4 font-Rubik relative">
            <Link
              to={`/profile/${user._id}/settings/preferences`}
              className=" bg-gray-200 lg:ml-[25%] rounded-lg p-1
    text-gray-500 hover:brightness-95 hover:text-gray-600
     -mb-6 md:mb-0 pl-4 pr-2"
            >
              <FontAwesomeIcon icon={faGear} className="w-3 h-3 pr-1" />
              Feed preferences
            </Link>
          </div>
        </Transition>
        <Posts allPosts={allPosts} setAllPosts={setAllPosts} />
      </div>
    );
};

export default Homepage;
