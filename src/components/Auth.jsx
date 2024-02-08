import { useState } from "react"

const Auth = () => {

    const [signup, setSignup] = useState(false)

    const handleLogin = async(e) => {
    // TODO: Add loading state
        e.preventDefault();
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
        // Login successful
        if (response.status === 200){
            const token = result.token;
            localStorage.setItem("token", token);
        // TODO: Handle is loggedin state
        }
    } catch(err) {
        // TODO:  error and show message
        console.log(err)
    }
    }

// Login
    if (!signup) return (
    <div className=" bg-gray-100 w-screen h-screen fixed">
        <div className=" ml-auto mr-auto mt-52 text-center bg-white w-1/3
         rounded-lg drop-shadow-md p-3">
            <h1 className=" pt-4 mb-6 font-Rubik text-2xl font-bold">
                Welcome to FaithHub!</h1>
            <form className="flex flex-col gap-6 mb-4" onSubmit={handleLogin}>
                <input className="ml-6 mr-6 p-3 border-gray-200 border-2 rounded-lg" 
                type="text" name="username" placeholder="Username"></input>
                <input className="ml-6 mr-6 p-3 border-gray-200 border-2 rounded-lg" 
                type="password" name="password" placeholder="Password"></input>
                <input className="rounded-lg p-3 ml-6 mr-6  bg-cyan-400 text-white
                   font-bold"
                 type="submit" value="Login"></input>
            </form>
            <p className="pb-4 text-cyan-500 underline">Don't have an account yet? Sign up here</p>
        </div>
    </div>

    )

// User selected signup
    if (signup) return(
        <div></div>
    )
}

export default Auth