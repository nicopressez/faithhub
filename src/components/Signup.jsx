import { useState, useEffect } from "react"
import { Transition } from '@headlessui/react';
import { useSelector, useDispatch } from "react-redux"
import { loginSuccess } from "../reducers/auth"
import { signupRequest, signupFailed, signupSuccess, signupNext, signupChange } from "../reducers/signup"
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";
import uploadImg from "../assets/upload.png"
import defaultImg from "../assets/defaultProfile.png"
import { PropTypes } from "prop-types";



const Signup = ({setToSignup}) => {
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
            dispatch(signupRequest())
            const formData = new FormData();

            // Check if data sent is valid
            if (e.target.first_name.value.length < 4 || e.target.first_name.value.length > 16 ) {
                dispatch(signupFailed("Your first name must be between 4 and 16 characters long"))
                return;
            }
            if (e.target.last_name.value.length < 4 || e.target.last_name.value.length > 16 ) {
                dispatch(signupFailed("Your last name must be between 4 and 16 characters long"))
                return;
            }

            // Data valid, send all credentials to new form         
            if (e.target.profile_picture.files.length > 0) {
                formData.append("profile_picture", e.target.profile_picture.files[0]);
            } else {
                // If no file is selected, append the default photo
                const defaultImgBlob = await fetch(defaultImg).then((res) => res.blob());
                const defaultImgFile = new File([defaultImgBlob], "defaultProfile.png");
                formData.append("profile_picture", defaultImgFile); 
            }
            
            formData.append("username", credentials.username)
            formData.append("first_name", credentials.first_name);
            formData.append("last_name", credentials.last_name);
            formData.append("password", credentials.password);
            formData.append("password_verif", credentials.password_verif);


            try {
            const response = await fetch("https://faithhub-backend.fly.dev/auth/signup", {
                method: "POST",
                body: formData,
        
            });
            const result = await response.json()
            dispatch(signupSuccess())

            // Signup successful, user logged in
            if (response.status === 200){
                const token = result.token;
                localStorage.setItem("token", token);
                // Decode token, send user data to state
                const decodedJWT = jwtDecode(token)
                dispatch(loginSuccess(decodedJWT.user))
            } 
        } catch (err) {
            //TODO : Handle errors
            console.log(err)
        }


        }

    return (
        <div className=" bg-gray-100 w-screen h-screen fixed">
            <div className=" ml-auto mr-auto mt-32 text-center bg-white w-1/3
         rounded-lg drop-shadow-md p-3 font-Rubik">
            <Transition 
                show={page ===1}
                enter="transition-opacity duration-300"
                enterFrom="opacity-0"
                enterTo="opacity-100"
                leave="transition-opacity duration-0"
                leaveFrom="opacity-100"
                leaveTo="opacity-0"
            >
        
            <button className="float-left text-cyan-500 underline hover:brightness-[0.85]"onClick={() => setToSignup(false)}>
                Back</button>
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
        
        </Transition>

        
              <Transition
                show={page === 2}
                enter="transition-opacity duration-500"
                enterFrom="opacity-0"
                enterTo="opacity-100"
                leave="transition-opacity duration-0"
                leaveFrom="opacity-100"
                leaveTo="opacity-0"
            >
            
            <button className="float-left text-cyan-500 underline hover:brightness-[0.85]"onClick={() => setPage(1)}>
                Back</button>
            <h1 className=" pt-4 mb-6 text-2xl font-bold">
                Personal info</h1>
        
            <form className="flex flex-col gap-7 mb-4" onSubmit={handleSignup_pageTwo}>
                <label htmlFor="profile_picture" className="group w-32 h-32 ml-auto mr-auto rounded-full">
                <img src={uploadImg} className="hidden w-16 absolute left-[290px] top-[115px] group-hover:block z-10
                "></img>
                <img src={photo} className="group-hover:brightness-90 rounded-full object-cover w-32 h-32
                ml-auto mr-auto"></img>
                </label>
    
                <input id="profile_picture"name="profile_picture" type="file" onChange={handlePhotoChange} className="
                 w-0 h-0 absolute"></input>

                 {error && <h2 className="text-red-600 pb-2">{error}</h2>}

                <input className={`ml-6 mr-6 p-3 border-gray-200 border-2 rounded-lg
                ${isLoading ? "brightness-95" : null}`} 
                type="text" name="first_name" placeholder="First name" value={credentials.first_name} onChange={handleChange}></input>
                <input className={`ml-6 mr-6 p-3 border-gray-200 border-2 rounded-lg
                 ${isLoading ? "brightness-95" : null} `}
                type="text" name="last_name" placeholder="Last name" value={credentials.last_name} onChange={handleChange}></input>


                <input className={`ml-6 mr-6 p-3 border-gray-200 border-2 rounded-lg
                 ${isLoading ? "brightness-95" : null} `}
                type="text" name="location" placeholder="Location (optional) " value={credentials.location} onChange={e => {
                    handleChange(e)}} />


                <input className={`rounded-lg p-3 ml-6 mr-6  bg-cyan-400 text-white
                   font-bold hover:cursor-pointer ${isLoading ? "brightness-95" : null}`}
                 type="submit" value="Sign up" ></input>
            </form>
            </Transition>
        </div>
        </div>
    )
}

Signup.propTypes = {
    setToSignup: PropTypes.func,
}

export default Signup