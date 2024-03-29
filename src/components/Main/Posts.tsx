import React,{ useEffect, useRef, useState } from "react";
import { useAppSelector, useAppDispatch } from "../../reducers/hooks";
import { tokenRefresh } from "../../reducers/auth";
import Moment from "react-moment";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faThumbsUp,
  faEllipsisVertical,
  faTrash,
  faPenToSquare,
  faPaperPlane,
  faHandsPraying,
  faFaceSmile,
} from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom/dist";
import Comments, { newComment, userJwtPayload } from "./Comments";
import NewComment from "./NewComment";
import defaultImg from "../../assets/defaultProfile.png";
import he from "he";
import { Menu, Transition } from "@headlessui/react";
import { jwtDecode } from "jwt-decode";
import PostsLoading from "./PostsLoading";
import { useMediaQuery } from "@uidotdev/usehooks";
import EmojiPicker, { EmojiClickData } from "emoji-picker-react";
import { PostsType } from "./Homepage";

type PostsProps = {
  allPosts: PostsType[];
  setAllPosts: React.Dispatch<React.SetStateAction<PostsType[]>>;
  own?: boolean;
  profileId?: string;
}

type EditedPostType = {
  content: string;
  type: string;
}

const Posts = ({ allPosts, setAllPosts, own, profileId } : 
  PostsProps) => {
  // Get device size to adjust design for small screens
  const isLargeDevice = useMediaQuery("only screen and (min-width: 1040px)");

  const auth = useAppSelector((state) => state.auth);

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [rows, setRows] = useState(1);

  const [error, setError] = useState(false);
  const [likedPosts, setLikedPosts] = useState<string[]>([]);
  const [newComments, setNewComments] = useState<newComment[]>([]);
  const [editing, setEditingInternal] = useState<string>();
  // Allow to set edit without argument
  const setEditing = (value?: string) => setEditingInternal(value);

  const [editedPost, setEditedPost] = useState<EditedPostType>({
    content: "",
    type:""
  });
  const [showEmojis, setShowEmojis] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const dispatch = useAppDispatch();

  const { user } = auth;

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        if (own) {
          // Get posts for profile page only
          const response = await fetch(
            `https://faithhub-backend.fly.dev/post/user/${profileId}`,
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
        } else {
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
        }
        // Toggle loading state
        setTimeout(() => {
          setIsLoading(false);
        }, 500);
      } catch (err) {
        setError(true);
      }
    };
    fetchPosts();
  }, [dispatch, setAllPosts, profileId, own]);

  useEffect(() => {
    const postsUserLiked: string[] = [];
    // Go through all posts likes and look for match with user id
    allPosts.map((post) => {
      for (let i = 0; i < post.likes.length; i++) {
        if (post.likes[i] === user?._id) {
          postsUserLiked.push(post._id);
        }
      }
    });
    setLikedPosts(postsUserLiked);
  }, [allPosts, user]);

  useEffect(() => {
    const handleResize = () => {
      if (textareaRef.current) {
        // Get width of the main div of the post edit form
        const parentWidth =
          (textareaRef.current.parentNode?.parentNode as HTMLElement).clientWidth;

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

  const handleLike = async (id: string) => {
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
      if(user) 
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
      setError(true);
    }
  };

  const calculateRows = (content: string) => {
    // Calculate rows based on post content
    const numRows = Math.max(3, Math.ceil(content.length / 60));
    return { rows: numRows };
  };

  const toggleEdit = (e: React.MouseEvent<HTMLButtonElement>, post: PostsType) => {
    e.preventDefault();
    setEditing(post._id);
    setEditedPost({
      content: he.decode(post.content),
      type: post.type,
    });
    const { rows } = calculateRows(post.content);
    setRows(rows); // Update rows state
  };

  // Update edited comment on form input
  const handleEditChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setEditedPost({
      content: e.target.value,
      type: editedPost.type,
    });
  };

  // When reaching a new line on the editing input, go to next line
  const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    e.target.style.height = "auto";
    e.target.style.height = e.target.scrollHeight + "px";
  };

  const handleTypeEdit = (e: React.ChangeEvent<HTMLSelectElement>) => {
    editedPost.type = e.target.value;
  };

  const toggleEmojis = () => {
    setShowEmojis(!showEmojis);
  };

  const handleEmoji = (emojiObject: EmojiClickData) => {
    const newContent = editedPost.content + emojiObject.emoji;
    const newPost = { ...editedPost, content: newContent };
    setEditedPost(newPost);
  };

  const handleEdit = async (e: React.FormEvent<HTMLFormElement>, id: string) => {
    e.preventDefault();
    const data = {
      content: editedPost.content,
      type: editedPost.type,
    };
    try {
      const response = await fetch(
        `https://faithhub-backend.fly.dev/post/${id}`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        },
      );
      const result = await response.json();
      // Refresh token
      localStorage.setItem("token", result.token);
      const decodedJWT = jwtDecode<userJwtPayload>(result.token);
      dispatch(tokenRefresh(decodedJWT.user));
      // Update post info
      allPosts.map((post) => {
        if (post._id === id) {
          (post.edited = true), (post.content = editedPost.content);
          post.type = editedPost.type;
        }
        return post;
      });
      // Toggle form back to post
      setEditing();
    } catch (err) {
      setError(true);
    }
  };

  const handleDelete = async (e: React.MouseEvent<HTMLButtonElement>, id: string) => {
    e.preventDefault();
    try {
      const response = await fetch(
        `https://faithhub-backend.fly.dev/post/${id}`,
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
      // Remove deleted post
      const updatedPosts = allPosts.filter((post) => post._id !== id);
      setAllPosts(updatedPosts);
    } catch (err) {
      setError(true);
    }
  };

  // Loading page
  if (isLoading) return <PostsLoading own={own} />;

  // If rendering from profile page and no activity yet
  if (own && !isLoading && !allPosts[0])
    return (
      <p
        className="
    mt-20 lg:mt-32
    text-center mt-50 z-50 text-gray-400 w-full italic font-Rubik
    text-xl"
      >
        No recent activity
      </p>
    );

  if (error)
    return (
      <Transition
        className="mt-9 lg:mt-20"
        appear={true}
        show={true}
        enter="transition duration-300"
        enterFrom="opacity-0 transform scale-y-0 origin-top"
        enterTo="opacity-100 transform scale-y-100 origin-top"
      >
        <p className="text-center text-red-600 italic font-Rubik">
          An error occured while loading posts, please try again later.
        </p>
      </Transition>
    );

  if (user && likedPosts)
    return allPosts.map((post) => (
      <Transition
        key={post._id}
        enter="transition duration-200"
        enterFrom="opacity-0 transform -translate-y-10"
        enterTo="opacity-100 transform translate-y-0"
        appear={true}
        show={allPosts.length > 0}
      >
        <div
          className={`ml-auto mr-auto mt-9 lg:mt-20 bg-white
             rounded-lg drop-shadow-md p-3 md:p-5 font-Rubik
             relative z-0
             ${own ? "lg:w-[60%]" : "lg:w-[50%]"}`}
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
                  enterFrom="opacity-0 transform scale-y-0 origin-top"
                  enterTo="opacity-100 transform scale-y-100 origin-top "
                  leave="transition duration-200 ease-out"
                  leaveFrom="opacity-100 transform scale-y-100 origin-top"
                  leaveTo="opacity-0 transform scale-y-0 origin-top"
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

          {editing === post._id ? (
            <select className="float-right mr-3" onChange={handleTypeEdit}>
              <option
                selected={post.type === "Discussion" ? true : false}
                value="Discussion"
              >
                Discussion
              </option>
              <option
                selected={post.type === "Prayer Request" ? true : false}
                value="Prayer Request"
              >
                Prayer Request
              </option>
              <option
                selected={post.type === "Testimony" ? true : false}
                value="Testimony"
              >
                Testimony
              </option>
            </select>
          ) : (
            <p className="float-right mr-3">{post.type}</p>
          )}
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
            {post.edited && (
              <p className="text-gray-400 italic inline ml-3 text-sm font-normal">
                Edited
              </p>
            )}
          </p>

          <Moment fromNow className="  italic" date={post.date}></Moment>

          {editing === post._id ? (
            <form
              onSubmit={(e) => handleEdit(e, post._id)}
              className="mt-1 relative"
            >
              <textarea
                ref={textareaRef}
                name="content"
                className="bg-gray-100 rounded-lg  pl-2 pb-2 pt-2
                  overflow-visible resize-none pr-8 text-gray-600"
                placeholder="Your comment must be 4 characters long"
                value={editedPost.content}
                onChange={handleEditChange}
                onInput={handleInput}
                rows={rows}
              ></textarea>
              {isLargeDevice && (
                <FontAwesomeIcon
                  icon={faFaceSmile}
                  onClick={toggleEmojis}
                  className="absolute lg:right-16 top-3 text-gray-400 h-5 hover:text-gray-500 
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
              {editedPost.content.length > 4 && (
                <button
                  type="submit"
                  className="absolute bottom-[0%]
                 -translate-y-1/2 cursor-pointer sm:right-26 md:right-20 lg:right-16"
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
              icon={
                post.type === "Prayer Request" ? faHandsPraying : faThumbsUp
              }
              onClick={() => handleLike(post._id)}
              className={`
                mr-1  w-5 h-5 hover:text-cyan-500
                hover:cursor-pointer active:text-cyan-600
                transition-colors duration-300
                ${
                  likedPosts.some((id) => post._id === id)
                    ? "text-cyan-600"
                    : "text-cyan-400"
                }
                `}
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
      </Transition>
    ));
};

export default Posts;
