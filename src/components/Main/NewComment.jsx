import { PropTypes } from "prop-types";
import { useState } from "react";
import { useSelector } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPaperPlane } from "@fortawesome/free-solid-svg-icons";
import { tokenRefresh } from "../../reducers/auth";


const NewComment = ({ postid }) => {

    const [comment, setComment] = useState("")

    const auth = useSelector(state => state.auth)
    const { user } = auth

    const handleInput = (e) => {
        e.target.style.height = 'auto';
        e.target.style.height = e.target.scrollHeight + 'px'
    }

    const handleChange = (e) => {
       setComment(e.target.value) 
    }

    const handleSubmit = async(e) => {
        e.preventDefault()
        try {
            const content= {
                content: comment
            }
            const response = await fetch(`https://faithhub-backend.fly.dev/post/${postid}/comments`, {
                method: "POST",
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem("token")}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(content)
            })
            const result = await response.json()
            console.log(result)
        } catch (err) {
            // TODO :Error page
            console.log(err)
        }
    }
    if (user) return(
        <div className="flex  flex-row justify-center items-center mt-3">
            <img
              className="w-9 h-9 mr-2 md:mr-2 md:w-10 md:h-10 rounded-full object-cover"
              src={
                user &&
                `https://faithhub-backend.fly.dev/${user.profile_picture}`
              }
            />
            <form className="relative" onSubmit={handleSubmit}>
                <textarea
                className="bg-gray-200 rounded-full  pl-2 pb-2 pt-2
                 overflow-visible resize-none pr-8"
                placeholder="Write a comment..."
                value={comment}
                onChange={handleChange}
                onInput={handleInput}
                rows="1" cols="60"
                name="content"></textarea>
                {comment.length > 4 && 
                <button type="submit" className="absolute bottom-[0%]
                 -translate-y-1/2 cursor-pointer right-3">
                <FontAwesomeIcon icon={faPaperPlane} 
                className="text-cyan-400 hover:text-cyan-500"/>
                
                </button>}
               
            </form>
        </div>
    )
    
}

NewComment.propTypes = {
    postid: PropTypes.string,
}

export default NewComment