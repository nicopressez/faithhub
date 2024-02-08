import { useState } from "react"

const Auth = () => {

    const [signup, setSignup] = useState(false)
    const [credentials, setCredentials] = useState([])

// Login
    if (!signup) return (
    <div className=" bg-gray-100 w-screen h-screen fixed">
        <div className=" ml-auto mr-auto mt-52 text-center bg-white w-1/3
         rounded-lg drop-shadow-md">
            <h1 className=" pt-4 mb-6 font-Rubik text-2xl font-bold">
                Welcome to FaithHub!</h1>
            <form className="flex flex-col gap-6 mb-4">
                <input className="ml-6 mr-6 p-3 border-gray-200 border-2 rounded-lg" 
                type="text" name="username" placeholder="Username"></input>
                <input className="ml-6 mr-6 p-3 border-gray-200 border-2 rounded-lg" 
                type="password" name="password" placeholder="Password"></input>
                <input className="rounded-lg p-3 ml-6 mr-6  bg-cyan-400 text-white
                   font-bold"
                 type="submit" value="Login"></input>
            </form>
            <p className="pb-4 text-cyan-500">Don't have an account yet? Sign up here</p>
        </div>
    </div>

    )

// User selected signup
    if (signup) return(
        <div></div>
    )
}

export default Auth