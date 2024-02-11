import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  updateRequest,
  updateFailed,
  updateSuccess,
} from "../reducers/settings";
import uploadImg from "../assets/upload.png";
import { useEffect, useState } from "react";

const ProfileSettings = () => {
  const { id } = useParams();
  const settings = useSelector((state) => state.settings);
  const auth = useSelector((state) => state.auth);
  const { user } = auth;
  const { isLoading, errors } = settings;
  const dispatch = useDispatch();

  const [currentPic, setCurrentPic] = useState();

  useEffect(() => {
    if (user && user.profile_picture) {
      setCurrentPic(`https://faithhub-backend.fly.dev/${user.profile_picture}`);
    }
  }, [user]);

  const onPicChange = (e) => {
    setCurrentPic(URL.createObjectURL(e.target.files[0]));
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    dispatch(updateRequest());

  // Check if username already taken
  if (e.target.username.value !== user.username){
  const checkUsername = await fetch(
    `https://faithhub-backend.fly.dev/profile/username/${e.target.username.value}`,
  );
  if (checkUsername.status !== 200) {
    return dispatch(updateFailed({
      ...errors,
      username: "This username is already taken."
    }))
  }}

  // Check form fields validity before making update request
    if (
      e.target.username.value.length > 16 ||
      e.target.username.value.length < 4
    ) {
      dispatch(
        updateFailed({
          ...errors,
          username: "Username must be 4 to 16 characters long",
        }),
      );
    }
    if(
      e.target.first_name.value.length < 2 ||
      e.target.first_name.value.length > 12
    ){
      dispatch(updateFailed({
        ...errors,
        first_name: "First name must be 2 to 12 characters long",
      })
      );
    }
    if(
      e.target.last_name.value.length < 2 ||
      e.target.last_name.value.length > 12
    ){
      dispatch(updateFailed({
        ...errors,
        last_name: "Last name must be 2 to 12 characters long",
      })
      );
    }

    // If any errors, return 
    if(Object.keys(errors).find((field) =>
    errors[field] !== null)){
      return;
    }

    const formData = new FormData();
    if (e.target.profile_picture.files.length > 0){
      formData.append("profile_picture", e.target.profile_picture.files[0])
    } else {
      formData.append("profile_picture", user.profile_picture)
    }
      formData.append("username", e.target.username.value)
      formData.append("first_name", e.target.first_name.value)
      formData.append("last_name", e.target.last_name.value)
      formData.append("bio", e.target.bio.value)
      formData.append("location", e.target.location.value)
      console.log(formData)

    try {
      const response = await fetch(
        `https://faithhub-backend.fly.dev/profile/${id}/update`,
        {
          method: "PATCH",
          headers: {
            "Authorization": `Bearer ${localStorage.getItem("token")}`,
          },
          body: formData,
        },
      );
      console.log(await response.json())
      dispatch(updateSuccess())
    } catch (err) {
      //TODO: Error handling
      console.log(err);
    }
  };

  const handleDelete = async (e) => {
    e.preventDefault();
  };

  if (user && user._id === id)
    return (
      <div className="bg-gray-100 w-screen h-screen pt-[3.5rem]">
        <div
          className=" 
        ml-auto mr-auto mt-20 lg:mt-20 bg-white lg:w-2/4
         rounded-lg drop-shadow-md p-1 pb-8 lg:p-3 lg:pl-10 lg:pr-10 font-Rubik"
        >
          <h2 className="text-2xl font-bold mb-2 text-center"> Settings </h2>
          <hr className="w-3/4 ml-auto mr-auto mb-3"></hr>
          <form onSubmit={handleUpdate} className="">
            <label
              htmlFor="profile_picture"
              className="group w-20 mb-5 h-20 lg:w-32 lg:h-32 ml-auto mr-auto rounded-full"
            >
              <img
                src={uploadImg}
                className="hidden w-16 absolute left-[290px] top-[115px] group-hover:block z-10
                "
              ></img>
              <img
                src={currentPic}
                className="group-hover:brightness-90 rounded-full object-cover  w-20 h-20 lg:w-32 md:h-32
                ml-auto mr-auto"
              ></img>
            </label>

            <input
              id="profile_picture"
              name="profile_picture"
              type="file"
              onChange={onPicChange}
              className="
                 w-0 h-0 absolute"
            ></input>

            {Object.keys(errors).map(
              (field, index) =>
                errors[field] !== null && (
                  <div key={index} className="text-red-500">
                    {errors[field]}
                  </div>
                ),
            )}
            <div className="grid grid-cols-2 mt-5">
              <div className="flex flex-col font-bold ml-10">
                <label htmlFor="username" className="text-lg mb-2 p-1">
                  Username:{" "}
                </label>
                <label htmlFor="first_name" className="text-lg mb-2 p-1">
                  First name:{" "}
                </label>
                <label htmlFor="last_name" className="text-lg mb-2 p-1">
                  Last name:{" "}
                </label>
                <label htmlFor="bio" className="text-lg mb-2 p-1">
                  Bio:{" "}
                </label>
                <label htmlFor="location" className="text-lg mb-2 p-1">
                  Location:{" "}
                </label>
              </div>

              <div className="flex flex-col text-lg text-gray-800">
                <input
                  name="username"
                  type="text"
                  defaultValue={user.username}
                  id="username"
                  className={`bg-gray-100 w-full ml-auto mr-auto rounded-md p-1 pl-4 mb-2
                  ${isLoading ? "brightness-95" : null}`}
                  placeholder="Required"
                ></input>

                <input
                  name="first_name"
                  type="text"
                  defaultValue={user.first_name}
                  id="first_name"
                  className={`bg-gray-100 w-full ml-auto mr-auto rounded-md p-1 pl-4 mb-2
                  ${isLoading ? "brightness-95" : null}`}
                  placeholder="Required"
                ></input>

                <input
                  name="last_name"
                  type="text"
                  defaultValue={user.last_name}
                  id="last_name"
                  className={`bg-gray-100 w-full ml-auto mr-auto rounded-md p-1 pl-4 mb-2
                  ${isLoading ? "brightness-95" : null}`}
                  placeholder="Required"
                ></input>

                <input
                  name="bio"
                  type="text"
                  defaultValue={user.bio}
                  placeholder="Optional"
                  className={`bg-gray-100 w-full ml-auto mr-auto rounded-md p-1 pl-4 mb-2
                  ${isLoading ? "brightness-95" : null}`}
                ></input>

                <input
                  name="location"
                  type="text"
                  defaultValue={user.location}
                  id="location"
                  placeholder="Optional"
                  className={`bg-gray-100 w-full ml-auto mr-auto rounded-md p-1 pl-4 mb-2
                  ${isLoading ? "brightness-95" : null}`}
                ></input>
              </div>
            </div>
            <hr className="w-3/4 ml-auto mr-auto"></hr>
            <button
              className="bg-red-500 text-white p-1 pl-6 pr-6 rounded-md 
        text-xl mt-5 block ml-auto mr-auto"
              onClick={handleDelete}
            >
              Delete account
            </button>
            <input
              type="Submit"
              value="Confirm settings"
              className=" bg-cyan-400 text-white
        p-1 pl-6 pr-6 rounded-md text-xl mt-3 block ml-auto mr-auto hover:cursor-pointer"
            ></input>
          </form>
        </div>
      </div>
    );

  // TODO: Add page if not authorized
  return <h1 className="pt-32">not authorized</h1>;
};

export default ProfileSettings;
