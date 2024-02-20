import { PropTypes } from "prop-types";
import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Moment from "react-moment";
import { Link } from "react-router-dom";
import { faThumbsUp, faEllipsisVertical } from "@fortawesome/free-solid-svg-icons";
import { useSelector } from "react-redux";
import { Transition, Menu } from "@headlessui/react";

const Comments = ({ postid, newComments, setNewComments }) => {
  const auth = useSelector((state) => state.auth);
  const { user } = auth;

  const [allComments, setAllComments] = useState([]);
  const [showAll, setShowAll] = useState(false);
  const [likedComments, setLikedComments] = useState();
  const [errors, setErrors] = useState(false);

  useEffect(() => {
    const fetchTopComments = async () => {
      try {
        const response = await fetch(
          `https://faithhub-backend.fly.dev/post/${postid}/topcomments`,
        );
        const data = await response.json();
        setAllComments(data.comments);
      } catch (err) {
        setErrors(true);
      }
    };
    fetchTopComments();
  }, [postid]);

  useEffect(() => {
    const commentsUserLiked = [];
    // Go through all posts likes and look for match with user id
    allComments.map((comment) => {
      for (let i = 0; i < comment.likes.length; i++) {
        if (comment.likes[i] === user._id) {
          commentsUserLiked.push(comment._id);
        }
      }
    });
    setLikedComments(commentsUserLiked);
  }, [allComments, user]);

  const handleLike = async (e, id) => {
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
      setAllComments((comments) =>
        comments.map((comment) => {
          if (comment._id === id) {
            return {
              ...comment,
              likes:
                result.message === "Like added"
                  ? [...comment.likes, user._id]
                  : comment.likes.filter((id) => id !== user._id),
            };
          }
          return comment;
        }),
      );
    } catch (err) {
      setErrors(true);
    }
  };

  const handleShowAll = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(
        `https://faithhub-backend.fly.dev/post/${postid}/comments`,
      );
      const data = await response.json();
      setAllComments(data.comments);
      // Go through new comments likes and look for match with user id
      const commentsUserLiked = [];
      allComments.map((comment) => {
        for (let i = 0; i < comment.likes.length; i++) {
          if (comment.likes[i] === user._id) {
            commentsUserLiked.push(comment._id);
          }
        }
      });
      setLikedComments((prevLikes) => [...prevLikes, commentsUserLiked]);
      setShowAll(true);
    } catch (err) {
      setErrors(true);
    }
  };

  if (errors)
    return (
      <p className="text-center text-gray-300 italic">
        There was an error loading comments
      </p>
    );

  if (!allComments[0])
    return <p className="text-center text-gray-300 italic">No comments yet</p>;

  if (user)
    return (
      <div>
        <Transition
          show={allComments.length > 0}
          enter="transition duration-200 ease-out"
          enterFrom="transform scale-y-0 opacity-0"
          enterTo="transform scale-y-100 opacity-100"
          leave="transition duration-200 ease-out"
          leaveFrom="transform scale-y-100 opacity-100"
          leaveTo="transform scale-y-100 opacity-0"
        >
          {allComments.map((comment) => (
            <div key={comment._id} className="relative mb-5">
              <div className="bg-gray-50 rounded-lg p-2">
                  <div>
                  <Link to={`/profile/${comment.author._id}`}>
                    <img
                      className=" float-left
                     w-9 h-9 mr-2 md:mr-3 md:w-8 md:h-8 rounded-full object-cover"
                      src={`https://faithhub-backend.fly.dev/${comment.author.profile_picture}`}
                    />
                    </Link>
                    {// Edit/delete menu
                    user._id === comment.author._id &&
                    <Menu as="div" className="float-right">
                    <Menu.Button>
                    <FontAwesomeIcon className="mt-1 mr-1 h-4
                       text-gray-400"
                    icon={faEllipsisVertical} />
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
                        className="absolute mt-2 mr-2 right-0 w-52 md:w-64 flex
                 flex-col bg-white gap-1 drop-shadow-xl rounded-lg text-lg 
                   pt-2 pb-2 justify-center"
                      >
                        <Menu.Item>
                          {({ active }) => (
                            <a
                              className={`${active && "bg-gray-100"} pl-2`}
                              href={`/profile/${user._id}`}
                            >
                              Edit
                            </a>
                          )}
                        </Menu.Item>
                        <Menu.Item>
                          {({ active }) => (
                            <button
                              className={`${active && "bg-gray-100"} text-red-500 pl-2 text-left`}
                            >
                              Delete
                            </button>
                          )}
                        </Menu.Item>
                      </Menu.Items>
                    </Transition>
                  </Menu>
                      }
                    <Link to={`/profile/${comment.author._id}`}
                    className=" text-gray-800">
                      {comment.author.first_name} {comment.author.last_name}
                    </Link>
          
                  </div>
                <p className="mb-1">{comment.content}</p>
                <Moment
                  fromNow
                  className="text-gray-500 text-sm  italic"
                  date={comment.date}
                ></Moment>
                <div className="float-right">
                  <FontAwesomeIcon
                    icon={faThumbsUp}
                    onClick={(e) => handleLike(e, comment._id)}
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
            </div>
          ))}
        </Transition>
        <Transition
          show={newComments.length > 0}
          enter="transition duration-200 ease-out"
          enterFrom="transform scale-y-0 opacity-0"
          enterTo="transform scale-y-100 opacity-100"
          leave="transition duration-200 ease-out"
          leaveFrom="transform scale-y-100 opacity-100"
          leaveTo="transform scale-y-100 opacity-0"
        >
          {newComments.map((comment) => (
            <div key={comment._id} className="relative mb-5">
              <div className="bg-gray-50 rounded-lg p-2 ml-1">
                <Link to={`/profile/${comment.author._id}`}>
                  <div className="absolute left-0 top-0 bg-cyan-400 h-full w-1 rounded-full"></div>
                  <div>
                    <img
                      className="float-left w-9 h-9 mr-2 md:mr-3 md:w-8 md:h-8 rounded-full object-cover"
                      src={`https://faithhub-backend.fly.dev/${user.profile_picture}`}
                    />
                    <p className="text-gray-800">
                      {user.first_name} {user.last_name}
                    </p>
                  </div>
                </Link>
                <p className="mb-1">{comment.content}</p>
                <Moment
                  fromNow
                  className="text-gray-500 text-sm italic"
                  date={comment.date}
                ></Moment>
                <div className="float-right">
                  <FontAwesomeIcon
                    icon={faThumbsUp}
                    onClick={(e) => handleLike(e, comment._id)}
                    className={`
                  mr-1 w-4 h-4 hover:text-cyan-500 hover:cursor-pointer active:text-cyan-600
                  ${
                    likedComments.some((id) => comment._id === id)
                      ? "text-cyan-600"
                      : "text-cyan-400"
                  }`}
                  />
                  <span className="text-sm">{comment.likes.length}</span>
                </div>
              </div>
            </div>
          ))}
        </Transition>

        {allComments.length > 1 && !showAll && (
          <button
            className="relative left-1/2 -translate-x-1/2
        hover:underline text-cyan-400 hover:text-cyan-500"
            onClick={(e) => {
              setNewComments([]);
              handleShowAll(e);
            }}
          >
            Show all
          </button>
        )}

        {showAll && (
          <button
            className="relative left-1/2 -translate-x-1/2
        hover:underline text-cyan-400 hover:text-cyan-500"
            onClick={() => {
              setAllComments(allComments.slice(0, 2));
              setNewComments([]);
              setShowAll(false);
            }}
          >
            Show less
          </button>
        )}
      </div>
    );
};

Comments.propTypes = {
  postid: PropTypes.string,
  newComments: PropTypes.array,
  setNewComments: PropTypes.func,
};

export default Comments;
