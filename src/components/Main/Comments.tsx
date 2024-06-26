import React, { ChangeEvent, useEffect, useRef, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Moment from "react-moment";
import { Link } from "react-router-dom";
import {
  faThumbsUp,
  faEllipsisVertical,
  faPenToSquare,
  faTrash,
  faPaperPlane,
  faFaceSmile,
} from "@fortawesome/free-solid-svg-icons";
import { useAppSelector, useAppDispatch } from "../../reducers/hooks";
import { Transition, Menu } from "@headlessui/react";
import { User, tokenRefresh } from "../../reducers/auth";
import { JwtPayload, jwtDecode } from "jwt-decode";
import he from "he";
import { useMediaQuery } from "@uidotdev/usehooks";
import EmojiPicker, { EmojiClickData } from "emoji-picker-react";

export type newComment = {
  author: string;
  content: string;
  date?: string;
  edited: boolean;
  likes?: string[];
  postid: string;
  _id: string;
};

interface Comment {
  _id: string;
  author: {
    _id: string;
    profile_picture: string;
    first_name: string;
    last_name: string;
  };
  date: string;
  content: string;
  edited: boolean;
  likes: string[];
}

type CommentsProps = {
  postid: string;
  newComments: newComment[];
  setNewComments: React.Dispatch<React.SetStateAction<newComment[]>>;
};

export interface userJwtPayload extends JwtPayload {
  user: User;
}

const Comments = ({ postid, newComments, setNewComments }: CommentsProps) => {
  // Get device size to adjust design for small screens
  const isLargeDevice = useMediaQuery("only screen and (min-width: 1040px)");

  const dispatch = useAppDispatch();

  const auth = useAppSelector((state) => state.auth);
  const { user } = auth;

  const [allComments, setAllComments] = useState<Comment[]>([]);
  const [showAll, setShowAll] = useState(false);
  const [likedComments, setLikedComments] = useState<string[]>([]);

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [rows, setRows] = useState(1);

  const [editing, setEditingInternal] = useState<string>();
  // Allow to set edit without argument
  const setEditing = (value?: string) => setEditingInternal(value);

  const [editedComment, setEditedComment] = useState("");

  const [showEmojis, setShowEmojis] = useState(false);

  // Error handling
  const [errors, setErrors] = useState(false);
  const [editingError, setEditingError] = useState(false);
  const [deletingError, setDeletingError] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      if (textareaRef.current) {
        // Get width of the main div of the edit form section
        const parentWidth = (
          textareaRef.current.parentNode?.parentNode?.parentNode as HTMLElement
        ).clientWidth;

        // Set textarea width as a percentage of main div width
        textareaRef.current.style.width = `${parentWidth * 0.9}px`;
      }
    };

    window.addEventListener("resize", handleResize);
    if (editing) handleResize();

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [editing]);

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
    const commentsUserLiked: string[] = [];
    // Go through all posts likes and look for match with user id
    allComments.map((comment) => {
      for (let i = 0; i < comment.likes.length; i++) {
        if (comment.likes[i] === user?._id) {
          commentsUserLiked.push(comment._id);
        }
      }
    });
    setLikedComments(commentsUserLiked);
  }, [allComments, user]);

  const handleLike = async (id: string) => {
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
      if (user) {
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
      }
    } catch (err) {
      setErrors(true);
    }
  };

  const handleShowAll = async (e: React.MouseEvent<HTMLButtonElement>) => {
    if (user) {
      e.preventDefault();
      try {
        const response = await fetch(
          `https://faithhub-backend.fly.dev/post/${postid}/comments`,
        );
        const data = await response.json();
        setAllComments(data.comments);
        // Go through new comments likes and look for match with user id
        const commentsUserLiked: string[] = [];
        allComments.map((comment) => {
          for (let i = 0; i < comment.likes.length; i++) {
            if (comment.likes[i] === user._id) {
              commentsUserLiked.push(comment._id);
            }
          }
        });
        setLikedComments((prevLikes) => [...prevLikes, ...commentsUserLiked]);
        setShowAll(true);
      } catch (err) {
        setErrors(true);
      }
    }
  };

  const calculateRows = (content: string) => {
    // Calculate rows based on post content
    const numRows = Math.max(3, Math.ceil(content.length / 60));
    return { rows: numRows };
  };

  const toggleEdit = (
    e: React.MouseEvent<HTMLButtonElement>,
    comment: Comment | newComment,
  ) => {
    // Initiate editing form
    e.preventDefault();
    setEditing(comment._id);
    setEditedComment(he.decode(comment.content));
    const { rows } = calculateRows(comment.content);
    setRows(rows); // Update rows state
  };

  // Update edited comment on form input
  const handleEditChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setEditedComment(e.target.value);
  };

  // When reaching a new line on the editing input, go to next line
  const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    e.target.style.height = "auto";
    e.target.style.height = e.target.scrollHeight + "px";
  };

  const toggleEmojis = () => {
    setShowEmojis(!showEmojis);
  };

  const handleEmoji = (emojiObject: EmojiClickData) => {
    const newContent = editedComment + emojiObject.emoji;
    setEditedComment(newContent);
  };

  const handleEdit = async (
    e: React.FormEvent<HTMLFormElement>,
    id: string,
    isNew = false,
  ) => {
    e.preventDefault();
    const content = {
      content: editedComment,
    };
    try {
      const response = await fetch(
        `https://faithhub-backend.fly.dev/post/${postid}/comments/${id}`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(content),
        },
      );
      const result = await response.json();
      // Refresh token
      localStorage.setItem("token", result.token);
      const decodedJWT = jwtDecode<userJwtPayload>(result.token);
      dispatch(tokenRefresh(decodedJWT.user));
      // For new comments, edit the value in new comments
      if (isNew) {
        newComments.map((comment) => {
          if (comment._id === id) {
            comment.content = editedComment;
            comment.edited = true;
          }
          return comment;
        });
      }
      // For other comments
      else {
        allComments.map((comment) => {
          if (comment._id === id) {
            comment.content = editedComment;
            comment.edited = true;
          }
          return comment;
        });
      }
      // Disable form
      setEditing();
    } catch (err) {
      setEditingError(true);
    }
  };

  const handleDelete = async (
    e: React.MouseEvent<HTMLButtonElement>,
    id: string,
    isNew = false,
  ) => {
    e.preventDefault();
    try {
      const response = await fetch(
        `https://faithhub-backend.fly.dev/post/${postid}/comments/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        },
      );
      const result = await response.json();
      // Refresh token
      localStorage.setItem("token", result.token);
      const decodedJWT = jwtDecode<userJwtPayload>(result.token);
      dispatch(tokenRefresh(decodedJWT.user));
      // Remove deleted comment from array
      if (isNew) {
        const updatedComments = newComments.filter(
          (comment) => comment._id !== id,
        );
        setNewComments(updatedComments);
      } else {
        const updatedComments = allComments.filter(
          (comment) => comment._id !== id,
        );
        setAllComments(updatedComments);
      }
    } catch (err) {
      setDeletingError(true);
    }
  };

  if (errors)
    return (
      <p className="text-center text-gray-300 italic">
        There was an error loading comments. Please try again.
      </p>
    );

  if (deletingError)
    return (
      <p className="text-center text-gray-300 italic">
        We couldn&apos;t delete this comment, please try again later.
      </p>
    );

  if (editingError)
    return (
      <p className="text-center text-gray-300 italic">
        We couldn&apos;t edit this comment, please try again later.
      </p>
    );

  if (!allComments[0] && !newComments[0])
    return <p className="text-center text-gray-300 italic">No comments yet</p>;

  if (user)
    return (
      <div>
        <Transition
          show={true}
          appear={true}
          enter="transition duration-300 ease-out"
          enterFrom="transform opacity-0 scale-y-0 origin-top"
          enterTo="transform opacity-100 scale-100 origin-top"
        >
          {allComments.map((comment) => (
            <Transition
              key={comment._id}
              show={allComments.length > 0}
              appear={true}
              enter="transition duration-300 ease-out"
              enterFrom="opacity-0 transform -translate-y-10 "
              enterTo="opacity-100 transform translate-y-0"
              leave="transition duration-200 ease-out"
              leaveFrom="opacity-100 transform translate-y-0"
              leaveTo="opacity-0 transform -translate-y-20 "
            >
              <div className="relative mb-5">
                <div className="bg-gray-50 rounded-lg p-1 md:p-2">
                  <div>
                    <Link to={`/profile/${comment.author._id}`}>
                      <img
                        className=" float-left
                     w-9 h-9 mr-2 md:mr-3 md:w-8 md:h-8 rounded-full object-cover"
                        src={`https://faithhub-backend.fly.dev/${comment.author.profile_picture}`}
                      />
                    </Link>
                    {
                      // Edit/delete menu
                      user._id === comment.author._id && (
                        <Menu as="div" className="relative float-right z-50">
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
                              className="absolute -right-2 lg:-bottom-9 lg:left-5 w-24 lg:w-28 flex
                 flex-col bg-white gap-1 drop-shadow-xl rounded-lg
                   pt-2 pb-2 justify-center"
                            >
                              <Menu.Item>
                                {({ active }) => (
                                  <button
                                    className={`${active && "bg-gray-100"} pl-2 text-left
                              text-gray-700`}
                                    onClick={(e) => toggleEdit(e, comment)}
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
                                    onClick={(e) =>
                                      handleDelete(e, comment._id)
                                    }
                                  >
                                    <FontAwesomeIcon
                                      icon={faTrash}
                                      className="pr-2"
                                    />
                                    Delete
                                  </button>
                                )}
                              </Menu.Item>
                            </Menu.Items>
                          </Transition>
                        </Menu>
                      )
                    }
                    <Link
                      to={`/profile/${comment.author._id}`}
                      className="text-gray-800 font-bold"
                    >
                      {comment.author._id === user._id
                        ? "You"
                        : `${comment.author.first_name} ${comment.author.last_name}`}
                    </Link>
                    <p className="text-gray-400 italic inline ml-3 text-sm">
                      {comment.edited && "Edited"}
                    </p>
                  </div>
                  {editing === comment._id ? (
                    <form
                      onSubmit={(e) => handleEdit(e, comment._id)}
                      className="mt-1 relative"
                    >
                      <textarea
                        name="content"
                        ref={textareaRef}
                        className="bg-gray-100 rounded-lg  pl-2 pb-2 pt-2 pr-8
                  overflow-visible resize-none  text-gray-600 relative"
                        placeholder="Your comment must be 4 characters long"
                        value={he.decode(editedComment)}
                        onChange={handleEditChange}
                        onInput={handleInput}
                        cols={60}
                        rows={rows}
                      ></textarea>
                      {isLargeDevice && (
                        <FontAwesomeIcon
                          icon={faFaceSmile}
                          onClick={toggleEmojis}
                          className="absolute lg:right-10 top-3 text-gray-400 h-5 hover:text-gray-500 
            hover:cursor-pointer"
                        />
                      )}
                      <div
                        className={`${
                          !showEmojis
                            ? "opacity-0 scale-y-0 origin-top"
                            : "opacity-100 scale-y-100 origin-top"
                        }
            absolute top-0 -right-[22rem]
            transition-all duration-200`}
                      >
                        <EmojiPicker
                          height={400}
                          onEmojiClick={(emojiObject) => {
                            handleEmoji(emojiObject);
                          }}
                        />
                      </div>
                      {editedComment.length > 4 && (
                        <button
                          type="submit"
                          className="absolute bottom-[0%]
                 -translate-y-1/2 cursor-pointer sm:right-20 md:right-12 lg:right-10"
                        >
                          <FontAwesomeIcon
                            icon={faPaperPlane}
                            className="text-cyan-400 hover:text-cyan-500"
                          />
                        </button>
                      )}
                    </form>
                  ) : (
                    <p className="mb-1">{he.decode(comment.content)}</p>
                  )}
                  <Moment
                    fromNow
                    className="text-gray-500 text-sm  italic"
                    date={comment.date}
                  ></Moment>
                  <div className="float-right">
                    <FontAwesomeIcon
                      icon={faThumbsUp}
                      onClick={() => handleLike(comment._id)}
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
            </Transition>
          ))}
        </Transition>

        {newComments.map((comment) => {
          if (comment.postid === postid)
            return (
              <Transition
                show={newComments.length > 0}
                appear={true}
                enter="transition duration-300 ease-out"
                enterFrom="opacity-0 transform -translate-y-10"
                enterTo="opacity-100 transform translate-y-0"
              >
                <div key={comment._id} className="relative mb-5">
                  <div className="bg-gray-50 rounded-lg p-2 ml-1">
                    <Link to={`/profile/${user._id}`}>
                      <div className="absolute left-0 top-0 bg-cyan-400 h-full w-1 rounded-full"></div>
                      <div>
                        <img
                          className="float-left w-9 h-9 mr-2 md:mr-3 md:w-8 md:h-8 rounded-full object-cover"
                          src={`https://faithhub-backend.fly.dev/${user.profile_picture}`}
                        />
                      </div>
                    </Link>

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
                                onClick={(e) => toggleEdit(e, comment)}
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
                                onClick={(e) =>
                                  handleDelete(e, comment._id, true)
                                }
                              >
                                <FontAwesomeIcon
                                  icon={faTrash}
                                  className="pr-2"
                                />
                                Delete
                              </button>
                            )}
                          </Menu.Item>
                        </Menu.Items>
                      </Transition>
                    </Menu>
                    <Link
                      to={`/profile/${user._id}`}
                      className="text-gray-800 font-bold"
                    >
                      You
                    </Link>

                    <p className="text-gray-400 italic inline ml-3 text-sm">
                      {comment.edited && "Edited"}
                    </p>

                    {editing === comment._id ? (
                      <form
                        onSubmit={(e) => handleEdit(e, comment._id, true)}
                        className="mt-1 relative"
                      >
                        <textarea
                          ref={textareaRef}
                          name="content"
                          className="bg-gray-100 rounded-lg  pl-2 pb-2 pt-2
                  overflow-visible resize-none pr-8 text-gray-600"
                          placeholder="Your comment must be 4 characters long"
                          value={editedComment}
                          onChange={handleEditChange}
                          onInput={handleInput}
                          rows={rows}
                        ></textarea>
                        {editedComment.length > 4 && (
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
                      <p className="mb-1">{he.decode(comment.content)}</p>
                    )}
                    <p className="text-gray-500 text-sm italic">just now</p>
                  </div>
                </div>
              </Transition>
            );
        })}

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

export default Comments;
