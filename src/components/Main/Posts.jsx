import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { tokenRefresh } from "../../reducers/auth";
import Moment from "react-moment";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faThumbsUp,
  faEllipsisVertical,
  faTrash,
  faPenToSquare,
  faPaperPlane,
} from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom/dist";
import Comments from "./Comments";
import NewComment from "./NewComment";
import defaultImg from "../../assets/defaultProfile.png";
import he from "he";
import { Menu, Transition } from "@headlessui/react";

const Posts = () => {
  const [allPosts, setAllPosts] = useState([]);
  const [likedPosts, setLikedPosts] = useState();
  const auth = useSelector((state) => state.auth);

  const [newComments, setNewComments] = useState([]);

  const [editing, setEditing] = useState();
  const [editedPost, setEditedPost] = useState("");

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

  // Toggle editing form
  const toggleEdit = (e, post) => {
    e.preventDefault();
    setEditing(post._id);
    setEditedPost(post.content);
  };

  // Update edited comment on form input
  const handleEditChange = (e) => {
    setEditedPost(e.target.value);
  };

  // When reaching a new line on the editing input, go to next line
  const handleInput = (e) => {
    e.target.style.height = "auto";
    e.target.style.height = e.target.scrollHeight + "px";
  };

  const handleEdit = (e, id) => {
    e.preventDefault();
  };

  const handleDelete = async (e, id) => {
    e.preventDefault();
  };

  if (user && allPosts[0] && likedPosts)
    return allPosts.map((post) => (
      <div
        key={post._id}
        className=" 
            ml-auto mr-auto mt-20 lg:mt-20 bg-white lg:w-[45%]
             rounded-lg drop-shadow-md p-1 pb-8 lg:p-5 font-Rubik"
      >
        {post.anonymous ? (
          <img
            className=" float-left
                     w-9 h-9 mr-2 md:mr-4 md:w-11 md:h-11 rounded-full object-cover"
            src={defaultImg}
          />
        ) : (
          <Link to={`/profile/${post.author._id}`}>
            <img
              className=" float-left
                w-9 h-9 mr-2 md:mr-4 md:w-11 md:h-11 rounded-full object-cover"
              src={`https://faithhub-backend.fly.dev/${post.author.profile_picture}`}
            />
          </Link>
        )}
        {
          // Edit/delete menu
          user._id === post.author._id && (
            <Menu as="div" className="relative float-right">
              <Menu.Button>
                <FontAwesomeIcon
                  className="mt-1 mr-1 h-4
                       text-gray-400"
                  icon={faEllipsisVertical}
                />
              </Menu.Button>
              <Transition
                enter="transition duration-200 ease-out"
                enterFrom="transform scale-y-0 opacity-0"
                enterTo="transform scale-y-100 opacity-100"
                leave="transition duration-200 ease-out"
                leaveFrom="transform scale-y-100 opacity-100"
                leaveTo="transform scale-y-100 opacity-0"
              >
                <Menu.Items
                  className="absolute -bottom-9 left-5 w-36 md:w-28 flex
                 flex-col bg-white gap-1 drop-shadow-xl rounded-lg
                   pt-2 pb-2 justify-center"
                >
                  <Menu.Item>
                    {({ active }) => (
                      <button
                        className={`${active && "bg-gray-100"} pl-2 text-left
                              text-gray-700`}
                        onClick={(e) => toggleEdit(e, post)}
                      >
                        <FontAwesomeIcon
                          icon={faPenToSquare}
                          className="pr-2 "
                        />
                        Edit
                      </button>
                    )}
                  </Menu.Item>
                  <Menu.Item>
                    {({ active }) => (
                      <button
                        className={`${active && "bg-gray-100"} text-red-500 pl-2 text-left`}
                        onClick={(e) => handleDelete(e, post._id)}
                      >
                        <FontAwesomeIcon icon={faTrash} className="pr-2" />
                        Delete
                      </button>
                    )}
                  </Menu.Item>
                </Menu.Items>
              </Transition>
            </Menu>
          )
        }
        <p className="float-right mr-3">{post.type}</p>
        <p className="font-bold">
          {post.author._id === user._id && !post.anonymous ? (
            <Link to={`/profile/${post.author._id}`}>You</Link>
          ) : post.anonymous ? (
            "Anonymous"
          ) : (
            <Link to={`/profile/${post.author._id}`}>
              {post.author.first_name} {post.author.last_name}
            </Link>
          )}
        </p>

        <Moment fromNow className="  italic" date={post.date}></Moment>

        {editing === post._id ? (
          <form
            onSubmit={(e) => handleEdit(e, post._id)}
            className="mt-1 relative"
          >
            <textarea
              name="content"
              className="bg-gray-100 rounded-lg  pl-2 pb-2 pt-2
                  overflow-visible resize-none pr-8 text-gray-600"
              placeholder="Your comment must be 4 characters long"
              value={editedPost}
              onChange={handleEditChange}
              onInput={handleInput}
              rows="1"
              cols="60"
            ></textarea>
            {editedPost.length > 4 && (
              <button
                type="submit"
                className="absolute bottom-[0%]
                 -translate-y-1/2 cursor-pointer right-[19%]"
              >
                <FontAwesomeIcon
                  icon={faPaperPlane}
                  className="text-cyan-400 hover:text-cyan-500"
                />
              </button>
            )}
          </form>
        ) : (
          <p className="mb-4 mt-2">{he.decode(post.content)}</p>
        )}
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
