import { Outlet } from "react-router-dom"
import Nav from "./Nav"

const MainPage = () => {

    return (
        <>
        <Nav />
        <Outlet />
        </>
    )
}

export default MainPage