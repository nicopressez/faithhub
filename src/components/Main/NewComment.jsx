import { PropTypes } from "prop-types";
import { useState } from "react";
import { useSelector } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPaperPlane } from "@fortawesome/free-solid-svg-icons";


const NewComment = ({ postid }) => {

    const [comment, setComment] = useState("")

    const auth = useSelector(state => state.auth)
    const { user } = auth

    const handleInput = (e) => {
        e.target.style.height = 'auto';
        e.target.style.height = event.target.scrollHeight + 'px'
    }

    const handleChange = (e) => {
       setComment(e.target.value) 
    }
    if (user) return(
        <div className="flex  flex-row justify-center items-center mt-5">
            <img
              className="w-9 h-9 mr-2 md:mr-2 md:w-10 md:h-10 rounded-full object-cover"
              src={
                user &&
                `https://faithhub-backend.fly.dev/${user.profile_picture}`
              }
            />
            <form className="relative">
                <textarea
                className="bg-gray-200 rounded-lg  pl-2 pb-1 pt-1
                 overflow-visible resize-none"
                placeholder="Write a comment..."
                value={comment}
                onChange={handleChange}
                onInput={handleInput}
                rows="1" cols="60"></textarea>
                {comment && 
                <button type="submit" className="absolute top-[50%]
                 -translate-y-1/2 cursor-pointer right-3">
                <FontAwesomeIcon icon={faPaperPlane} 
                className=""/>
                
                </button>}
               
            </form>
        </div>
    )
    
}

NewComment.propTypes = {
    postid: PropTypes.string,
}

export default NewComment