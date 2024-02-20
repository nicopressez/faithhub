import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { tokenRefresh } from "../../reducers/auth";
import Moment from "react-moment";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faThumbsUp } from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom/dist";
import Comments from "./Comments";
import NewComment from "./NewComment";

const Posts = () => {
  const [allPosts, setAllPosts] = useState([]);
  const [likedPosts, setLikedPosts] = useState();
  const auth = useSelector((state) => state.auth);

  const [newComments, setNewComments] = useState([]);

  const dispatch = useDispatch();

  const { user } = auth;

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch(
          "https://faithhub-backend.fly.dev/post/all",
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          },
        );
        const responseData = await response.json();
        setAllPosts(responseData.data);
        // Refresh token & user info
        localStorage.setItem("token", responseData.token);
        dispatch(tokenRefresh(responseData.user));

        console.log(responseData); // Log the response data
      } catch (err) {
        // TODO: Add error handling
        console.log(err);
      }
    };
    fetchPosts();
  }, [dispatch]);

  useEffect(() => {
    const postsUserLiked = [];
    // Go through all posts likes and look for match with user id
    allPosts.map((post) => {
      for (let i = 0; i < post.likes.length; i++) {
        if (post.likes[i] === user._id) {
          postsUserLiked.push(post._id);
        }
      }
    });
    setLikedPosts(postsUserLiked);
  }, [allPosts, user]);

  const handleLike = async (e, id) => {
    try {
      const response = await fetch(
        `https://faithhub-backend.fly.dev/post/${id}/like`,
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
        const updatedLikes = [...likedPosts, id];
        setLikedPosts(updatedLikes);
      }
      if (result.message === "Like removed") {
        const updatedLikes = likedPosts.filter((postId) => postId !== id);
        setLikedPosts(updatedLikes);
      }

      // Update likes count
      setAllPosts((allPosts) =>
        allPosts.map((post) => {
          if (post._id === id) {
            return {
              ...post,
              likes:
                result.message === "Like added"
                  ? [...post.likes, user._id]
                  : post.likes.filter((id) => id !== user._id),
            };
          }
          return post;
        }),
      );
    } catch (err) {
      // TODO: Add error handling
      console.log(err);
    }
  };

  if (user && allPosts[0] && likedPosts)
    return allPosts.map((post) => (
      <div
        key={post._id}
        className=" 
            ml-auto mr-auto mt-20 lg:mt-20 bg-white lg:w-[45%]
             rounded-lg drop-shadow-md p-1 pb-8 lg:p-5 font-Rubik"
      >
        <Link to={`/profile/${post.author._id}`}>
          <div>
            <img
              className=" float-left
                     w-9 h-9 mr-2 md:mr-4 md:w-11 md:h-11 rounded-full object-cover"
              src={`https://faithhub-backend.fly.dev/${post.author.profile_picture}`}
            />
            <p className="float-right">{post.type}</p>
            <p className="font-bold">
              {post.author.first_name} {post.author.last_name}
            </p>
          </div>
        </Link>
        <Moment fromNow className="  italic" date={post.date}></Moment>

        <p className="mb-4 mt-2">{post.content}</p>
        <p
          className="float-right text-cyan-400 hover:text-cyan-500
                hover:underline"
        >
          {post.comments.length}
          {post.comments.length == 1 ? " comment" : " comments"}
        </p>
        <div>
          <FontAwesomeIcon
            icon={faThumbsUp}
            onClick={(e) => handleLike(e, post._id)}
            className={`
                mr-1  w-5 h-5 hover:text-cyan-500
                hover:cursor-pointer active:text-cyan-600
                ${
                  likedPosts.some((id) => post._id === id)
                    ? "text-cyan-600"
                    : "text-cyan-400"
                }`}
          />
          <span>{post.likes.length}</span>
          <hr className="mt-2 w-[90%] ml-auto mr-auto"></hr>
          <div className="pl-4 pr-4 pt-4">
            <Comments
              postid={post._id}
              newComments={newComments}
              setNewComments={setNewComments}
            />
            <NewComment postid={post._id} setNewComments={setNewComments} />
          </div>
        </div>
      </div>
    ));
};

export default Posts;
