import { Outlet } from "react-router-dom"
import Nav from "./Nav"
import { useSelector } from "react-redux"

const MainPage = () => {

    const sideNav = useSelector((state) => state.sideNav)
    const { navVisible } = sideNav
    return (
        <>
        <Nav />
        <Outlet context={[navVisible]}/>
        </>
    )
}

export default MainPage