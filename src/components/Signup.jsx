import { useState, useEffect } from "react"
import { useSelector, useDispatch } from "react-redux"
import { loginRequest, loginSuccess, loginFailed } from "../reducers/auth"
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";


const Signup = () => {
    const auth = useSelector((state) => state.auth)
    const dispatch = useDispatch()
    const navigate = useNavigate();

// TODO: Get reducers for SIGNUP
    const { isLoggedIn, isLoading, error} = auth
    const [newCredentials, setNewCredentials] = useState();

    // Redirect once logged in
    useEffect(() => {
        if(isLoggedIn) {
            navigate("/home");
        }
    },[isLoggedIn, navigate])

    const handleSignup_pageOne = async(e) => {
        //TODO Check if credentials are valid before moving on to page two
            e.preventDefault();
            const form = e.target;
    
        }

    return (
        <div className=" bg-gray-100 w-screen h-screen fixed">
        <div className=" ml-auto mr-auto mt-52 text-center bg-white w-1/3
         rounded-lg drop-shadow-md p-3 font-Rubik">
            <h1 className=" pt-4 mb-6 text-2xl font-bold">
                Sign up</h1>
            {error && <h2 className="text-red-600 pb-2">{error}</h2>}
            <form className="flex flex-col gap-6 mb-4" onSubmit={handleSignup_pageOne()}>
                <input className={`ml-6 mr-6 p-3 border-gray-200 border-2 rounded-lg
                ${isLoading ? "brightness-95" : null}`} 
                type="text" name="username" placeholder="Username"></input>
                <input className={`ml-6 mr-6 p-3 border-gray-200 border-2 rounded-lg
                 ${isLoading ? "brightness-95" : null} `}
                type="password" name="password" placeholder="Password"></input>
                <input className={`ml-6 mr-6 p-3 border-gray-200 border-2 rounded-lg
                 ${isLoading ? "brightness-95" : null} `}
                type="password" name="password_verif" placeholder="Confirm password" />
                <input className={`rounded-lg p-3 ml-6 mr-6  bg-cyan-400 text-white
                   font-bold hover:cursor-pointer ${isLoading ? "brightness-95" : null}`}
                 type="submit" value="Next" ></input>
            </form>
        </div>
    </div>
    )
}

export default Signup