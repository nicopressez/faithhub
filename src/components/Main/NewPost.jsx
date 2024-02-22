import { useSelector } from "react-redux"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faPaperPlane } from "@fortawesome/free-solid-svg-icons"
import { useState } from "react"

const NewPost = () => {

    const [post, setPost] = useState("")

    const auth = useSelector(state => state.auth)
    const { user } = auth

    const handleChange = (e) => {
        setPost(e.target.value)
    }

    const handleSubmit = async(e) => {
        e.preventDefault()
    }

// When reaching a new line on the editing input, go to next line
  const handleInput = (e) => {
    e.target.style.height = "auto";
    e.target.style.height = e.target.scrollHeight + "px";
  };
    
    return (
        <div
        className=" 
            ml-auto mr-auto mt-20 lg:mt-20 bg-white lg:w-[45%]
             rounded-lg drop-shadow-md p-1 pb-8 lg:p-2 font-Rubik">
        <div className="flex  flex-row mt-3 justify-center
        items-center">
        <img
          className=" mb-12 w-9 h-9 mr-2 md:mr-5 md:w-12 md:h-12 rounded-full object-cover"
          src={
            user && `https://faithhub-backend.fly.dev/${user.profile_picture}`
          }
        />
        <form className="relative" onSubmit={handleSubmit}>
          <textarea
            className="bg-gray-200 rounded-full pl-4 pt-3 pb-2 
                 overflow-visible resize-none pr-8
                 h-auto min-h-[3rem]"
            placeholder="What's on your mind..."
            value={post}
            onChange={handleChange}
            onInput={handleInput}
            rows="1"
            cols="70"
            name="content"
          ></textarea>
          {post.length > 4 && (
            <button
              type="submit"
              className="absolute bottom-[10%]
                 -translate-y-1/2 cursor-pointer right-5"
            >
            </button>
          )}
        <hr className="mt-2 text-center"></hr>
        <div className="grid grid-cols-4 mt-2">
        <label htmlFor="discussion"> Discussion
        <input onChange={() => console.log("check")} type="radio" className="w-0 h-0" name="discussion
        " id="discussion"></input>
        </label>
        <label htmlFor="prayer"> Prayer Request
        <input onChange={() => console.log("check")} type="radio" className="w-0 h-0" name="discussion
        " id="prayer"></input>
        </label>
        <button>Testimony</button>
        <button>Post</button>
        </div>
        </form>
        
      </div>
             </div>
    )
}

export default NewPost