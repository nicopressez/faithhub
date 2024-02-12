import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Loading from "./Loading";
import ErrorPage from "./ErrorPage";

const Profile = () => {
  const [userInfo, setUserInfo] = useState();
  const [error, setError] = useState(false)
  const { id } = useParams();

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const response = await fetch(
          `https://faithhub-backend.fly.dev/profile/${id}`,
        );
        const result = await response.json();
        if (result.status !== 200 ) {
          setError(true)
        }
        setUserInfo(result.user);

      } catch (err) {
        setError(true)
      }
    };
    fetchUserInfo();
  }, [id]);
  if (userInfo)
    return (
      <div className="bg-gray-100 w-screen h-screen pt-[3.5rem]">
        <div
          className=" 
        ml-auto mr-auto mt-20 lg:mt-20 text-center bg-white lg:w-3/5
         rounded-lg drop-shadow-md p-1 pb-8 lg:p-3 font-Rubik"
        >
          <img
            className=" ml-auto mr-auto w-32 h-32 rounded-full object-cover"
            src={`https://faithhub-backend.fly.dev/${userInfo.profile_picture}`}
          />
          <h2 className=" text-xl font-bold">
            {`${userInfo.first_name} ${userInfo.last_name}`}
          </h2>
          <p>{userInfo.location}</p>
        </div>
      </div>
    );

      if(error) return (
        <ErrorPage />
        )
      

    return (
      <Loading />
    )
};

export default Profile;
