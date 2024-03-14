import { useParams, useNavigate, useOutletContext } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  updateRequest,
  updateFailed,
  updateSuccess,
} from "../../reducers/settings";
import uploadImg from "../../assets/upload.png";
import { useEffect, useState } from "react";
import ErrorPage from "../ErrorPage";
import { logoutSuccess, tokenRefresh } from "../../reducers/auth";
import { Dialog } from "@headlessui/react";
import { Transition } from "@headlessui/react";

const ProfileSettings = () => {
  const { id } = useParams();
  const settings = useSelector((state) => state.settings);
  const auth = useSelector((state) => state.auth);
  const { user } = auth;
  const { isLoading, errors, success } = settings;

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [currentPic, setCurrentPic] = useState();
  const [userInfo, setUserInfo] = useState();
  const [settingChange, setSettingChange] = useState([]);
  const [errorPage, setErrorPage] = useState(false);
  const [deleteDialog, setDeleteDialog] = useState(false);
  const [navVisible, isLargeDevice] = useOutletContext();

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const response = await fetch(
          `https://faithhub-backend.fly.dev/profile/${id}`,
        );
        const result = await response.json();
        setUserInfo(result.user);
      } catch (err) {
        setErrorPage(true);
      }
    };
    fetchUserInfo();
  }, [id]);

  useEffect(() => {
    if (userInfo && userInfo.profile_picture) {
      setCurrentPic(
        `https://faithhub-backend.fly.dev/${userInfo.profile_picture}`,
      );
    }
  }, [userInfo]);

  const onPicChange = (e) => {
    setCurrentPic(URL.createObjectURL(e.target.files[0]));
  };

  // Toggle confirm settings button on change
  const handleChange = (e) => {
    e.preventDefault();
    const { value, name } = e.target;
    // The value is back to the original, remove from settingChange
    if (userInfo[name] === value) {
      if (settingChange.find((setting) => setting === name)) {
        const updated = settingChange.filter((setting) => setting !== name);
        setSettingChange(updated);
      }
      return;
    }
    // Value isnt the same as original, add to settingChange
    if (!settingChange.find((setting) => setting === name)) {
      const addedChange = settingChange.concat(name);
      setSettingChange(addedChange);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    dispatch(updateRequest());

    // Check if username already taken
    if (e.target.username.value !== userInfo.username) {
      const checkUsername = await fetch(
        `https://faithhub-backend.fly.dev/profile/username/${e.target.username.value}`,
      );
      if (checkUsername.status !== 200) {
        return dispatch(
          updateFailed({
            ...errors,
            username: "This username is already taken.",
          }),
        );
      }
    }

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
    if (
      e.target.first_name.value.length < 2 ||
      e.target.first_name.value.length > 12
    ) {
      dispatch(
        updateFailed({
          ...errors,
          first_name: "First name must be 2 to 12 characters long",
        }),
      );
    }
    if (
      e.target.last_name.value.length < 2 ||
      e.target.last_name.value.length > 12
    ) {
      dispatch(
        updateFailed({
          ...errors,
          last_name: "Last name must be 2 to 12 characters long",
        }),
      );
    }

    // If any errors, return
    if (Object.keys(errors).find((field) => errors[field] !== null)) {
      return;
    }

    const formData = new FormData();
    if (e.target.profile_picture.files.length > 0) {
      formData.append("profile_picture", e.target.profile_picture.files[0]);
    } else {
      formData.append("profile_picture", userInfo.profile_picture);
    }
    formData.append("username", e.target.username.value);
    formData.append("first_name", e.target.first_name.value);
    formData.append("last_name", e.target.last_name.value);
    formData.append("bio", e.target.bio.value);
    formData.append("location", e.target.location.value);
    try {
      const response = await fetch(
        `https://faithhub-backend.fly.dev/profile/${id}/update`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: formData,
        },
      );
      const result = await response.json();
      // Update user info and token
      dispatch(tokenRefresh(result.user));
      localStorage.setItem("token", result.token);
      dispatch(updateSuccess());
    } catch (err) {
      setErrorPage(true);
    }
  };

  const handleDelete = async (e) => {
    e.preventDefault();
    try {
      await fetch(`https://faithhub-backend.fly.dev/profile/${id}/delete`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      dispatch(logoutSuccess());
      navigate("/auth");
    } catch (err) {
      setErrorPage(true);
    }
  };

  if (userInfo && user)
    return (
      <>
        <div
          className={`bg-gray-100 w-screen h-screen pt-[0.5rem] pl-2 pr-2
          md:pl-5 md:pr-5
           ${
            deleteDialog ? " blur-sm" : null
          }
        ${navVisible && !isLargeDevice ? "brightness-75 blur-sm" : null}`}
        >
          <Transition
            show={true}
            appear={true}
            enter="transition duration-300"
            enterFrom="opacity-0 transform -translate-y-10"
            enterTo="opacity-100 transform translate-y-0"
          >
            <div
              className=" 
        ml-auto mr-auto mt-[16%] md:mt-[10%] lg:mt-20 bg-white lg:w-[55%]
         rounded-lg drop-shadow-md p-1 pb-8 md:pl-3 md:pr-3 lg:p-3 lg:pl-10 lg:pr-10 font-Rubik "
            >
              <h2 className="text-2xl font-bold mb-2 text-center"> Account </h2>
              <hr className="w-3/4 ml-auto mr-auto mb-3"></hr>
              <form onSubmit={handleUpdate} className="flex flex-col ">
                <label
                  htmlFor="profile_picture"
                  className="relative group w-20 h-20 lg:w-32 lg:h-32 ml-auto mr-auto rounded-full"
                >
                  <img
                    src={uploadImg}
                    className="hidden w-16 absolute left-[50%] -translate-x-1/2 top-[20%] group-hover:block z-10
                "
                  ></img>
                  <img
                    src={currentPic}
                    className="group-hover:brightness-90 rounded-full object-cover  w-20 h-20 lg:w-32 lg:h-32
                ml-auto mr-auto"
                  ></img>
                </label>

                <input
                  id="profile_picture"
                  name="profile_picture"
                  type="file"
                  accept="image/x-png,image/jpeg"
                  onChange={(e) => {
                    handleChange(e);
                    onPicChange(e);
                  }}
                  className="
                 w-0 h-0 absolute"
                ></input>

                {Object.keys(errors).map(
                  (field, index) =>
                    errors[field] !== null && (
                      <div
                        key={index}
                        className="text-red-600 text-center
                  text-lg font-bold mt-2"
                      >
                        {errors[field]}
                      </div>
                    ),
                )}
                {success && (
                  <h3
                    className=" text-cyan-500 text-center
            text-lg font-bold mt-2"
                  >
                    Profile updated successfully!
                  </h3>
                )}
                <div className="grid grid-cols-2 mt-3">
                  <div className="flex flex-col font-bold lg:ml-10">
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
                      defaultValue={userInfo.username}
                      id="username"
                      onChange={handleChange}
                      className={`bg-gray-100 w-full ml-auto mr-auto rounded-md p-1 pl-4 mb-2
                  ${isLoading ? "brightness-95" : null}`}
                      placeholder="Required"
                    ></input>

                    <input
                      name="first_name"
                      type="text"
                      defaultValue={userInfo.first_name}
                      id="first_name"
                      onChange={handleChange}
                      className={`bg-gray-100 w-full ml-auto mr-auto rounded-md p-1 pl-4 mb-2
                  ${isLoading ? "brightness-95" : null}`}
                      placeholder="Required"
                    ></input>

                    <input
                      name="last_name"
                      type="text"
                      defaultValue={userInfo.last_name}
                      id="last_name"
                      onChange={handleChange}
                      className={`bg-gray-100 w-full ml-auto mr-auto rounded-md p-1 pl-4 mb-2
                  ${isLoading ? "brightness-95" : null}`}
                      placeholder="Required"
                    ></input>

                    <input
                      name="bio"
                      type="text"
                      defaultValue={userInfo.bio}
                      placeholder="Optional"
                      id="bio"
                      onChange={handleChange}
                      className={`bg-gray-100 w-full ml-auto mr-auto rounded-md p-1 pl-4 mb-2
                  ${isLoading ? "brightness-95" : null}`}
                    ></input>

                    <input
                      name="location"
                      type="text"
                      defaultValue={userInfo.location}
                      id="location"
                      onChange={handleChange}
                      placeholder="Optional"
                      className={`bg-gray-100 w-full ml-auto mr-auto rounded-md p-1 pl-4 mb-2
                  ${isLoading ? "brightness-95" : null}`}
                    ></input>
                  </div>
                </div>
                <hr className="w-3/4 ml-auto mr-auto"></hr>
                <button
                  type="button"
                  className="bg-red-600 text-white p-1 pl-6 pr-6 rounded-md 
        text-xl mt-5 block ml-auto mr-auto"
                  onClick={() => setDeleteDialog(true)}
                >
                  Delete account
                </button>

                {settingChange[0] && (
                  <Transition
                  show={true}
                  appear={true}
                  enter="transition duration-200"
                  enterFrom="transform scale-y-0 origin-top opacity-0"
                  enterTo="transform scale-y-100 origin-top opacity-100"
                  leave="transition duration-200"
                  leaveFrom="transform scale-y-100 origin-top opacity-100"
                  leaveTo="transform scale-y-0 origin-top opacity-0">
                  <input
                    type="Submit"
                    value="Confirm settings"
                    className=" bg-cyan-400 text-white
        p-1 pl-6 pr-6 rounded-md text-xl mt-3 block ml-auto mr-auto hover:cursor-pointer"
                  ></input>
                  </Transition>
                )}
              </form>
            </div>
          </Transition>
        </div>
        <Dialog
          open={deleteDialog}
          onClose={() => setDeleteDialog(false)}
          className="absolute top-[25%] lg:top-[30%] -translate-x-1/2 left-1/2 bg-white w-full lg:w-1/3
      rounded-lg drop-shadow-md p-1  font-Rubik text-center"
        >
          <Dialog.Panel>
            <Dialog.Title
              className="font-bold  text-xl
    mt-2 mb-2"
            >
              Deactivate account
            </Dialog.Title>
            <Dialog.Description className="font-bold mb-2">
              {user._id !== "65f2fdc6c21f8475fee0fa2e" &&
              "This will permanently deactivate your account"
                }
            </Dialog.Description>

            <p className=" w-full ml-auto mr-auto mb-2 lg:mb-3">
              {user._id === "65f2fdc6c21f8475fee0fa2e" ?
              "Test user can't be deleted. Please try again from a different account."
              :
              "Are you sure you want to deactivate your account? All of your data will be permanently removed. This action cannot be undone."}
            </p>

            {user._id !== "65f2fdc6c21f8475fee0fa2e" &&
              <button
              onClick={(e) => {
                setDeleteDialog(false);
                handleDelete(e);
              }}
              className= {`bg-red-600 p-1 pl-3 pr-3 mb-2 rounded-md text-lg text-white mr-3`}
            >
              Delete
            </button>}
            <button
              onClick={() => setDeleteDialog(false)}
              className="bg-gray-400 p-1 pl-3 pr-3 rounded-md text-lg text-white mr-3"
            >
              Cancel
            </button>
          </Dialog.Panel>
        </Dialog>
      </>
    );

  if (errorPage) return <ErrorPage />;

};

export default ProfileSettings;
