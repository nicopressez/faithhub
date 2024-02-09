import { useState, useEffect } from "react"
import { useSelector, useDispatch } from "react-redux"
import { loginRequest, loginSuccess } from "../reducers/auth"
import { signupRequest, signupFailed, signupSuccess, signupNext, signupChange } from "../reducers/signup"
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";
import uploadImg from "../assets/upload.png"
import defaultImg from "../assets/defaultProfile.png"


const Signup = () => {
    const auth = useSelector((state) => state.auth)
    const signup = useSelector((state) => state.signup)
    const dispatch = useDispatch()
    const navigate = useNavigate();


    const { isLoggedIn } = auth;
    const { isLoading, error, credentials} = signup;

    const [page, setPage] = useState(1)
    const [photo, setPhoto] = useState(defaultImg)

    // Redirect once logged in
    useEffect(() => {
        if(isLoggedIn) {
            navigate("/home");
        }
    },[isLoggedIn, navigate])

    const handlePhotoChange = (e) => {
        setPhoto(URL.createObjectURL(e.target.files[0]))
    }

// Update credentials on input change
    const handleChange = (e) => {
        const { name, value} = e.target;
        dispatch(signupChange({
            ...credentials,
            [name]: value,
        }))
    }

    const handleSignup_pageOne = async(e) => {
            e.preventDefault();
            dispatch(signupRequest())

            const values = {
                ...credentials,
                username: e.target.username.value,
                password: e.target.password.value,
                password_verif: e.target.password_verif.value,
            }
            // Check if credentials are valid
            const checkUsername = await fetch(`https://faithhub-backend.fly.dev/profile/username/${values.username}`)
            if (values.username < 4 || values.username > 16){
                dispatch(signupFailed("Username must be between 4 and 16 characters long"))
                return;
            }
            if (checkUsername.status !== 200) {
                dispatch(signupFailed("Username already taken. Please enter a new one."))
                return;
            }
            if (values.password !== values.password_verif){
                dispatch(signupFailed("Passwords don't match. Please double-check before clicking 'Next'"))
                return;
            }
            if (values.password.length < 8) {
                dispatch(signupFailed("Password must be at least 8 characters long"))
                return;
            }
            dispatch(signupNext(values))
            setPage(2)
        };

        const handleSignup_pageTwo = async(e) => {
            e.preventDefault();


        }

    if (page ===1)return (
        <div className=" bg-gray-100 w-screen h-screen fixed">
        <div className=" ml-auto mr-auto mt-52 text-center bg-white w-1/3
         rounded-lg drop-shadow-md p-3 font-Rubik">
            <h1 className=" pt-4 mb-6 text-2xl font-bold">
                Sign up</h1>
            {error && <h2 className="text-red-600 pb-2">{error}</h2>}
            <form className="flex flex-col gap-6 mb-4" onSubmit={handleSignup_pageOne}>
                <input className={`ml-6 mr-6 p-3 border-gray-200 border-2 rounded-lg
                ${isLoading ? "brightness-95" : null}`} 
                type="text" name="username" placeholder="Username" value={credentials.username} onChange={handleChange}></input>
                <input className={`ml-6 mr-6 p-3 border-gray-200 border-2 rounded-lg
                 ${isLoading ? "brightness-95" : null} `}
                type="password" name="password" placeholder="Password" value={credentials.password} onChange={handleChange}></input>
                <input className={`ml-6 mr-6 p-3 border-gray-200 border-2 rounded-lg
                 ${isLoading ? "brightness-95" : null} `}
                type="password" name="password_verif" placeholder="Confirm password" value={credentials.password_verif} onChange={handleChange} />
                <input className={`rounded-lg p-3 ml-6 mr-6  bg-cyan-400 text-white
                   font-bold hover:cursor-pointer ${isLoading ? "brightness-95" : null}`}
                 type="submit" value="Next" ></input>
            </form>
        </div>
    </div>
    )

    if(page === 2) return (
        <div className=" bg-gray-100 w-screen h-screen fixed">
        <div className=" ml-auto mr-auto mt-32 text-center bg-white w-1/3
         rounded-lg drop-shadow-md p-3 font-Rubik">
            <h1 className=" pt-4 mb-6 text-2xl font-bold">
                Personal info</h1>
            {error && <h2 className="text-red-600 pb-2">{error}</h2>}
            <form className="flex flex-col gap-7 mb-4" onSubmit={handleSignup_pageTwo}>
                <label htmlFor="profile_picture" className="group w-32 h-32 ml-auto mr-auto rounded-full">
                <img src={uploadImg} className="hidden w-16 absolute left-[290px] top-[115px] group-hover:block z-10
                "></img>
                <img src={photo} className="group-hover:brightness-90 rounded-full object-cover w-32 h-32
                ml-auto mr-auto"></img>
                </label>
    
                <input  id="profile_picture"name="profile_picture" type="file" onChange={handlePhotoChange} className="
                 w-0 h-0 absolute"></input>
                <input className={`ml-6 mr-6 p-3 border-gray-200 border-2 rounded-lg
                ${isLoading ? "brightness-95" : null}`} 
                type="text" name="first_name" placeholder="First name" value={credentials.first_name} onChange={handleChange}></input>
                <input className={`ml-6 mr-6 p-3 border-gray-200 border-2 rounded-lg
                 ${isLoading ? "brightness-95" : null} `}
                type="text" name="last_name" placeholder="Last name" value={credentials.last_name} onChange={handleChange}></input>
                <input className={`ml-6 mr-6 p-3 border-gray-200 border-2 rounded-lg
                 ${isLoading ? "brightness-95" : null} `}
                type="text" name="location" placeholder="Location (optional) " value={credentials.location} onChange={handleChange} />
                <input className={`rounded-lg p-3 ml-6 mr-6  bg-cyan-400 text-white
                   font-bold hover:cursor-pointer ${isLoading ? "brightness-95" : null}`}
                 type="submit" value="Sign up" ></input>
            </form>
        </div>
    </div>
    )
}

export default Signup