import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import ErrorPage from "../ErrorPage";
import { faLocationDot, faEnvelope } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Posts from "../Main/Posts";
import NewPost from "../Main/NewPost";
import { useSelector } from "react-redux";
import { Transition } from "@headlessui/react";
import ProfileLoading from "./ProfileLoading";

const Profile = () => {
  const [userInfo, setUserInfo] = useState();
  const [error, setError] = useState(false);
  const { id } = useParams();
  const [allPosts, setAllPosts] = useState([]);

  const [isLoading, setIsLoading] = useState(true)

  const auth = useSelector((state) => state.auth);
  const { user } = auth;

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const response = await fetch(
          `https://faithhub-backend.fly.dev/profile/${id}`,
        );
        const result = await response.json();
        if (result.status !== 200) {
          setError(true);
        }
        setUserInfo(result.user);
        // Toggle loading state
        setIsLoading(false)
      } catch (err) {
        setError(true);
      }
    };
    fetchUserInfo();
  }, [id]);

  // Loading for user info section
  if (isLoading) return <ProfileLoading />

  if (userInfo)
    return (
      <div className="bg-gray-100 min-h-screen pt-[0.5rem] md:pt-[1rem] pl-2 pr-2 md:pr-7 md:pl-5 overflow-hidden">
        <div
          className=" 
        ml-auto mr-auto mt-16 md:mt-16 text-center bg-white lg:w-[60%]
         rounded-lg drop-shadow-md p-1 pb-2 md:p-1 md:pb-2 font-Rubik 
         -mb-8"
        >
          <Transition
            show={true}
            appear={true}
            enter="transition duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
          >
            {user && user._id !== id && (
              <button
                className="absolute right-2 top-2 text-center bg-gray-200 pr-3 pt-1 pb-1 rounded-full
         group hover:bg-cyan-400 transition-all duration-200 group"
              >
                Chat
                <FontAwesomeIcon
                  icon={faEnvelope}
                  className="text-cyan-400 text-right
                 font-bold w-4 h-4 group-hover:text-black
                 transition-all duration-200 pl-3 group-hover:pl-2"
                />
              </button>
            )}
            <img
              className="border-cyan-400 border-4 p-[0.20rem] mt-3 mb-3 ml-auto mr-auto w-24 h-24 md:w-36 md:h-36 rounded-full object-cover
             "
              src={`https://faithhub-backend.fly.dev/${userInfo.profile_picture}`}
            />

            <h2 className=" text-xl font-bold">
              {`${userInfo.first_name} ${userInfo.last_name}`}
            </h2>
            <p>
              <FontAwesomeIcon
                icon={faLocationDot}
                className="text-gray-500
           mr-1"
              />
              {userInfo.location}
            </p>
            <p className="italic">{userInfo.bio}</p>
          </Transition>
        </div>

        {user && id === user._id && (
          <div>
          <NewPost setAllPosts={setAllPosts} own={true} />
          <Posts
          allPosts={allPosts}
          setAllPosts={setAllPosts}
          own={true}
          profileId={id}
        />
        </div>
        )}

        
      </div>
    );

  if (error) return <ErrorPage />;
};

export default Profile;
