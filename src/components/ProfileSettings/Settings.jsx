import { Outlet } from "react-router-dom"
import SettingsNav from "./SettingsNav"

const ProfileSettings = () => {
    return (
        <>
        <SettingsNav />
        <Outlet />
        </>
    )
}

export default ProfileSettings