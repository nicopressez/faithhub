import { Outlet } from "react-router-dom"
import SettingsNav from "./SettingsNav"
import { useSelector } from "react-redux"
import { useParams } from "react-router-dom"
import ErrorPage from "../ErrorPage"
import Loading from "../Loading"

const ProfileSettings = () => {
    const { id } = useParams()

    const auth = useSelector((state) => state.auth)
    const { user } = auth
    if (user && user._id === id) return (
        <>
        <SettingsNav />
        <Outlet />
        </>
    )

    if (user && user._id !== id) return (
        <ErrorPage />
    )

    return (
        <Loading />
      )
}

export default ProfileSettings