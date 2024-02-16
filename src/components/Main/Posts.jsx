import { useEffect, useState } from "react"
import { useSelector, useDispatch } from "react-redux"
import { tokenRefresh } from "../../reducers/auth"
import Moment from 'react-moment';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faThumbsUp } from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom/dist";

const Posts = () => {

    const [allPosts, setAllPosts] = useState()
    const auth = useSelector((state) => state.auth)

    const dispatch = useDispatch()

    const { user } = auth

    useEffect(() => {
        const fetchPosts = async() => {
            try {
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
            } catch (err){
                // TODO: Add error handling
                console.log(err)
            }
        }
        fetchPosts()
    },[dispatch])

   
    if (allPosts) return (
    allPosts.map(post =>
        (
            <div key={post._id} className=" 
            ml-auto mr-auto mt-20 lg:mt-20 bg-white lg:w-2/5
             rounded-lg drop-shadow-md p-1 pb-8 lg:p-3 font-Rubik">
                <Link to={`/profile/${post.author._id}`}>
                <div>
                    <img 
                     className=" float-left
                     w-9 h-9 mr-2 md:mr-6 md:w-11 md:h-11 rounded-full object-cover"
                     src={`https://faithhub-backend.fly.dev/${post.author.profile_picture}`}
                     />
                     <p className="float-right">{post.type}</p>
                    <p className="font-bold">{post.author.first_name} {post.author.last_name}</p>       
                </div>
                </Link>
                <Moment fromNow 
                     className="  italic" 
                     date={post.date}>
                    </Moment>
                <hr className="mt-1 mb-1 w-[90%] ml-auto mr-auto"></hr>
                <p className="mb-4 mt-2">{post.content}</p>
                <p className="float-right text-cyan-400 hover:text-cyan-500
                hover:underline"
                >
                    {post.comments.length} comments</p>
                <p className="">
                <FontAwesomeIcon icon={faThumbsUp} 
                className="mr-1 text-cyan-400 w-5 h-5 hover:text-cyan-500
                hover:cursor-pointer active:text-cyan-600"
                />
                {post.likes.length}
                </p>
            </div>
        )
    )
    )
    
}

export default Posts