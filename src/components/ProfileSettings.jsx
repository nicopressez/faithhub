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

    const handleDelete = async(e) => {
      e.preventDefault()
    }

    if (user && user._id === id) return (
        <div className="bg-gray-100 w-screen h-screen pt-[3.5rem]">
            <div
          className=" 
        ml-auto mr-auto mt-20 lg:mt-20 bg-white lg:w-2/4
         rounded-lg drop-shadow-md p-1 pb-8 lg:p-3 lg:pl-10 lg:pr-10 font-Rubik"
        >
        <h2 className="text-2xl font-bold mb-5 text-center"
        > Settings </h2>
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

            <div className="grid grid-cols-2 mt-8">
          <div className="flex flex-col font-bold ml-10">
        <label htmlFor="username" className="text-lg mb-2 p-1">Username: </label>
        <label htmlFor="first_name" className="text-lg mb-2 p-1">First name: </label>
        <label htmlFor="last_name" className="text-lg mb-2 p-1">Last name: </label>
        <label htmlFor="bio" className="text-lg mb-2 p-1">Bio: </label>
        <label htmlFor="location" className="text-lg mb-2 p-1">Location: </label>
        </div>

        <div className="flex flex-col text-lg text-gray-800">
        <input name="username" type="text" defaultValue={user.username} id="username"
         className="bg-gray-100 w-full ml-auto mr-auto rounded-md p-1 pl-4 mb-2"
         placeholder="Required"></input>
        
        <input name="first_name" type="text" defaultValue={user.first_name} id="first_name"
        className="bg-gray-100 w-full ml-auto mr-auto rounded-md p-1 pl-4 mb-2"
        placeholder="Required"></input>
        
        <input name="last_name" type="text" defaultValue={user.last_name} id="last_name" 
        className="bg-gray-100 w-full ml-auto mr-auto rounded-md p-1 pl-4 mb-2"
        placeholder="Required"></input>
        
        <input name="bio" type="text" defaultValue={user.bio} placeholder="Optional"
        className="bg-gray-100 w-full ml-auto mr-auto rounded-md p-1 pl-4 mb-2"></input>
        
        <input name="location" type="text" defaultValue={user.location} 
        id="location" placeholder="Optional"
        className="bg-gray-100 w-full ml-auto mr-auto rounded-md p-1 pl-4"></input>

</div>
        </div>
        <input type="Submit" value="Confirm settings" className=" bg-cyan-400 text-white
        p-1 pl-8 pr-8 rounded-md text-xl ml-auto mr-auto block mt-5"></input>
        <button className="bg-red-500 text-white p-1 pl-8 pr-8 rounded-md 
        text-xl block ml-auto mr-auto mt-3" onClick={handleDelete}>Delete account</button>
        
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