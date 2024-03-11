import { useSelector, useDispatch } from "react-redux";
import { useEffect, useRef, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight, faFaceSmile, faCircleInfo } from "@fortawesome/free-solid-svg-icons";
import { Transition } from "@headlessui/react";
import { Link } from "react-router-dom";
import { PropTypes } from "prop-types";
import { tokenRefresh } from "../../reducers/auth";
import EmojiPicker from "emoji-picker-react";
import { useMediaQuery } from "@uidotdev/usehooks";
import NewPostLoading from "./NewPostLoading";


const NewPost = ({ setAllPosts, own }) => {

  // Get device size for big screens
  const isLargeDevice = useMediaQuery("only screen and (min-width: 1040px)");

  const textareaRef = useRef(null);

  const dispatch = useDispatch();
  const [post, setPost] = useState("");
  const [type, setType] = useState("Discussion");
  const [showEmojis, setShowEmojis] = useState(false);

  const [isLoading, setIsLoading] = useState(true)

  const auth = useSelector((state) => state.auth);
  const { user } = auth;

  useEffect(() => {
    const handleResize = () => {
      if (textareaRef.current) {
        // Get width of the main div of the new post section
        const parentWidth = textareaRef.current.parentNode.parentNode.parentNode.clientWidth;
        
        // Set textarea width as a percentage of main div width
        textareaRef.current.style.width = `${parentWidth * 0.9}px`;
      }
    };

    window.addEventListener('resize', handleResize);
    handleResize();

    return () => {
      window.removeEventListener('resize', handleResize);
    };
}, [])

  useEffect(() => {
    setTimeout(() => {
      setIsLoading(false)
    }, 200);
  },[])

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

  // Loading page
  if (isLoading) return <NewPostLoading own={own}/>

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
            ml-auto mr-auto mt-[3.8rem] md:mt-[4.5rem] bg-white min-h-[10rem] lg:min-h-48
             rounded-lg drop-shadow-md p-2 lg:p-6 lg:pt-5 font-Rubik
             text-sm md:text-base
             ${own ? "lg:w-[60%]" : "lg:w-[50%]"}`}
        >
          <div
            className="flex  flex-row mt-3 justify-center relative
        "
          >
            <Link to={`/profile/${user._id}`}>
              <img
                className={`w-9 hidden h-9 mr-2 lg:mr-3 md:w-12 md:h-12 rounded-full object-cover md:inline
              `}
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
                  className={`bg-gray-200 rounded-full pl-4 pt-2 pb-2 
                 overflow-visible resize-none pr-8 
                 h-auto lg:min-h-[3rem] lg:pt-3
                 `}
                  placeholder="What's on your mind..."
                  value={post}
                  onChange={handleChange}
                  onInput={handleInput}
                  rows="1"
                 
                  name="content"
                ></textarea>
                {isLargeDevice &&
                  <FontAwesomeIcon
                  icon={faFaceSmile}
                  onClick={toggleEmojis}
                  className="absolute right-3 top-3 text-gray-400 h-5 hover:text-gray-500 
            hover:cursor-pointer"
                />}
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
              </div>
              {post.length > 4 && (
                <button
                  type="submit"
                  className="absolute bottom-[10%]
                 -translate-y-1/2 cursor-pointer right-5"
                ></button>
              )}
              <hr className="mt-2 text-center"></hr>
              <div className="grid grid-cols-3 gap-1 lg:gap-3 mt-3">
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
                 {!isLargeDevice ? "Prayer" : "Prayer Request"}
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
              <div className="mt-2 lg:mt-3">
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
                  <div className="relative">
                  Anonymous
                  {isLargeDevice &&
                  <div className="inline group">
                  <FontAwesomeIcon icon={faCircleInfo} 
                  className=" text-gray-300 h-3 w-3 align-top pl-1"/>
                  <p className="absolute -top-4 hidden group-hover:inline w-[18rem]
                  bg-gray-100 rounded-lg p-1 italic border-2 border-gray-300
                  text-gray-600 ml-1 text-sm"
                  >Hides your details but keeps your request visible for others to interact with.</p>
                  </div> }
                  
                  
                  <input
                    type="checkbox"
                    className="ml-1"
                    id="anonymous"
                    name="anonymous"
                  ></input>
                  </div>
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
                    className="text-center bg-gray-200 p-1 pl-2 pr-7 md:pl-4 md:pr-8 rounded-full
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
