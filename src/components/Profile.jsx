import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Loading from "./Loading";
import ErrorPage from "./ErrorPage";
import { faLocationDot, 
         faEnvelope,
         } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Posts from "./Main/Posts";
import NewPost from "./Main/NewPost";
import { useSelector } from "react-redux";
import { Transition } from "@headlessui/react";

const Profile = () => {
  const [userInfo, setUserInfo] = useState();
  const [error, setError] = useState(false);
  const { id } = useParams();
  const [allPosts, setAllPosts] = useState([]);

  const auth = useSelector(state => state.auth)
  const { user } = auth

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
      } catch (err) {
        setError(true);
      }
    };
    fetchUserInfo();
  }, [id]);
  if (userInfo)
    return (
      <div className="bg-gray-100 w-screen h-full pt-[0.5rem]">
        <div
          className=" 
        ml-auto mr-auto mt-16 lg:mt-16 text-center bg-white md:w-[55%]
         rounded-lg drop-shadow-md p-1 pb-2 lg:p-1 lg:pb-2 font-Rubik 
         -mb-8"
        >
          {user && user._id !== id &&
          
                <button
                  className="absolute right-2 top-2 text-center bg-gray-200 pr-3 pt-1 pb-1 rounded-full
         group hover:bg-cyan-400 transition-all duration-200 group"
                > 
                <Transition
                className="group-hover:inline hidden pl-3"
                show={true}
                enter="transition duration-100 ease-out"
                enterFrom="transform scale-y-0 origin-top opacity-0"
                enterTo="transform scale-y-100 origin-top opacity-100"
                leave="transition duration-100 ease-out"
                leaveFrom="transform scale-y-100 origin-top opacity-100"
                leaveTo="transform scale-y-0 origin-top opacity-0"
              >
                  Chat
                </Transition>
                  
                  <FontAwesomeIcon
                    icon={faEnvelope}
                    className="text-cyan-400 text-right
                 font-bold w-4 h-4 group-hover:text-black
                 transition-all duration-200 pl-3 group-hover:pl-2"
                  />
                </button>
            }
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
        </div>
      {user && id === user._id && 
      <NewPost 
      setAllPosts={setAllPosts}
      own={true}
      />
      }

      <Posts allPosts={allPosts} 
      setAllPosts={setAllPosts}
      own={true} 
      profileId={id}
      />
      </div>
    );

  if (error) return <ErrorPage />;

  return <Loading />;
};

export default Profile;
