import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Loading from "./Loading";
import ErrorPage from "./ErrorPage";
import { faLocationDot } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Posts from "./Main/Posts";
import NewPost from "./Main/NewPost";

const Profile = () => {
  const [userInfo, setUserInfo] = useState();
  const [error, setError] = useState(false);
  const { id } = useParams();
  const [allPosts, setAllPosts] = useState([]);

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
        ml-auto mr-auto mt-20 lg:mt-20 text-center bg-white md:w-[55%]
         rounded-lg drop-shadow-md p-1 pb-8 lg:p-3 font-Rubik"
        >
          <img
            className="mt-3 mb-3 ml-auto mr-auto w-24 h-24 md:w-32 md:h-32 rounded-full object-cover"
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
      <NewPost 
      setAllPosts={setAllPosts}
      own={true}
      />
      <Posts allPosts={allPosts} setAllPosts={setAllPosts}
      own={true} profileId={id}/>
      </div>
    );

  if (error) return <ErrorPage />;

  return <Loading />;
};

export default Profile;
