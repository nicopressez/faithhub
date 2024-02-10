import { useSelector, useDispatch } from "react-redux"

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
        <div className="bg-white font-Rubik h-[3.5rem] drop-shadow 
    fixed top-0 w-screen z-50 flex flex-row ">
        <h1 className=" text-cyan-400 font-extrabold tracking-wide
         text-2xl lg:text-3xl ml-8 mt-3 lg:mt-[0.6rem]">
            FaithHub</h1>
        <form>
            <input type="text" placeholder="Search... " className="
            bg-gray-100 mt-3 p-1 pl-3 pr-10 ml-8 rounded-large"></input>
        </form>
        <img src="https://faithhub-backend.fly.dev/uploads/uploads/de152381fff93c8bc37eac9d2b80e329"></img>
    </div>
    )
}

export default Header