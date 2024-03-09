import { useState, useEffect } from "react";
import { Transition } from "@headlessui/react";
import { useSelector, useDispatch } from "react-redux";
import { loginRequest, loginSuccess, loginFailed } from "../reducers/auth";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";
import Signup from "./Signup";

const Auth = () => {
  const auth = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { isLoggedIn, isLoading, error } = auth;

  const [toSignup, setToSignup] = useState(false);

  // Redirect once logged in
  useEffect(() => {
    if (isLoggedIn) {
      navigate("/home");
    }
  }, [isLoggedIn, navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    // Set loading
    dispatch(loginRequest());

    const form = e.target;
    const payload = {
      username: form.username.value,
      password: form.password.value,
    };
    try {
      const response = await fetch(
        "https://faithhub-backend.fly.dev/auth/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        },
      );
      const result = await response.json();

      if (response.status === 200) {
        const token = result.token;
        localStorage.setItem("token", token);
        // Decode token, send user data to state
        const decodedJWT = jwtDecode(token);
        dispatch(loginSuccess(decodedJWT.user));
      }
    } catch (err) {
      // Invalid credentials, set error message
      setTimeout(() => {
        dispatch(loginFailed());
      }, 500);
    }
  };

  return (
    <div className=" bg-gray-100 w-screen h-screen fixed md:pl-5 md:pr-5">
      <Transition
        show={toSignup === false}
        enter="transition-all duration-500"
        enterFrom="translate-x-40 opacity-0"
        enterTo="translate-x-0 opacity-100"
      >
        <div
          className=" 
        ml-auto mr-auto mt-20 lg:mt-32 text-center bg-white lg:w-[40%]
         rounded-lg drop-shadow-md p-1 pb-8 md:p-3 font-Rubik"
        >
          <h1 className=" pt-4 mb-4 text-xl md:text-2xl font-bold">
            Welcome to FaithHub!
          </h1>
          {error && <h2 className="text-red-600 pb-6 md:pb-4">{error}</h2>}
          <form className="flex flex-col gap-6 mb-4" onSubmit={handleLogin}>
            <input
              className={`mr-4 ml-4 md:ml-6 md:mr-6 p-3 border-gray-200 border-2 rounded-lg
                ${isLoading ? "brightness-95" : null}`}
              type="text"
              name="username"
              placeholder="Username"
            ></input>
            <input
              className={`mr-4 ml-4 md:ml-6 md:mr-6 p-3 border-gray-200 border-2 rounded-lg
                 ${isLoading ? "brightness-95" : null} `}
              type="password"
              name="password"
              placeholder="Password"
            ></input>
            <input
              className={`rounded-lg p-3 mr-4 ml-4 md:ml-6 md:mr-6  bg-cyan-400 text-white
                   font-bold hover:cursor-pointer ${isLoading ? "brightness-95" : null}`}
              type="submit"
              value="Login"
            ></input>
          </form>
          <button
            className="text-sm md:text-base pb-4 text-cyan-500 underline
            hover:brightness-[0.85]"
            onClick={() => setToSignup(true)}
          >
            Don&apos;t have an account yet? Sign up here
          </button>
        </div>
      </Transition>

      <Transition
        show={toSignup === true}
        enter="transition-all duration-500"
        enterFrom="translate-x-40 opacity-0"
        enterTo="translate-x-0 opacity-100"
      >
        <Signup toSignup={toSignup} setToSignup={setToSignup} />
      </Transition>
    </div>
  );
};

export default Auth;
