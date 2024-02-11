import { useSelector, useDispatch } from "react-redux"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faMessage, faBell } from "@fortawesome/free-solid-svg-icons";



const Header = () => {

        const auth = useSelector((state) => state.auth)
        const dispatch = useDispatch()
    
        const { isLoggedIn, user} = auth

    if (!isLoggedIn) return (
    <div className="bg-white font-Rubik h-[3.5rem] drop-shadow 
    fixed top-0 w-screen z-50">
        <h1 className=" text-cyan-400 font-bold tracking-wide
         text-2xl lg:text-4xl text-center pt-3 lg:pt-[0.4rem]">FaithHub</h1>
    </div>
    )

    return (
        <>
        <div className="bg-white font-Rubik h-[3.5rem] drop-shadow 
    fixed top-0 w-screen z-50 flex flex-row items-center ">
        <h1 className=" text-cyan-400 font-extrabold tracking-wide
         text-2xl lg:text-3xl ml-8">
            FaithHub</h1>
        <form>
            <input type="text" placeholder="Search... " className="
            bg-gray-100 p-1 pl-3 pr-10 ml-8 rounded-large"></input>
        </form>
        <div className="flex-grow"></div>
        <FontAwesomeIcon icon={faMessage} className=" mr-6 w-6 h-6 text-cyan-400"/>
        <FontAwesomeIcon icon={faBell} className=" mr-6 w-6 h-6   text-cyan-400"/>
        {user.profile_picture &&  <img className=" mr-6 w-11 h-11 rounded-full object-cover"
        src={`https://faithhub-backend.fly.dev/${user.profile_picture}`}/>}
        

    </div>

   </>
    )
}

export default Header