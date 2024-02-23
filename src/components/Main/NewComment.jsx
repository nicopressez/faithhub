import { PropTypes } from "prop-types";
import { useState, useRef } from "react";
import { useSelector } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPaperPlane } from "@fortawesome/free-solid-svg-icons";

const NewComment = ({ postid, setNewComments }) => {

  const textarea = useRef(null)

  const [comment, setComment] = useState("");

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
      <div className="flex  flex-row justify-center items-center mt-3">
        <img
          className="mb-1 w-9 h-9 mr-2 md:mr-2 md:w-10 md:h-10 rounded-full object-cover"
          src={
            user && `https://faithhub-backend.fly.dev/${user.profile_picture}`
          }
        />
        <form className="relative" onSubmit={handleSubmit}>
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
            cols="60"
            name="content"
          ></textarea>
          {comment.length > 4 && (
            <button
              type="submit"
              className="absolute bottom-[5%]
                 -translate-y-1/2 cursor-pointer right-5 
                 "
            >
              <FontAwesomeIcon
                icon={faPaperPlane}
                className="text-cyan-400 hover:text-cyan-500"
              />
            </button>
          )}
        </form>
      </div>
    );
};

NewComment.propTypes = {
  postid: PropTypes.string,
  setNewComments: PropTypes.func,
};

export default NewComment;
