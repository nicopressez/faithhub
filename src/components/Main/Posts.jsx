import { useEffect, useState } from "react"
import { useSelector, useDispatch } from "react-redux"
import { tokenRefresh } from "../../reducers/auth"

const Posts = () => {

    const [allPosts, setAllPosts] = useState()
    const auth = useSelector((state) => state.auth)

    const dispatch = useDispatch()

    const { user } = auth

    useEffect(() => {
        const fetchPosts = async() => {
            const response = await fetch("https://faithhub-backend.fly.dev/post/all", {
                method: "GET",
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem("token")}`
                }
            })
            const responseData = await response.json();
            setAllPosts(responseData.data)
            // Refresh token & user info
            localStorage.setItem("token", responseData.token)
            dispatch(tokenRefresh(responseData.user))

            console.log(responseData); // Log the response data
        }
        fetchPosts()
    },[dispatch])

    return(
        <div></div>
    )
}

export default Posts