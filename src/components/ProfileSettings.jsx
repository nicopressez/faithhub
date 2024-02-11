import { useParams } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux";
import { updateRequest, updateFailed, updateSuccess } from "../reducers/settings";
import uploadImg from "../assets/upload.png";
import { useEffect, useState } from "react";

const ProfileSettings = () => {

    const {id} = useParams()
    const settings = useSelector((state) => state.settings )
    const auth = useSelector((state) => state.auth);
    const { user } = auth;
    const { isLoading, error} = settings;
    const dispatch = useDispatch()

    const [currentPic, setCurrentPic] = useState()


    useEffect(() => {
        if (user && user.profile_picture) {
            setCurrentPic(`https://faithhub-backend.fly.dev/${user.profile_picture}`);
        }
    },[user])

    const onPicChange = (e) => {
        setCurrentPic(URL.createObjectURL(e.target.files[0]));
    }
    const handleUpdate = async(e) => {
        e.preventDefault()
    }

    if (user && user._id === id) return (
        <div className="bg-gray-100 w-screen h-screen pt-[3.5rem]">
            <div
          className=" 
        ml-auto mr-auto mt-20 lg:mt-20 text-center bg-white lg:w-2/4
         rounded-lg drop-shadow-md p-1 pb-8 lg:p-3 font-Rubik"
        >
        <h2 className="text-xl font-bold mb-5"
        > Settings </h2>
         <form onSubmit={handleUpdate} className="flex flex-col">
         <label
                htmlFor="profile_picture"
                className="group w-20 h-20 lg:w-32 lg:h-32 ml-auto mr-auto rounded-full"
              >
                <img
                  src={uploadImg}
                  className="hidden w-16 absolute left-[290px] top-[115px] group-hover:block z-10
                "
                ></img>
                <img
                  src={currentPic}
                  className="group-hover:brightness-90 rounded-full object-cover w-20 h-20 lg:w-32 md:h-32
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
        <label htmlFor="username">Username: 
        <input name="username" type="text" defaultValue={user.username} id="username"></input>
        </label>
        <label htmlFor="first_name">First name: 
        <input name="first_name" type="text" defaultValue={user.first_name} id="first_name"></input>
        </label>
        <label htmlFor="last_name">Last name:
        <input name="last_name" type="text" defaultValue={user.last_name} id="last_name" ></input>
        </label>
        <label htmlFor="bio">Bio:
        <input name="bio" type="text" defaultValue={user.bio}></input>
        </label>
        <label htmlFor="location">Location:
        <input name="location" type="text" defaultValue={user.location} id="location"></input>
        </label>
         </form>
         </div>
        </div>
    )

// TODO: Add page if not authorized
    return (
        <h1 className="pt-32">not authorized</h1>
    )


}

export default ProfileSettings