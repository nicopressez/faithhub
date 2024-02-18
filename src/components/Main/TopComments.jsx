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

    const [comments, setComments] = useState([])
    const [likedComments, setLikedComments] = useState()

    useEffect(() => {
        const fetchTopComments = async() => {
          try{
            const response = await fetch(`https://faithhub-backend.fly.dev/post/${postid}/topcomments`)
            const data = await response.json()
            setComments(data.comments)
            console.log(data)
          } catch(err) {
            console.log(err)
          }
        }
        fetchTopComments()
    },[postid])

    useEffect(() => {
        const commentsUserLiked = [];
        // Go through all posts likes and look for match with user id
        comments.map((comment) => {
          for (let i = 0; i < comment.likes.length; i++) {
            if (comment.likes[i] === user._id) {
              commentsUserLiked.push(comment._id);
            }
          }
        });
        setLikedComments(commentsUserLiked);
      }, [comments, user]);
    
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
    
          // Add/remove the post from liked
        if (result.message === "Like added") {
          const updatedLikes = [...likedComments, id];
          setLikedComments(updatedLikes);
        }
        if (result.message === "Like removed") {
          const updatedLikes = likedComments.filter((postId) => postId !== id);
          setLikedComments(updatedLikes);
        }
    
          // Update likes count
          setComments(allComments => allComments.map(comment => {
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
          // TODO: Add error handling
          console.log(err);
        }
      };

// Return comments
if (user && comments[0]) 
return comments.map( comment => 
    (
    <div key={comment._id}>
        <div>
        <Link to={`/profile/${comment.author._id}`}>
          <div>
            <img
              className=" float-left
                     w-9 h-9 mr-2 md:mr-6 md:w-11 md:h-11 rounded-full object-cover"
              src={`https://faithhub-backend.fly.dev/${comment.author.profile_picture}`}
            />
            <p className="font-bold">
              {comment.author.first_name} {comment.author.last_name}
            </p>
          </div>
        </Link>
        <Moment fromNow className="  italic" date={comment.date}></Moment>
        <hr className="mt-1 mb-1 w-[90%] ml-auto mr-auto"></hr>
        <p className="mb-4 mt-2">{comment.content}</p>
        <div>
          <FontAwesomeIcon
            icon={faThumbsUp}
            onClick={(e) => handleLike(e,comment._id)}
            className={`
                mr-1  w-5 h-5 hover:text-cyan-500
                hover:cursor-pointer active:text-cyan-600
                ${
                  likedComments.some((id) => comment._id === id)
                    ? "text-cyan-600"
                    : "text-cyan-400"
                }`}
          />
          <span>{comment.likes.length}</span>
        </div>
        </div>
    </div>)
)

// TODO: Add return if no comments yet
    }


TopComments.propTypes = {
    postid: PropTypes.string,
}

export default TopComments