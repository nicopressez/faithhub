import { PropTypes } from "prop-types";
import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Moment from "react-moment";
import { Link } from "react-router-dom";
import { faThumbsUp } from "@fortawesome/free-solid-svg-icons";
import { useSelector } from "react-redux";

const TopComments = ({ postid }) => {

    const auth = useSelector((state) => state.auth);
    const { user } = auth;

    const [topComments, setTopComments] = useState([])
    const [allComments, setAllComments] = useState([])
    const [showAll, setShowAll] = useState(false)
    const [likedComments, setLikedComments] = useState()
    const [errors, setErrors] = useState(false)

    useEffect(() => {
        const fetchTopComments = async() => {
          try{
            const response = await fetch(`https://faithhub-backend.fly.dev/post/${postid}/topcomments`)
            const data = await response.json()
            setTopComments(data.comments)
          } catch(err) {
            setErrors(true)
          }
        }
        fetchTopComments()
    },[postid])

    useEffect(() => {
        const commentsUserLiked = [];
        // Go through all posts likes and look for match with user id
        topComments.map((comment) => {
          for (let i = 0; i < comment.likes.length; i++) {
            if (comment.likes[i] === user._id) {
              commentsUserLiked.push(comment._id);
            }
          }
        });
        setLikedComments(commentsUserLiked);
      }, [topComments, user]);
    
      const handleLike = async (e,id) => {
        try {
          const response = await fetch(
            `https://faithhub-backend.fly.dev/post/${postid}/comments/${id}/like`,
            {
              method: "POST",
              headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
              },
            },
          );
          const result = await response.json();
          
          // Refresh token
          localStorage.setItem("token", result.token);
    
          // Add/remove the comment from liked
        if (result.message === "Like added") {
          const updatedLikes = [...likedComments, id];
          setLikedComments(updatedLikes);
        }
        if (result.message === "Like removed") {
          const updatedLikes = likedComments.filter((postId) => postId !== id);
          setLikedComments(updatedLikes);
        }
    
          // Update likes count
          setTopComments(allComments => allComments.map(comment => {
            if (comment._id === id) {
              return {
                ...comment,
                likes: result.message === "Like added" 
                ?[...comment.likes, user._id] 
                : comment.likes.filter(id => id!== user._id)
              }
            }
            return comment
          }))
    
        } catch (err) {
          setErrors(true)
        }
      };

      const handleShowAll = async(e) => {
        e.preventDefault()
        try {
            const response = await fetch(`https://faithhub-backend.fly.dev/post/${postid}/comments`)
            const data = await response.json()
            setAllComments(data.comments)
            setShowAll(true)
        } catch(err) {
            setErrors(true)
        }
      }

// Return top 2 comments
if (user && topComments[0] && !showAll) 
return topComments.map( comment => 
    (
    <div key={comment._id} className="relative">
        <div className="bg-gray-50 rounded-lg p-2">
        <Link to={`/profile/${comment.author._id}`}>
          <div>
            <img
              className=" float-left
                     w-9 h-9 mr-2 md:mr-3 md:w-8 md:h-8 rounded-full object-cover"
              src={`https://faithhub-backend.fly.dev/${comment.author.profile_picture}`}
            />
            <p className=" text-gray-800">
              {comment.author.first_name} {comment.author.last_name}
            </p>
          </div>
        </Link>
        <p className="mb-1">{comment.content}</p>
        <Moment fromNow className=" text-sm  italic" date={comment.date}></Moment>
        <div className="float-right">
          <FontAwesomeIcon
            icon={faThumbsUp}
            onClick={(e) => handleLike(e,comment._id)}
            className={`
                mr-1  w-4 h-4 hover:text-cyan-500
                hover:cursor-pointer active:text-cyan-600
                ${
                  likedComments.some((id) => comment._id === id)
                    ? "text-cyan-600"
                    : "text-cyan-400"
                }`}
          />
          <span className="text-sm">{comment.likes.length}</span>
        </div>
        </div>
        {topComments[1] && 
        <button className="absolute left-1/2 -translate-x-1/2 mt-1
        hover:underline text-cyan-400 hover:text-cyan-500"
        onClick={handleShowAll}>
            Show all
        </button>}
        
    </div>)
)

if (user && allComments && showAll)
return allComments.map( comment => 
    (
    <div key={comment._id} className="relative">
        <div className="bg-gray-50 rounded-lg p-2">
        <Link to={`/profile/${comment.author._id}`}>
          <div>
            <img
              className=" float-left
                     w-9 h-9 mr-2 md:mr-3 md:w-8 md:h-8 rounded-full object-cover"
              src={`https://faithhub-backend.fly.dev/${comment.author.profile_picture}`}
            />
            <p className=" text-gray-800">
              {comment.author.first_name} {comment.author.last_name}
            </p>
          </div>
        </Link>
        <p className="mb-1">{comment.content}</p>
        <Moment fromNow className=" text-sm  italic" date={comment.date}></Moment>
        <div className="float-right">
          <FontAwesomeIcon
            icon={faThumbsUp}
            onClick={(e) => handleLike(e,comment._id)}
            className={`
                mr-1  w-4 h-4 hover:text-cyan-500
                hover:cursor-pointer active:text-cyan-600
                ${
                  likedComments.some((id) => comment._id === id)
                    ? "text-cyan-600"
                    : "text-cyan-400"
                }`}
          />
          <span className="text-sm">{comment.likes.length}</span>
        </div>

        </div>
        <button className="absolute left-1/2 -translate-x-1/2 mt-1
        hover:underline text-cyan-400 hover:text-cyan-500"
        onClick={() => setShowAll(false)}>
            Show less</button>
    </div>)
)

if(errors) return (
    <p className="text-center text-gray-300 italic">There was an error loading comments</p>
)

return (
    <p className="text-center text-gray-300 italic">No comments yet</p>
)
    }


TopComments.propTypes = {
    postid: PropTypes.string,
}

export default TopComments