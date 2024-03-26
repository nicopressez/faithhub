import { Outlet, useLocation } from "react-router-dom";
import Header from "./components/Header";
import React,{ useEffect } from "react";
import { useAppDispatch } from "./reducers/hooks";
import { loginSuccess, logoutSuccess } from "./reducers/auth";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";
import { userJwtPayload } from "./components/Main/Comments";

function App() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const location = useLocation();

  // Token refresh or redirect if no token
  useEffect(() => {
    if (localStorage.getItem("token")) {
      const fetchToken = async () => {
        try {
          const currentToken = localStorage.getItem("token");
          const response = await fetch(
            "https://faithhub-backend.fly.dev/auth/token",
            {
              method: "GET",
              headers: {
                Authorization: `Bearer ${currentToken}`,
              },
            },
          );
          const result = await response.json();
          localStorage.setItem("token", result.token);
          const decodedToken = jwtDecode<userJwtPayload>(result.token);
          dispatch(loginSuccess(decodedToken.user));
        } catch (err) {
          // Invalid token, log out and clear token
          localStorage.clear();
          dispatch(logoutSuccess());
        }
      };
      fetchToken();
    }
    if (!localStorage.getItem("token")) {
      navigate("/auth");
    } else if (location.pathname === "/") {
      navigate("/home");
    }
  }, [dispatch, navigate, location.pathname]);

  return (
    <>
      <Header />
      <Outlet />
    </>
  );
}

export default App;
