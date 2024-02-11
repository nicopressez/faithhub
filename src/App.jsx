import { Outlet } from "react-router-dom"
import Header from "./components/Header"
import { useEffect } from "react"
import { useSelector, useDispatch } from "react-redux"
import { loginSuccess } from "./reducers/auth"
import { jwtDecode } from "jwt-decode";




function App() {

  const auth = useSelector((state) => state.auth)
        const dispatch = useDispatch()
        const { isLoggedIn, user} = auth


// Token check to assign login
  useEffect(() => {
    if (localStorage.getItem("token")) {
      const token = localStorage.getItem("token");
      const decodedJWT = jwtDecode(token);
      dispatch(loginSuccess(decodedJWT.user));
    }
  },[dispatch])



  return (
    <>
    <Header />
    <Outlet />
    </>
  )
}

export default App
