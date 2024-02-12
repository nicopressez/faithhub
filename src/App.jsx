import { Outlet } from "react-router-dom";
import Header from "./components/Header";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { loginSuccess } from "./reducers/auth";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

function App() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const auth = useSelector((state) => state.auth);

  const { isLoggedIn } = auth;

  // Token refresh or redirect if no token
  useEffect(() => {
    if (localStorage.getItem("token")){
      const fetchToken = async () => {
      const currentToken = localStorage.getItem("token")
      const response = await fetch("https://faithhub-backend.fly.dev/auth/token", {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${currentToken}`
        }
      })
      const result = await response.json()
      localStorage.setItem("token", result.token)
      const decodedToken = jwtDecode(result.token)
      dispatch(loginSuccess(decodedToken.user))
    }
  fetchToken()
  }
   if (!localStorage.getItem("token")){
    navigate("/auth")
   }
  }, [dispatch, navigate, isLoggedIn]);

  return (
    <>
      <Header />
      <Outlet />
    </>
  );
}

export default App;
