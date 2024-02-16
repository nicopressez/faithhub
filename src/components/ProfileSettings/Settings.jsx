import { Outlet } from "react-router-dom"
import SettingsNav from "./SettingsNav"
import { useSelector } from "react-redux"
import { useParams } from "react-router-dom"
import ErrorPage from "../ErrorPage"
import Loading from "../Loading"

const ProfileSettings = () => {
    const { id } = useParams()

    const auth = useSelector((state) => state.auth)
    const sideNav = useSelector((state) => state.sideNav)

    const { user } = auth
    const { navVisible } = sideNav

    if (user && user._id === id) return (
        <>
        <SettingsNav />
        <Outlet context={[navVisible]}/>
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