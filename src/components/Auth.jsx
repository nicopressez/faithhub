import { useState, useEffect } from "react"
import { Transition } from '@headlessui/react';
import { useSelector, useDispatch } from "react-redux"
import { loginRequest, loginSuccess, loginFailed } from "../reducers/auth"
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";
import Signup from "./Signup";


const Auth = () => {
    const auth = useSelector((state) => state.auth)
    const dispatch = useDispatch()
    const navigate = useNavigate();

    const { isLoggedIn, isLoading, error} = auth

    const [toSignup, setToSignup] = useState(false)

// Redirect once logged in
    useEffect(() => {
        if(isLoggedIn) {
            navigate("/home");
        }
    },[isLoggedIn, navigate])

    const handleLogin = async(e) => {
        e.preventDefault();
        // Set loading
        dispatch(loginRequest());

        const form = e.target;
        const payload = {
            username: form.username.value,
            password: form.password.value, 
        }
    try {
        const response = await fetch("https://faithhub-backend.fly.dev/auth/login", {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload),
        })
        const result = await response.json()

        if (response.status === 200){
            const token = result.token;
            localStorage.setItem("token", token);
            // Decode token, send user data to state
            const decodedJWT = jwtDecode(token)
            dispatch(loginSuccess(decodedJWT.user))
        }
    } catch(err) {
        // Invalid credentials, set error message
        setTimeout(() => {
            dispatch(loginFailed())
        }, 500);
    }
    }

    return (
        <div className=" bg-gray-100 w-screen h-screen fixed">
        <Transition 
        show={toSignup === false}
        enter="transition-all duration-500"
                enterFrom="translate-x-40 opacity-0"
                enterTo="translate-x-0 opacity-100"
                leave="transition-opacity duration-0"
                leaveFrom="opacity-100"
                leaveTo="opacity-0"
    >
        <div className=" 
        ml-auto mr-auto mt-32 text-center bg-white w-1/3
         rounded-lg drop-shadow-md p-3 font-Rubik">
            <h1 className=" pt-4 mb-6 text-2xl font-bold">
                Welcome to FaithHub!</h1>
            {error && <h2 className="text-red-600 pb-2">{error}</h2>}
            <form className="flex flex-col gap-6 mb-4" onSubmit={handleLogin}>
                <input className={`ml-6 mr-6 p-3 border-gray-200 border-2 rounded-lg
                ${isLoading ? "brightness-95" : null}`} 
                type="text" name="username" placeholder="Username"></input>
                <input className={`ml-6 mr-6 p-3 border-gray-200 border-2 rounded-lg
                 ${isLoading ? "brightness-95" : null} `}
                type="password" name="password" placeholder="Password"></input>
                <input className={`rounded-lg p-3 ml-6 mr-6  bg-cyan-400 text-white
                   font-bold hover:cursor-pointer ${isLoading ? "brightness-95" : null}`}
                 type="submit" value="Login" ></input>
            </form>
            <button className="pb-4 text-cyan-500 underline
            hover:brightness-[0.85]" onClick={() => setToSignup(true)}>
                Don&apos;t have an account yet? Sign up here</button>
        </div>


    </Transition>

    <Transition 
    show={toSignup === true}
    enter="transition-all duration-500"
                enterFrom="translate-x-40 opacity-0"
                enterTo="translate-x-0 opacity-100"
                leave="transition-transform duration-0"
                leaveFrom="-translate-x-40"
                leaveTo="-translate-x-0"
>
        <Signup toSignup={toSignup} setToSignup={setToSignup}/>
        </Transition>
        </div>

    )
}
    

export default Auth