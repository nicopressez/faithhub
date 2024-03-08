import { useSelector, useDispatch } from "react-redux";
import { useRef, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight, faFaceSmile } from "@fortawesome/free-solid-svg-icons";
import { Transition } from "@headlessui/react";
import { Link } from "react-router-dom";
import { PropTypes } from "prop-types";
import { tokenRefresh } from "../../reducers/auth";
import EmojiPicker from "emoji-picker-react";

const NewPost = ({ setAllPosts, own }) => {
  const textareaRef = useRef(null);

  const dispatch = useDispatch();
  const [post, setPost] = useState("");
  const [type, setType] = useState("Discussion");
  const [showEmojis, setShowEmojis] = useState(false);

  const auth = useSelector((state) => state.auth);
  const { user } = auth;

  const handleChange = (e) => {
    setPost(e.target.value);
  };

  const handleType = (e) => {
    setType(e.target.value);
  };

  const toggleEmojis = () => {
    setShowEmojis(!showEmojis);
  };

  const handleEmoji = (emojiObject) => {
    setPost((prevPost) => prevPost + emojiObject.emoji);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = {
      content: post,
      type,
      anonymous: type === "Prayer Request" ? e.target.anonymous.checked : false,
    };
    try {
      const response = await fetch(`https://faithhub-backend.fly.dev/post`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      const result = await response.json();
      // Refresh token
      localStorage.setItem("token", result.token);
      dispatch(tokenRefresh(result.user));
      // Add post to array
      setAllPosts((prevPosts) => [result.post, ...prevPosts]);
      // Reset post form
      setShowEmojis(false);
      setPost("");
      setType("Discussion");
      setTimeout(() => {
        textareaRef.current.style.height = "auto";
      }, 50);
    } catch (err) {
      // TODO: Add error handling
      console.log(err);
    }
  };

  // Adjust textarea sizing and border radius on input
  const handleInput = (e) => {
    e.target.style.height = "auto";
    e.target.style.height = e.target.scrollHeight + "px";
    if (
      e.target.scrollHeight >
      parseInt(getComputedStyle(e.target).getPropertyValue("height"))
    ) {
      e.target.style.borderRadius = "0.5rem";
    } else {
      e.target.style.borderRadius = "2rem";
    }
  };

  if (user)
    return (
      <Transition
        enter="transition-opacity duration-200"
        enterFrom="opacity-0"
        enterTo="opacity-100"
        show={true}
        appear={true}
      >
        <div
          className={`relative z-10
            ml-auto mr-auto mt-[3.5rem] lg:mt-[4.5rem] bg-white min-h-48
             rounded-lg drop-shadow-md p-1 pb-8 lg:pl-[2%] lg:p-2 lg:pt-5 font-Rubik+
             ${own ? "md:w-[55%]" : "md:w-[45%]"}`}
        >
          <div
            className="flex  flex-row mt-3 justify-center relative
        items-center"
          >
            <Link to={`/profile/${user._id}`}>
              <img
                className={`absolute top-0 w-9 h-9 mr-2 md:mr-5 md:w-12 md:h-12 rounded-full object-cover
              left-[3%]`}
                src={
                  user &&
                  `https://faithhub-backend.fly.dev/${user.profile_picture}`
                }
              />
            </Link>
            <form className="relative" onSubmit={handleSubmit}>
              <div className="relative ">
                <textarea
                  ref={textareaRef}
                  className={`bg-gray-200 rounded-full pl-4 pt-3 pb-2 
                 overflow-visible resize-none pr-8
                 h-auto min-h-[3rem]`}
                  placeholder="What's on your mind..."
                  value={post}
                  onChange={handleChange}
                  onInput={handleInput}
                  rows="1"
                  cols={own ? "105" : "80"}
                  name="content"
                ></textarea>
                <FontAwesomeIcon
                  icon={faFaceSmile}
                  onClick={toggleEmojis}
                  className="absolute right-3 top-3 text-gray-400 h-5 hover:text-gray-500 
            hover:cursor-pointer"
                />
                <div
                  className={`${
                    !showEmojis
                      ? "opacity-0 scale-y-0 origin-top"
                      : "opacity-100 scale-y-100 origin-top"
                  }
            absolute top-0 
            ${own ? "-right-[41%]" : "-right-[54%]"}
            transition-all duration-200`}
                >
                  <EmojiPicker
                    onEmojiClick={(emojiObject) => {
                      handleEmoji(emojiObject);
                    }}
                  />
                </div>
              </div>
              {post.length > 4 && (
                <button
                  type="submit"
                  className="absolute bottom-[10%]
                 -translate-y-1/2 cursor-pointer right-5"
                ></button>
              )}
              <hr className="mt-2 text-center"></hr>
              <div className="grid grid-cols-3 gap-5 mt-3">
                <label
                  htmlFor="discussion"
                  className={` border-cyan-400 border-4 rounded-full
         text-center  transition-all duration-300 hover:cursor-pointer
        ${type === "Discussion" ? "bg-cyan-400" : ""}
        ${type !== "Discussion" ? "hover:bg-gray-100" : ""}`}
                >
                  Discussion
                  <input
                    onChange={handleType}
                    type="radio"
                    defaultChecked={true}
                    id="discussion"
                    name="type"
                    value="Discussion"
                    className=" w-0 h-0"
                  ></input>
                </label>

                <label
                  htmlFor="prayer"
                  className={` border-cyan-400 border-4 rounded-full 
         text-center transition-all duration-300 hover:cursor-pointer
        ${type === "Prayer Request" ? "bg-cyan-400" : ""}
        ${type !== "Prayer Request" ? "hover:bg-gray-100" : ""}
        `}
                >
                  Prayer Request
                  <input
                    onChange={handleType}
                    value="Prayer Request"
                    type="radio"
                    id="prayer"
                    name="type"
                    className="w-0 h-0"
                  ></input>
                </label>

                <label
                  htmlFor="testimony"
                  className={` border-cyan-400 border-4 rounded-full
         text-center  transition-all duration-300 hover:cursor-pointer
        ${type === "Testimony" ? "bg-cyan-400" : ""}
        ${type !== "Testimony" ? "hover:bg-gray-100" : ""}`}
                >
                  Testimony
                  <input
                    onChange={handleType}
                    type="radio"
                    id="testimony"
                    name="type"
                    value="Testimony"
                    className="w-0 h-0"
                  ></input>
                </label>
              </div>
              <div className="mt-3">
                <Transition
                  as="label"
                  htmlFor="anonymous"
                  className="absolute left-1/2 -translate-x-1/2"
                  show={type === "Prayer Request"}
                  enter="transition duration-200 ease-out"
                  enterFrom="opacity-0 transform scale-y-0 origin-top"
                  enterTo="opacity-100 transform scale-y-100 origin-top"
                  leave="transition duration-200 ease-out"
                  leaveFrom="opacity-100 transform scale-y-100 origin-top"
                  leaveTo="opacity-0 transform scale-y-0 origin-top"
                >
                  Anonymous
                  <input
                    type="checkbox"
                    className="ml-1"
                    id="anonymous"
                    name="anonymous"
                  ></input>
                </Transition>

                <Transition
                  className={"float-right"}
                  show={post.length > 10}
                  enter="transition duration-100 ease-out"
                  enterFrom="transform scale-y-0 origin-top opacity-0"
                  enterTo="transform scale-y-100 origin-top opacity-100"
                  leave="transition duration-100 ease-out"
                  leaveFrom="transform scale-y-100 origin-top opacity-100"
                  leaveTo="transform scale-y-0 origin-top opacity-0"
                >
                  <button
                    type="submit"
                    className="text-center bg-gray-200 p-1 pl-4 pr-8 rounded-full
        relative group hover:bg-cyan-400 transition-all duration-200"
                  >
                    Post
                    <FontAwesomeIcon
                      icon={faArrowRight}
                      className="text-cyan-400 text-right absolute right-2 top-1/2
                 -translate-y-1/2 font-bold w-4 h-4 group-hover:text-black
                 transition-all duration-200"
                    />
                  </button>
                </Transition>
              </div>
            </form>
          </div>
        </div>
      </Transition>
    );
};

NewPost.propTypes = {
  setAllPosts: PropTypes.func,
  own: PropTypes.bool,
};

export default NewPost;
