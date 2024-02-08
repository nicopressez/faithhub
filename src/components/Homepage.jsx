import { useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { useSelector, useDispatch } from "react-redux"
import { loginRequest, loginSuccess, loginFailed } from "../reducers/auth"

const Homepage = () => {
    const navigate = useNavigate()

    const auth = useSelector((state) => state.auth)
    const dispatch = useDispatch()

    const { isLoggedIn, user} = auth

// Not logged in, redirect to auth page
// TODO: Add token check to assign if logged in
    useEffect(() => {
        if (!isLoggedIn){
            navigate("/auth")
        }
    },[isLoggedIn,navigate])
    return (
        <div>homepage</div>
    )
}

export default Homepage