import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { tokenRefresh } from "../../reducers/auth";
import Moment from "react-moment";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faThumbsUp } from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom/dist";

const Posts = () => {
  const [allPosts, setAllPosts] = useState([]);
  const [likedPosts, setLikedPosts] = useState();
  const [toggledLikes, setToggledLikes] = useState([]);
  const auth = useSelector((state) => state.auth);

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

  const handleLike = async (id) => {
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
      console.log(result);
      localStorage.setItem("token", result.token);
      // Add/remove the post from likes state
      if (result.message === "Like added") {
        const updatedLikes = [...likedPosts, id];
        setLikedPosts(updatedLikes);
      }
      if (result.message === "Like removed") {
        const updatedLikes = likedPosts.filter((postId) => postId !== id);
        setLikedPosts(updatedLikes);
      }
      setToggledLikes((prevToggledLikes) => [
        ...prevToggledLikes,
        { id, action: result.message },
      ]);
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
            ml-auto mr-auto mt-20 lg:mt-20 bg-white lg:w-2/5
             rounded-lg drop-shadow-md p-1 pb-8 lg:p-3 font-Rubik"
      >
        <Link to={`/profile/${post.author._id}`}>
          <div>
            <img
              className=" float-left
                     w-9 h-9 mr-2 md:mr-6 md:w-11 md:h-11 rounded-full object-cover"
              src={`https://faithhub-backend.fly.dev/${post.author.profile_picture}`}
            />
            <p className="float-right">{post.type}</p>
            <p className="font-bold">
              {post.author.first_name} {post.author.last_name}
            </p>
          </div>
        </Link>
        <Moment fromNow className="  italic" date={post.date}></Moment>
        <hr className="mt-1 mb-1 w-[90%] ml-auto mr-auto"></hr>
        <p className="mb-4 mt-2">{post.content}</p>
        <p
          className="float-right text-cyan-400 hover:text-cyan-500
                hover:underline"
        >
          {post.comments.length} comments
        </p>
        <p className="">
          <FontAwesomeIcon
            icon={faThumbsUp}
            onClick={() => handleLike(post._id)}
            className={`
                mr-1  w-5 h-5 hover:text-cyan-500
                hover:cursor-pointer active:text-cyan-600
                ${
                  likedPosts.some((id) => post._id === id)
                    ? "text-cyan-600"
                    : "text-cyan-400"
                }`}
          />
          {toggledLikes.some((item) => item.id === post._id)
            ? toggledLikes.find((item) => item.id === post._id).action ===
              "Like removed"
              ? post.likes.length - 1
              : toggledLikes.find((item) => item.id === post._id).action ===
                  "Like added"
                ? post.likes.length + 1
                : ""
            : post.likes.length}
        </p>
      </div>
    ));
};

export default Posts;
