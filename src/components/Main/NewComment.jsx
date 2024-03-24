import { PropTypes } from "prop-types";
import { useState, useRef, useEffect } from "react";
import { useSelector } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { lazy, Suspense } from "react";
import { faPaperPlane, faFaceSmile } from "@fortawesome/free-solid-svg-icons";
const EmojiPicker = lazy(() => import("emoji-picker-react"));
import { useMediaQuery } from "@uidotdev/usehooks";
import { Transition } from "@headlessui/react";


const NewComment = ({ postid, setNewComments }) => {

  // Get device size to adjust design for small screens
  const isLargeDevice = useMediaQuery("only screen and (min-width: 1040px)");

  const textarea = useRef(null);

  const [error, setError] = useState(false)
  const [comment, setComment] = useState("");
  const [showEmojis, setShowEmojis] = useState(false);

  const auth = useSelector((state) => state.auth);
  const { user } = auth;

  useEffect(() => {
    const handleResize = () => {
      if (textarea.current) {
        // Get width of the main div of the new comment section
        const parentWidth = textarea.current.parentNode.parentNode.parentNode.clientWidth;
        
        // Set textarea width as a percentage of main div width
        textarea.current.style.width = `${parentWidth * 0.8}px`;
      }
    };

    window.addEventListener('resize', handleResize);
    handleResize();

    return () => {
      window.removeEventListener('resize', handleResize);
    };
}, [])

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

  const handleChange = (e) => {
    setComment(e.target.value);
  };

  const toggleEmojis = () => {
    setShowEmojis(!showEmojis);
  };

  const handleEmoji = (emojiObject) => {
    setComment((prevComment) => prevComment + emojiObject.emoji);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const content = {
        content: comment,
      };
      const response = await fetch(
        `https://faithhub-backend.fly.dev/post/${postid}/comments`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(content),
        },
      );
      const result = await response.json();
      const newComment = { ...result.comment, postid };
      console.log(newComment)
      // Add comment to array
      setNewComments((prevComments) => [...prevComments, newComment]);
      // Reset form
      setComment("");
      setTimeout(() => {
        textarea.current.style.height = "auto";
      }, 50);
    } catch (err) {
      setError(true)
    }
  };
  if (user)
    return (
      <>
      <div className="relative z-50 flex  flex-row justify-center items-center mt-3 
       text-sm md:text-base">
        <img
          className="mb-1 w-9 h-9 mr-2 md:mr-2 md:w-10 md:h-10 rounded-full object-cover
          hidden md:inline"
          src={
            user && `https://faithhub-backend.fly.dev/${user.profile_picture}`
          }
        />
        <form className="relative z-50" onSubmit={handleSubmit}>
          <div className="relative z-50">
            <textarea
              ref={textarea}
              className="bg-gray-200 rounded-full  pl-4 pb-2 pt-2
                 overflow-visible resize-none pr-8
                 h-auto"
              placeholder="Write a comment..."
              value={comment}
              onChange={handleChange}
              onInput={handleInput}
              rows="1"
              name="content"
            ></textarea>

            {isLargeDevice &&
              <FontAwesomeIcon
              icon={faFaceSmile}
              onClick={toggleEmojis}
              className="absolute right-3 top-2 text-gray-400 h-5 hover:text-gray-500 
            hover:cursor-pointer"
            />}
            <div
              className={`${
                !showEmojis
                  ? "opacity-0"
                  : "opacity-100"
              }
            absolute bottom-0 -right-[22rem]
            transition duration-300 z-50`}
            >
              {showEmojis && (
                <Suspense fallback={<div>Loading...</div>}>
                  <EmojiPicker
                    height={400}
                    onEmojiClick={(emojiObject) => handleEmoji(emojiObject)}
                  />
                </Suspense>
              )}
            </div>
            {comment.length > 4 && (
              <button
                type="submit"
                className="absolute bottom-4 z-50
                  cursor-pointer right-10
                 "
              >
                <FontAwesomeIcon
                  icon={faPaperPlane}
                  className="text-cyan-400 hover:text-cyan-500"
                />
              </button>
            )}
          </div>
        </form>
      </div>
      {error && 
      <Transition
      className="-mb-2"
      appear={true}
      show={true}
      enter="transition duration-300"
      enterFrom="opacity-0 transform scale-y-0 origin-top"
      enterTo="opacity-100 transform scale-y-100 origin-top">
      <p className="text-center text-red-500 italic">
        Your comment couldn&apos;t be posted. Please try again later
      </p>
      </Transition>}
      </>
    );
};

NewComment.propTypes = {
  postid: PropTypes.string,
  setNewComments: PropTypes.func,
};

export default NewComment;
