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
}

export default Header