import { useSelector } from "react-redux"
import { useState } from "react"

const NewPost = () => {

    const [post, setPost] = useState("")
    const [type, setType] = useState("Discussion")

    const auth = useSelector(state => state.auth)
    const { user } = auth

    const handleChange = (e) => {
        setPost(e.target.value)
    }

    const handleType = (e) => {
        setType(e.target.value)
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
        <div className="grid grid-cols-3 gap-5 mt-3">

        <label htmlFor="discussion"
         className={` border-cyan-400 border-4 rounded-full
         text-center  transition-all duration-500 hover:cursor-pointer
        ${type === "Discussion" ? "bg-cyan-400" : ""}
        ${type !== "Discussion" ? "hover:bg-gray-100" : ""}`}>
             Discussion 
        <input  
        onChange={handleType}
        type="radio" 
        defaultChecked={true}
        id="discussion"
        name="type"
        value="Discussion"
        className=" w-0 h-0"></input>
        </label>
        
        <label htmlFor="prayer"
         className={` border-cyan-400 border-4 rounded-full
         text-center transition-all duration-500 hover:cursor-pointer
        ${type === "Prayer Request" ? "bg-cyan-400" : ""}
        ${type !== "Prayer Request" ? "hover:bg-gray-100" : ""}
        `}> 
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

        <label htmlFor="testimony"
         className={` border-cyan-400 border-4 rounded-full
         text-center  transition-all duration-500 hover:cursor-pointer
        ${type === "Testimony" ? "bg-cyan-400" : ""}
        ${type !== "Testimony" ? "hover:bg-gray-100" : ""}`}>
        Testimony
        <input 
        onChange={handleType}
        type="radio"  
        id="testimony"
        name="type"  
        value="Testimony"
        className="w-0 h-0"
        >

        </input>
        </label>
        
        </div>
        </form>
        
      </div >
             </div>
    )
}

export default NewPost