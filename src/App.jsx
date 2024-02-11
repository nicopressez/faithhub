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

  // Token check to assign login
  useEffect(() => {
    if (localStorage.getItem("token")) {
      const token = localStorage.getItem("token");
      const decodedJWT = jwtDecode(token);
      dispatch(loginSuccess(decodedJWT.user));
    }
    if (!localStorage.getItem("token")) {
      navigate("/auth");
    }
  }, [dispatch, isLoggedIn, navigate]);

  return (
    <>
      <Header />
      <Outlet />
    </>
  );
}

export default App;
