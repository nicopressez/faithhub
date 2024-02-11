import { useParams } from "react-router-dom"
import { useSelector } from "react-redux";

const ProfileSettings = () => {

    const {id} = useParams()

    const auth = useSelector((state) => state.auth);
    const { user } = auth;

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
        <h2 className="text-xl font-bold"> Settings </h2>
         <form onSubmit={handleUpdate}>


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