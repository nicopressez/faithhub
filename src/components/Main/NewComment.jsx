import { PropTypes } from "prop-types";
import { useState, useRef } from "react";
import { useSelector } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { lazy, Suspense } from 'react';
import { faPaperPlane, faFaceSmile } from "@fortawesome/free-solid-svg-icons";
const EmojiPicker = lazy(() => import('emoji-picker-react'));

const NewComment = ({ postid, setNewComments }) => {

  const textarea = useRef(null)

  const [comment, setComment] = useState("");
  const [showEmojis, setShowEmojis] = useState(false)

  const auth = useSelector((state) => state.auth);
  const { user } = auth;

  // Adjust textarea sizing and border radius on input
  const handleInput = (e) => {
    e.target.style.height = "auto";
    e.target.style.height = e.target.scrollHeight + "px";
    if (e.target.scrollHeight > parseInt(getComputedStyle(e.target).getPropertyValue('height'))) {
      e.target.style.borderRadius = "0.5rem"; 
    } else {
      e.target.style.borderRadius = "2rem";
    }
  };

  const handleChange = (e) => {
    setComment(e.target.value);
  };

  const toggleEmojis = () => {
    setShowEmojis(!showEmojis)
  }

  const handleEmoji = (emojiObject) => {
    setComment(prevComment => prevComment + emojiObject.emoji)
  }

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
      // Add comment to array
      setNewComments((prevComments) => [...prevComments, newComment]);
      // Reset form
      setComment("");
      setTimeout(() => {
        textarea.current.style.height = "auto"
      }, 50);
    } catch (err) {
      // TODO :Error page
      console.log(err);
    }
  };
  if (user)
    return (
      <div className="relative z-50 flex  flex-row justify-center items-center mt-3">
        <img
          className="mb-1 w-9 h-9 mr-2 md:mr-2 md:w-10 md:h-10 rounded-full object-cover"
          src={
            user && `https://faithhub-backend.fly.dev/${user.profile_picture}`
          }
        />
        <form className="relative z-50" onSubmit={handleSubmit}>
          <div className="relative z-50">
          <textarea
          ref={textarea}
            className="bg-gray-200 rounded-full  pl-4 pb-2 pt-2
                 overflow-visible resize-none pr-10
                 h-auto"
            placeholder="Write a comment..."
            value={comment}
            onChange={handleChange}
            onInput={handleInput}
            rows="1"
            cols="65"
            name="content"
          ></textarea>
          <FontAwesomeIcon icon={faFaceSmile} 
            onClick={toggleEmojis}
            className="absolute right-3 bottom-[1.2rem] text-gray-400 h-5 hover:text-gray-500 
            hover:cursor-pointer"
            />
            <div
            className={`${!showEmojis 
              ? "opacity-0 scale-y-0 origin-bottom"
              : "opacity-100 scale-y-100 origin-bottom"}
            absolute bottom-0 left-[101%]
            transition-all duration-200 z-50`}>
              {showEmojis && 
              <Suspense fallback={<div>Loading...</div>}>
                <EmojiPicker onEmojiClick={(emojiObject) => handleEmoji(emojiObject)}/>
              </Suspense>}
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
    );
};

NewComment.propTypes = {
  postid: PropTypes.string,
  setNewComments: PropTypes.func,
};

export default NewComment;
